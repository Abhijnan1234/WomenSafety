import cv2
import numpy as np
from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort
import itertools
import math
import mediapipe as mp
import csv
import os
import datetime

# 1. Load YOLO model (weights can be custom or coco)
yolo = YOLO('yolov5s.pt')  

# 2. Initialize DeepSORT tracker
tracker = DeepSort(
    max_age=30,             # frames to keep “lost” tracks before deletion
    n_init=3,               # consecutive hits before confirmation
    max_cosine_distance=0.4 # embedding distance threshold
)

# 3. Load OpenCV DNN gender model
gender_net = cv2.dnn.readNetFromCaffe(
    'models/deploy_gender.prototxt',
    'models/gender_net.caffemodel'
)
GENDER_LIST = ['female', 'male']

# 4. Node storage
nodes = {}  # track_id -> {first_seen: frame_idx, attributes: {...}}

video_path = 'data/videos/CAM02.mp4'

cap = cv2.VideoCapture(video_path)
frame_idx = 0

# Load Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

def classify_gender(person_crop):
    try:
        h_crop, w_crop = person_crop.shape[:2]
        face_crop = person_crop[0:int(h_crop*0.8), :]
        gray = cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 5)
        if len(faces) == 0:
            gray_full = cv2.cvtColor(person_crop, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray_full, 1.1, 5)
            if len(faces) == 0:
                # If no face found, randomly assign gender
                import random
                return random.choice(GENDER_LIST)
            (fx, fy, fw, fh) = max(faces, key=lambda f: f[2]*f[3])
            face_img = person_crop[fy:fy+fh, fx:fx+fw]
        else:
            (fx, fy, fw, fh) = max(faces, key=lambda f: f[2]*f[3])
            face_img = face_crop[fy:fy+fh, fx:fx+fw]
        face_blob = cv2.dnn.blobFromImage(
            face_img, 1.0, (227, 227),
            (78.4263377603, 87.7689143744, 114.895847746), swapRB=False
        )
        gender_net.setInput(face_blob)
        gender_preds = gender_net.forward()
        gender = GENDER_LIST[gender_preds[0].argmax()]
        return gender
    except Exception:
        # On error, randomly assign gender
        import random
        return random.choice(GENDER_LIST)

def get_center(bbox):
    x, y, w, h = bbox
    return (x + w // 2, y + h // 2)

def compute_distances(nodes):
    # Returns a list of tuples: (id1, id2, distance)
    pairs = []
    node_items = list(nodes.items())
    for (id1, data1), (id2, data2) in itertools.combinations(node_items, 2):
        c1 = get_center(data1['bbox'])
        c2 = get_center(data2['bbox'])
        dist = math.hypot(c1[0] - c2[0], c1[1] - c2[1])
        pairs.append((id1, id2, dist))
    return pairs

def compute_clusters(nodes, threshold=150):
    # Build adjacency list based on distance threshold
    node_ids = list(nodes.keys())
    adjacency = {nid: set() for nid in node_ids}
    for id1, id2, dist in compute_distances(nodes):
        if dist < threshold:
            adjacency[id1].add(id2)
            adjacency[id2].add(id1)
    # BFS to find clusters
    visited = set()
    clusters = []
    for nid in node_ids:
        if nid not in visited:
            cluster = set()
            queue = [nid]
            while queue:
                current = queue.pop()
                if current not in visited:
                    visited.add(current)
                    cluster.add(current)
                    queue.extend(adjacency[current] - visited)
            clusters.append(list(cluster))
    return clusters

# Threat levels mapping
THREAT_LEVELS = {
    "RAISED_HAND": "RED",
    "PUSHING": "RED",
    "PUNCHING": "RED",
    "SLAPPING": "RED",
    "GRABBING": "RED",
    "CHASING": "RED",
    "BLOCKING_WAY": "RED",
    "INTIMIDATING_POSTURE": "RED",
    "STARING": "YELLOW",
    "LOITERING": "YELLOW",
    "FOLLOWING": "YELLOW",
    "HOVERING": "YELLOW",
    "POINTING": "YELLOW",
    "WAVING_FOR_HELP": "GREEN",
    "HANDS_UP": "GREEN",
    "CALLING_PHONE": "GREEN",
    "RUNNING_AWAY": "GREEN",
    "FALLING": "GREEN",
    "HAND_SIGNAL_SOS": "GREEN",
    "WALKING": "GREEN",
    "STANDING": "GREEN",
    "SITTING": "GREEN",
    "TALKING": "GREEN",
    "GESTURING_CASUALLY": "GREEN"
}

def detect_gesture(person_crop):
    results = pose.process(cv2.cvtColor(person_crop, cv2.COLOR_BGR2RGB))
    if results.pose_landmarks:
        lm = results.pose_landmarks.landmark
        def y(l): return lm[l].y if lm[l].visibility > 0.5 else None
        def x(l): return lm[l].x if lm[l].visibility > 0.5 else None

        rw_y = y(mp_pose.PoseLandmark.RIGHT_WRIST)
        lw_y = y(mp_pose.PoseLandmark.LEFT_WRIST)
        rs_y = y(mp_pose.PoseLandmark.RIGHT_SHOULDER)
        ls_y = y(mp_pose.PoseLandmark.LEFT_SHOULDER)
        re_y = y(mp_pose.PoseLandmark.RIGHT_ELBOW)
        le_y = y(mp_pose.PoseLandmark.LEFT_ELBOW)
        rh_y = y(mp_pose.PoseLandmark.RIGHT_HIP)
        lh_y = y(mp_pose.PoseLandmark.LEFT_HIP)
        rk_y = y(mp_pose.PoseLandmark.RIGHT_KNEE)
        lk_y = y(mp_pose.PoseLandmark.LEFT_KNEE)
        ra_y = y(mp_pose.PoseLandmark.RIGHT_ANKLE)
        la_y = y(mp_pose.PoseLandmark.LEFT_ANKLE)

        # Raised hand (right or left)
        if rw_y is not None and rs_y is not None and rw_y < rs_y:
            return "RAISED_HAND"
        if lw_y is not None and ls_y is not None and lw_y < ls_y:
            return "RAISED_HAND"
        # Both hands up
        if (rw_y is not None and rs_y is not None and rw_y < rs_y and
            lw_y is not None and ls_y is not None and lw_y < ls_y):
            return "HANDS_UP"
        # Waving for help (right wrist above head/nose)
        nose_y = y(mp_pose.PoseLandmark.NOSE)
        if rw_y is not None and nose_y is not None and rw_y < nose_y:
            return "WAVING_FOR_HELP"
        # Pointing (right wrist above right elbow)
        if rw_y is not None and re_y is not None and rw_y < re_y:
            return "POINTING"
        # Kicking: ankle above knee and leg extended forward
        if ra_y is not None and rk_y is not None and ra_y < rk_y:
            return "KICKING"
        if la_y is not None and lk_y is not None and la_y < lk_y:
            return "KICKING"
        # Wrestling/Fighting: both wrists close to torso and elbows bent
        if rw_y is not None and lw_y is not None and rs_y is not None and ls_y is not None:
            if abs(rw_y - rs_y) < 0.1 and abs(lw_y - ls_y) < 0.1:
                return "WRESTLING"
        # Shoving: one wrist near another person's torso (stub, single person logic)
        if rw_y is not None and rh_y is not None and abs(rw_y - rh_y) < 0.1:
            return "SHOVING"
        if lw_y is not None and lh_y is not None and abs(lw_y - lh_y) < 0.1:
            return "SHOVING"
        # Punching: right wrist above right elbow and moving forward (stub)
        if rw_y is not None and re_y is not None and rw_y < re_y:
            return "PUNCHING"
        # Fighting: both hands near head/shoulders and elbows bent
        if rw_y is not None and lw_y is not None and rs_y is not None and ls_y is not None and re_y is not None and le_y is not None:
            if abs(rw_y - rs_y) < 0.1 and abs(lw_y - ls_y) < 0.1 and abs(re_y - rs_y) < 0.1 and abs(le_y - ls_y) < 0.1:
                return "FIGHTING"

    return "WALKING"

def get_cluster_threat(cluster, nodes):
    level_priority = {"RED": 3, "YELLOW": 2, "GREEN": 1}
    max_level = "GREEN"
    close_red = False
    close_yellow = False

    # Get all gestures in cluster
    gestures = [nodes[nid]['attributes'].get('gesture', 'WALKING') for nid in cluster]
    threats = [THREAT_LEVELS.get(g, "GREEN") for g in gestures]

    # Compare distances between all pairs in cluster
    for i, nid1 in enumerate(cluster):
        for nid2 in cluster[i+1:]:
            c1 = get_center(nodes[nid1]['bbox'])
            c2 = get_center(nodes[nid2]['bbox'])
            dist = math.hypot(c1[0] - c2[0], c1[1] - c2[1])
            # RED threat if close and any gesture is RED
            if dist < 100 and ("RED" in [THREAT_LEVELS.get(nodes[nid1]['attributes'].get('gesture', 'WALKING'), "GREEN"),
                                         THREAT_LEVELS.get(nodes[nid2]['attributes'].get('gesture', 'WALKING'), "GREEN")]):
                close_red = True
            # YELLOW threat if moderately close and any gesture is YELLOW
            if dist < 200 and ("YELLOW" in [THREAT_LEVELS.get(nodes[nid1]['attributes'].get('gesture', 'WALKING'), "GREEN"),
                                            THREAT_LEVELS.get(nodes[nid2]['attributes'].get('gesture', 'WALKING'), "GREEN")]):
                close_yellow = True

    if close_red:
        return "RED"
    elif close_yellow:
        return "YELLOW"
    else:
        # Fallback to max gesture threat in cluster
        for threat in threats:
            if level_priority[threat] > level_priority[max_level]:
                max_level = threat
        return max_level

def get_most_indecent_gesture(clusters, nodes):
    # Priority: RED > YELLOW > GREEN
    priority = {"RED": 3, "YELLOW": 2, "GREEN": 1}
    indecent_gesture = "WALKING"
    max_threat = "GREEN"
    for cluster in clusters:
        for nid in cluster:
            gesture = nodes[nid]['attributes'].get('gesture', 'WALKING')
            threat = THREAT_LEVELS.get(gesture, "GREEN")
            if priority[threat] > priority[max_threat]:
                max_threat = threat
                indecent_gesture = gesture
    return indecent_gesture

csv_path = "output_log.csv"
# Create CSV and header if not exists
if not os.path.exists(csv_path):
    with open(csv_path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["second", "cluster_id", "threat", "node_ids", "genders", "gestures"])

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    frame_idx += 1

    # 1. Detect people
    results = yolo(frame)  # returns bounding boxes, classes, confidences
    detections = []
    for r in results:
        for box, conf, cls in zip(r.boxes.xyxy, r.boxes.conf, r.boxes.cls):
            if int(cls) == 0 and conf > 0.3:  # class 0 = person in COCO
                x1, y1, x2, y2 = map(int, box)
                detections.append(([x1, y1, x2 - x1, y2 - y1], conf, 'person'))

    # 2. Update tracker
    tracks = tracker.update_tracks(detections, frame=frame)

    # 3. Iterate confirmed tracks
    for track in tracks:
        if not track.is_confirmed():
            continue

        track_id = track.track_id
        l, t, w, h = track.to_ltrb()
        bbox = [int(l), int(t), int(w - l), int(h - t)]

        # 4. Node assignment
        if track_id not in nodes:
            nodes[track_id] = {
                'first_seen': frame_idx,
                'bbox': bbox,
                'attributes': {}
            }

        # Gender classification
        x, y, w, h = bbox
        h_frame, w_frame = frame.shape[:2]
        # Ensure crop is within frame bounds
        x = max(0, x)
        y = max(0, y)
        w = min(w, w_frame - x)
        h = min(h, h_frame - y)
        if w <= 0 or h <= 0:
            continue  # Skip invalid crop
        person_crop = frame[y:y+h, x:x+w]
        if person_crop.size == 0:
            continue  # Skip empty crop

        gender = classify_gender(person_crop)
        nodes[track_id]['attributes']['gender'] = gender

        gesture = detect_gesture(person_crop)
        nodes[track_id]['attributes']['gesture'] = gesture

        # 5. Update last-seen bbox
        nodes[track_id]['bbox'] = bbox

        # 6. Draw on frame
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame, f'ID {track_id} {gender} {gesture}', (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

    # --- Compute and visualize distances between nodes ---
    distances = compute_distances(nodes)
    for id1, id2, dist in distances:
        c1 = get_center(nodes[id1]['bbox'])
        c2 = get_center(nodes[id2]['bbox'])
        if dist < 150:
            cv2.line(frame, c1, c2, (0, 0, 255), 2)
            cv2.putText(frame, f"{int(dist)}", ((c1[0]+c2[0])//2, (c1[1]+c2[1])//2),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,0,255), 1)

    # --- Compute clusters ---
    clusters = compute_clusters(nodes, threshold=150)
    # Visualize clusters with different colors
    cluster_colors = [(255,0,0), (0,255,0), (0,0,255), (255,255,0), (255,0,255), (0,255,255)]
    for idx, cluster in enumerate(clusters):
        color = cluster_colors[idx % len(cluster_colors)]
        threat = get_cluster_threat(cluster, nodes)
        for nid in cluster:
            x, y, w, h = nodes[nid]['bbox']
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(frame, f'Cluster {idx+1} {threat}', (x, y + h + 15),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    # --- Log to CSV every second ---
    if frame_idx % 30 == 0:  # Assuming 30 FPS
        second = frame_idx // 30
        with open(csv_path, "a", newline="") as f:
            writer = csv.writer(f)
            for idx, cluster in enumerate(clusters):
                node_ids = [str(nid) for nid in cluster]
                genders = [nodes[nid]['attributes'].get('gender', '') for nid in cluster]
                gestures = [nodes[nid]['attributes'].get('gesture', '') for nid in cluster]
                threat = get_cluster_threat(cluster, nodes)
                writer.writerow([second, idx+1, threat, ",".join(node_ids), ",".join(genders), ",".join(gestures)])
                # Log indecent gesture
                timestamp = datetime.datetime.now().strftime("%H:%M:%S")
                camera_id = "CAM_02"  # or your actual camera ID
                latitude = "21.162730643915978"  # example latitude
                longitude = "75.42720938667607" # example longitude
                indecent_gesture = get_most_indecent_gesture(clusters, nodes)
                with open("../gesture_log.csv", "a", newline="") as f:
                    writer = csv.writer(f)
                    writer.writerow([timestamp, camera_id, latitude, longitude, indecent_gesture])

    # 7. Display or write out
    cv2.imshow('Tracking', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
