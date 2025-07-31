import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Info, 
  FileText, 
  Users, 
  Download, 
  ScrollText,
  Shield,
  MapPin,
  Calendar,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isOfficial: boolean;
}

export default function HamburgerMenu({ isOpen, onClose, isOfficial }: HamburgerMenuProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFeatureClick = (feature: string) => {
    setActiveTab(activeTab === feature ? null : feature);
  };

  const exportData = (format: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    alert(`Exporting data in ${format.toUpperCase()} format... File: safety_report_${timestamp}.${format}`);
  };

  const generateReport = (type: string) => {
    alert(`Generating ${type} report... This may take a few moments.`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-pink-600 text-white">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {/* Dashboard Statistics */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => handleFeatureClick('stats')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-pink-600" />
              <span className="font-medium">Dashboard Statistics</span>
            </button>
            
            {activeTab === 'stats' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today's Alerts:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Week:</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month:</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Time (Avg):</span>
                    <span className="font-medium">3.2 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Resolution Rate:</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Controls */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => handleFeatureClick('map')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <MapPin className="w-5 h-5 text-pink-600" />
              <span className="font-medium">Map Controls</span>
            </button>
            
            {activeTab === 'map' && (
              <div className="mt-3 space-y-2">
                <button 
                  onClick={() => alert('Switching to satellite view...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Satellite View
                </button>
                <button 
                  onClick={() => alert('Showing traffic layer...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Traffic Layer
                </button>
                <button 
                  onClick={() => alert('Displaying heat map...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Heat Map
                </button>
                <button 
                  onClick={() => alert('Showing CCTV coverage areas...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  CCTV Coverage
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => handleFeatureClick('filters')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5 text-pink-600" />
              <span className="font-medium">Filters</span>
            </button>
            
            {activeTab === 'filters' && (
              <div className="mt-3 space-y-2">
                <button 
                  onClick={() => alert('Filtering by severity: Critical only')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Critical Alerts Only
                </button>
                <button 
                  onClick={() => alert('Filtering by time: Last hour')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Last Hour
                </button>
                <button 
                  onClick={() => alert('Filtering by type: Physical Abuse')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Physical Abuse Only
                </button>
                <button 
                  onClick={() => alert('Clearing all filters...')}
                  className="w-full p-2 text-left text-sm bg-pink-50 hover:bg-pink-100 rounded text-pink-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Time Controls */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => handleFeatureClick('time')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Clock className="w-5 h-5 text-pink-600" />
              <span className="font-medium">Time Controls</span>
            </button>
            
            {activeTab === 'time' && (
              <div className="mt-3 space-y-2">
                <button 
                  onClick={() => alert('Refreshing data...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Now
                </button>
                <button 
                  onClick={() => alert('Auto-refresh paused')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Pause Auto-refresh
                </button>
                <button 
                  onClick={() => alert('Setting refresh interval to 5 seconds...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  5 Second Interval
                </button>
                <button 
                  onClick={() => alert('Setting refresh interval to 10 seconds...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  10 Second Interval
                </button>
              </div>
            )}
          </div>

          {/* Official Only Features */}
          {isOfficial && (
            <>
              {/* Report Generation */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => handleFeatureClick('reports')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5 text-pink-600" />
                  <span className="font-medium">Generate Reports</span>
                </button>
                
                {activeTab === 'reports' && (
                  <div className="mt-3 space-y-2">
                    <button 
                      onClick={() => generateReport('Daily Summary')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Daily Summary
                    </button>
                    <button 
                      onClick={() => generateReport('Weekly Analysis')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Weekly Analysis
                    </button>
                    <button 
                      onClick={() => generateReport('Monthly Trends')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Monthly Trends
                    </button>
                    <button 
                      onClick={() => generateReport('Response Performance')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Response Performance
                    </button>
                  </div>
                )}
              </div>

              {/* Data Export */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => handleFeatureClick('export')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 text-pink-600" />
                  <span className="font-medium">Export Data</span>
                </button>
                
                {activeTab === 'export' && (
                  <div className="mt-3 space-y-2">
                    <button 
                      onClick={() => exportData('csv')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Export as CSV
                    </button>
                    <button 
                      onClick={() => exportData('pdf')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Export as PDF
                    </button>
                    <button 
                      onClick={() => exportData('json')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Export as JSON
                    </button>
                    <button 
                      onClick={() => exportData('xlsx')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Export as Excel
                    </button>
                  </div>
                )}
              </div>

              {/* User Management */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => handleFeatureClick('users')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5 text-pink-600" />
                  <span className="font-medium">User Management</span>
                </button>
                
                {activeTab === 'users' && (
                  <div className="mt-3 space-y-2">
                    <button 
                      onClick={() => alert('Opening user list...')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      View All Users
                    </button>
                    <button 
                      onClick={() => alert('Creating new user account...')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Add New User
                    </button>
                    <button 
                      onClick={() => alert('Opening permissions panel...')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Manage Permissions
                    </button>
                    <button 
                      onClick={() => alert('Viewing active sessions...')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Active Sessions
                    </button>
                  </div>
                )}
              </div>

              {/* System Logs */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => handleFeatureClick('logs')}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ScrollText className="w-5 h-5 text-pink-600" />
                  <span className="font-medium">System Logs</span>
                </button>
                
                {activeTab === 'logs' && (
                  <div className="mt-3 space-y-2">
                    <button 
                      onClick={() => alert('Viewing alert logs...')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      Alert Logs
                    </button>
                    <button 
                      onClick={() => alert('Viewing user activity...')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      User Activity
                    </button>
                    <button 
                      onClick={() => alert('Viewing system errors...')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      System Errors
                    </button>
                    <button 
                      onClick={() => alert('Viewing API logs...')}
                      className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      API Logs
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Settings */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => handleFeatureClick('settings')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-pink-600" />
              <span className="font-medium">Settings</span>
            </button>
            
            {activeTab === 'settings' && (
              <div className="mt-3 space-y-2">
                <button 
                  onClick={() => alert('Opening notification settings...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Notification Settings
                </button>
                <button 
                  onClick={() => alert('Opening display preferences...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Display Preferences
                </button>
                <button 
                  onClick={() => alert('Opening alert thresholds...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Alert Thresholds
                </button>
                <button 
                  onClick={() => alert('Opening system configuration...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  System Configuration
                </button>
              </div>
            )}
          </div>

          {/* Help & Support */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => handleFeatureClick('help')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-pink-600" />
              <span className="font-medium">Help & Support</span>
            </button>
            
            {activeTab === 'help' && (
              <div className="mt-3 space-y-2">
                <button 
                  onClick={() => alert('Opening user guide...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  User Guide
                </button>
                <button 
                  onClick={() => alert('Opening FAQ...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => alert('Opening contact support...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Contact Support
                </button>
                <button 
                  onClick={() => alert('Opening video tutorials...')}
                  className="w-full p-2 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Video Tutorials
                </button>
              </div>
            )}
          </div>

          {/* About */}
          <div className="p-4">
            <button
              onClick={() => handleFeatureClick('about')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Info className="w-5 h-5 text-pink-600" />
              <span className="font-medium">About</span>
            </button>
            
            {activeTab === 'about' && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-pink-600" />
                    <span className="font-medium">Women Safety AI Dashboard</span>
                  </div>
                  <p className="text-gray-600">Version: 2.1.0</p>
                  <p className="text-gray-600">Build: 2025.01.15</p>
                  <p className="text-gray-600">AI Engine: v3.2</p>
                  <p className="text-gray-600 mt-3">
                    Powered by real-time CCTV AI detection and analysis to ensure women's safety in public spaces.
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button 
                      onClick={() => alert('Checking for updates...')}
                      className="w-full p-2 text-center text-sm bg-pink-100 hover:bg-pink-200 rounded text-pink-700"
                    >
                      Check for Updates
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}