// Mission Control Dashboard Layout
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Sprout, 
  Satellite, 
  AlertTriangle, 
  Wrench, 
  FileText,
  Bell,
  User,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  currentProject?: string;
  lastUpdate?: string;
  systemHealth?: 'healthy' | 'warning' | 'critical';
}

const DashboardLayout = ({ 
  children, 
  currentProject = "No Project Selected",
  lastUpdate = "Never",
  systemHealth = 'healthy'
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: 'planning', label: 'Planning', icon: Brain, path: '/planning', description: 'Where & What to plant?' },
    { id: 'planting', label: 'Planting', icon: Sprout, path: '/planting', description: 'What did we plant?' },
    { id: 'monitoring', label: 'Monitoring', icon: Satellite, path: '/monitoring', description: 'Is forest healthy?' },
    { id: 'prediction', label: 'Prediction', icon: AlertTriangle, path: '/prediction', description: 'What will go wrong?' },
    { id: 'intervention', label: 'Intervention', icon: Wrench, path: '/intervention', description: 'What should we do?' },
    { id: 'reporting', label: 'Reporting', icon: FileText, path: '/reporting', description: 'What impact created?' },
  ];

  const getHealthColor = () => {
    switch (systemHealth) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = () => {
    switch (systemHealth) {
      case 'healthy': return '●';
      case 'warning': return '⚠';
      case 'critical': return '●';
      default: return '●';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900">HABITAT Mission Control</h1>
            <div className="text-sm text-gray-600">
              Project: <span className="font-medium">{currentProject}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
              <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-1">3</span>
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
              Forest Officer
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Lifecycle Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Forest Lifecycle
            </h2>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Status Bar */}
      <footer className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Last Update: {lastUpdate}</span>
            </div>
            <div className={`flex items-center gap-2 ${getHealthColor()}`}>
              <span>{getHealthIcon()}</span>
              <span>System {systemHealth}</span>
            </div>
          </div>
          <div className="text-gray-500">
            Forest Management System v2.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;