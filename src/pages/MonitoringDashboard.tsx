// MONITORING UI - "Is the forest healthy?"
import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface HealthMetrics {
  ndvi: number;
  survivalRate: number;
  soilHealth: number;
  trend: 'up' | 'down' | 'stable';
}

const MonitoringDashboard = () => {
  const [selectedProject, setSelectedProject] = useState('western-ghats');
  
  // Mock monitoring data
  const projects = {
    'western-ghats': {
      name: 'Western Ghats Zone A',
      planted: '2,500 trees',
      plantedDate: '6 months ago',
      metrics: {
        ndvi: 0.68,
        survivalRate: 87,
        soilHealth: 78,
        trend: 'up' as const
      },
      zones: [
        { id: 'A1', health: 'healthy', ndvi: 0.72, survival: 92 },
        { id: 'A2', health: 'warning', ndvi: 0.58, survival: 78 },
        { id: 'A3', health: 'healthy', ndvi: 0.75, survival: 89 },
        { id: 'A4', health: 'critical', ndvi: 0.42, survival: 65 },
      ]
    },
    'aravalli': {
      name: 'Aravalli Range B',
      planted: '1,800 trees',
      plantedDate: '4 months ago',
      metrics: {
        ndvi: 0.52,
        survivalRate: 73,
        soilHealth: 65,
        trend: 'stable' as const
      },
      zones: [
        { id: 'B1', health: 'warning', ndvi: 0.48, survival: 70 },
        { id: 'B2', health: 'healthy', ndvi: 0.61, survival: 82 },
        { id: 'B3', health: 'critical', ndvi: 0.38, survival: 58 },
      ]
    }
  };

  const currentProject = projects[selectedProject as keyof typeof projects];

  const getHealthStatus = (value: number, type: 'ndvi' | 'survival' | 'soil') => {
    const thresholds = {
      ndvi: { good: 0.6, warning: 0.4 },
      survival: { good: 80, warning: 60 },
      soil: { good: 70, warning: 50 }
    };
    
    const threshold = thresholds[type];
    if (value >= threshold.good) return 'healthy';
    if (value >= threshold.warning) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout 
      currentProject={currentProject.name}
      lastUpdate="5 minutes ago"
      systemHealth="warning"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
            <p className="text-gray-600">Is the forest healthy?</p>
          </div>
          
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="western-ghats">Western Ghats Zone A</option>
            <option value="aravalli">Aravalli Range B</option>
          </select>
        </div>

        {/* Health Indicators */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Vegetation Health</h3>
              {currentProject.metrics.trend === 'up' ? 
                <TrendingUp className="w-5 h-5 text-green-600" /> :
                <TrendingDown className="w-5 h-5 text-red-600" />
              }
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {currentProject.metrics.ndvi.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">NDVI Index</div>
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${
              getStatusColor(getHealthStatus(currentProject.metrics.ndvi, 'ndvi'))
            }`}>
              {getStatusIcon(getHealthStatus(currentProject.metrics.ndvi, 'ndvi'))}
              {getHealthStatus(currentProject.metrics.ndvi, 'ndvi').toUpperCase()}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Survival Rate</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {currentProject.metrics.survivalRate}%
            </div>
            <div className="text-sm text-gray-600">Trees Alive</div>
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${
              getStatusColor(getHealthStatus(currentProject.metrics.survivalRate, 'survival'))
            }`}>
              {getStatusIcon(getHealthStatus(currentProject.metrics.survivalRate, 'survival'))}
              {getHealthStatus(currentProject.metrics.survivalRate, 'survival').toUpperCase()}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">Soil Health</h3>
              <Activity className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {currentProject.metrics.soilHealth}
            </div>
            <div className="text-sm text-gray-600">Health Score</div>
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${
              getStatusColor(getHealthStatus(currentProject.metrics.soilHealth, 'soil'))
            }`}>
              {getStatusIcon(getHealthStatus(currentProject.metrics.soilHealth, 'soil'))}
              {getHealthStatus(currentProject.metrics.soilHealth, 'soil').toUpperCase()}
            </div>
          </Card>
        </div>

        {/* Map Overview */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Zone Health Map</h3>
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200">
                  {currentProject.zones.map((zone, index) => (
                    <div
                      key={zone.id}
                      className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm ${
                        zone.health === 'healthy' ? 'bg-green-500 border-green-600' :
                        zone.health === 'warning' ? 'bg-yellow-500 border-yellow-600' :
                        'bg-red-500 border-red-600'
                      }`}
                      style={{
                        left: `${20 + (index * 20)}%`,
                        top: `${30 + (index * 15)}%`
                      }}
                    >
                      {zone.id}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Needs Attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Zone Details */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Zone Status</h3>
              <div className="space-y-3">
                {currentProject.zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">Zone {zone.id}</div>
                      <div className="text-sm text-gray-600">
                        NDVI: {zone.ndvi.toFixed(2)} | Survival: {zone.survival}%
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(zone.health)}`}>
                      {zone.health.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Project Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Planted:</span>
                  <span className="font-medium">{currentProject.planted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Started:</span>
                  <span className="font-medium">{currentProject.plantedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Check:</span>
                  <span className="font-medium">In 2 weeks</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Time Series Charts */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Trends Over Time</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">NDVI Trend</h4>
              <div className="h-24 bg-gray-50 rounded flex items-end justify-center">
                <div className="text-sm text-gray-500">Chart: NDVI increasing +12%</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Survival Rate</h4>
              <div className="h-24 bg-gray-50 rounded flex items-end justify-center">
                <div className="text-sm text-gray-500">Chart: Stable at 87%</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Soil Health</h4>
              <div className="h-24 bg-gray-50 rounded flex items-end justify-center">
                <div className="text-sm text-gray-500">Chart: Improving +8%</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MonitoringDashboard;