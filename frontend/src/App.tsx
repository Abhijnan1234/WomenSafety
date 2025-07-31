import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Menu } from "lucide-react";
import LoginPage from "./components/LoginPage";
import HamburgerMenu from "./components/HamburgerMenu";

// Custom numbered icon generator
const numberedIcon = (number: number) =>
  new L.DivIcon({
    html: `<div style="background:#e11d48;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${number}</div>`,
    className: "",
    iconSize: [28, 28],
  });

// Alert interface
interface Alert {
  id: number;
  lat: number;
  lng: number;
  type: string;
  severity: number;
  time: string;
  description: string;
  location: string;
}

// Dummy backend data (normally would come from API reading CSV every 2 sec)
const fetchAlerts = async (): Promise<Alert[]> => {
  return [
    {
      id: 1,
      lat: 28.6139,
      lng: 77.209,
      type: "Physical Abuse",
      severity: 85,
      time: "12:45 PM",
      description: "Multiple distress signals detected via CCTV AI analysis. Immediate intervention required.",
      location: "Connaught Place, New Delhi",
    },
    {
      id: 2,
      lat: 28.7041,
      lng: 77.1025,
      type: "Verbal Harassment",
      severity: 60,
      time: "01:15 PM",
      description: "Harassment patterns detected at bus stop footage. Suspect identified through facial recognition.",
      location: "Karol Bagh, New Delhi",
    },
    {
      id: 3,
      lat: 28.5355,
      lng: 77.391,
      type: "Suspicious Activity",
      severity: 40,
      time: "02:20 PM",
      description: "Loitering detected near residential area via CCTV AI. Person of interest tracked for extended period.",
      location: "Noida Sector 18, Uttar Pradesh",
    },
    {
      id: 4,
      lat: 28.6304,
      lng: 77.2177,
      type: "Emergency Call",
      severity: 95,
      time: "02:45 PM",
      description: "Emergency distress button triggered. GPS location confirmed with audio analysis indicating distress.",
      location: "India Gate, New Delhi",
    },
    {
      id: 5,
      lat: 28.6692,
      lng: 77.4538,
      type: "Stalking Behavior",
      severity: 70,
      time: "03:10 PM",
      description: "AI detected following patterns in metro CCTV footage. Multiple camera angles confirm suspicious behavior.",
      location: "Ghaziabad Railway Station",
    },
  ];
};

interface FlyToLocationProps {
  position: [number, number] | null;
}

function FlyToLocation({ position }: FlyToLocationProps) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 15, { duration: 1.5 });
  }
  return null;
}

export default function SafetyDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selected, setSelected] = useState<Alert | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [isOfficial, setIsOfficial] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh every 2 seconds
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAlerts();  
      setAlerts(data);
      setLastUpdate(new Date());
    };
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle dismiss for officials
  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    if (selected?.id === id) {
      setSelected(null);
      setFlyTo(null); // Reset flyTo when dismissing selected alert
    }
  };

  const alertAuthorities = (alertData: Alert) => {
    alert(`Authorities have been alerted about ${alertData.type} at ${alertData.location}. Emergency response team dispatched.`);
  };

  const getSeverityColor = (severity: number) => {
    if (severity > 80) return "bg-red-500";
    if (severity > 60) return "bg-orange-500";
    if (severity > 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getSeverityText = (severity: number) => {
    if (severity > 80) return "Critical";
    if (severity > 60) return "High";
    if (severity > 40) return "Medium";
    return "Low";
  };

  const handleLogin = () => {
    setIsOfficial(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsOfficial(false);
  };

  // Handle closing detailed view - reset both selected and flyTo
  const handleCloseDetails = () => {
    setSelected(null);
    setFlyTo(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <h1 className="text-xl font-bold">Women Safety Monitoring Dashboard</h1>
            <div className="text-sm opacity-90">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <button
              onClick={() => setShowMenu(true)}
              className="bg-white text-pink-600 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Official Login/Logout */}
            {!isOfficial ? (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Official Login
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-90">Official Mode Active</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex gap-6 items-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critical: {alerts.filter(a => a.severity > 80).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>High: {alerts.filter(a => a.severity > 60 && a.severity <= 80).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium: {alerts.filter(a => a.severity > 40 && a.severity <= 60).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low: {alerts.filter(a => a.severity <= 40).length}</span>
          </div>
          <div className="ml-auto font-medium">
            Total Active Alerts: {alerts.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="w-2/3 relative z-0">
          <MapContainer
            center={[28.6139, 77.209]}
            zoom={11}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flyTo && <FlyToLocation position={flyTo} />}
            {alerts.map((a, index) => (
              <Marker
                key={a.id}
                position={[a.lat, a.lng]}
                icon={numberedIcon(index + 1)}
                eventHandlers={{
                  click: () => {
                    setSelected(a);
                    setFlyTo([a.lat, a.lng]);
                  },
                }}
              >
                <Popup>
                  <div className="p-2">
                    <div className="font-semibold">{index + 1}. {a.type}</div>
                    <div className="text-sm text-gray-600">{a.location}</div>
                    <div className={`text-sm font-medium ${a.severity > 80 ? 'text-red-600' : a.severity > 60 ? 'text-orange-600' : a.severity > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                      Severity: {a.severity}% ({getSeverityText(a.severity)})
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Table */}
        <div className="w-1/3 bg-white border-l border-gray-200 relative z-10">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Active Alerts</h2>
          </div>
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 73px)' }}>
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border-b border-gray-200 p-3 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="border-b border-gray-200 p-3 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="border-b border-gray-200 p-3 text-left text-sm font-medium text-gray-600">Severity</th>
                  <th className="border-b border-gray-200 p-3 text-left text-sm font-medium text-gray-600">Time</th>
                  {isOfficial && <th className="border-b border-gray-200 p-3 text-left text-sm font-medium text-gray-600">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, index) => (
                  <tr
                    key={a.id}
                    className={`hover:bg-pink-50 cursor-pointer transition-colors duration-150 ${selected?.id === a.id ? 'bg-pink-100' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setSelected(a);
                      setFlyTo([a.lat, a.lng]);
                    }}
                  >
                    <td className="border-b border-gray-100 p-3 text-sm">{index + 1}</td>
                    <td className="border-b border-gray-100 p-3">
                      <div className="text-sm font-medium text-gray-900">{a.type}</div>
                      <div className="text-xs text-gray-500 truncate">{a.location}</div>
                    </td>
                    <td className="border-b border-gray-100 p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{a.severity}%</span>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getSeverityColor(a.severity)}`}
                              style={{ width: `${a.severity}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className={`text-xs font-medium mt-1 ${a.severity > 80 ? 'text-red-600' : a.severity > 60 ? 'text-orange-600' : a.severity > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {getSeverityText(a.severity)}
                      </div>
                    </td>
                    <td className="border-b border-gray-100 p-3 text-sm">{a.time}</td>
                    {isOfficial && (
                      <td className="border-b border-gray-100 p-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alertAuthorities(a);
                            }}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors duration-200"
                          >
                            Alert
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(a.id);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors duration-200"
                          >
                            Dismiss
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-up Details Panel */}
      {selected && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t border-gray-200 transform transition-transform duration-300 ease-out z-50">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.type}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>📍 {selected.location}</span>
                  <span>🕒 {selected.time}</span>
                  <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getSeverityColor(selected.severity)}`}>
                    {getSeverityText(selected.severity)} ({selected.severity}%)
                  </span>
                </div>
              </div>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Alert Description:</h3>
              <p className="text-gray-700 leading-relaxed">{selected.description}</p>
            </div>

            {isOfficial && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => alertAuthorities(selected)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                  🚨 Alert Authorities
                </button>
                <button
                  onClick={() => dismissAlert(selected.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                >
                  ✓ Mark as Resolved
                </button>
                <button
                  onClick={() => alert("Emergency services contacted. Response team dispatched to location.")}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                >
                  🚑 Emergency Response
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-4 text-center">
        <div className="text-sm">
          © 2025 Women Safety AI Dashboard | Powered by Real-time CCTV AI Detection & Analysis
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <LoginPage
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Hamburger Menu */}
      <HamburgerMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        isOfficial={isOfficial}
      />
    </div>
  );
}