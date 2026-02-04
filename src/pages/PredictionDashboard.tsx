// PREDICTION UI - "What will go wrong?"
import { useState } from 'react';
import { AlertTriangle, Clock, Zap, Droplets, Thermometer, Bug } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface RiskAlert {
  id: string;
  type: 'drought' | 'heat' | 'pest' | 'disease';
  severity: 'low' | 'medium' | 'high';
  probability: number;
  timeframe: string;
  impact: string;
  zones: string[];
}

const PredictionDashboard = () => {
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);

  // Mock risk data
  const riskAlerts: RiskAlert[] = [
    {
      id: '1',
      type: 'drought',
      severity: 'high',
      probability: 85,
      timeframe: '14-21 days',
      impact: '25% survival loss expected',
      zones: ['A1', 'A2', 'B1']
    },
    {
      id: '2',
      type: 'heat',
      severity: 'medium',
      probability: 65,
      timeframe: '7-14 days',
      impact: '15% growth reduction',
      zones: ['A3', 'B2']
    },
    {
      id: '3',
      type: 'pest',
      severity: 'low',
      probability: 35,
      timeframe: '30+ days',
      impact: '5% leaf damage',
      zones: ['A4']
    }
  ];

  const simulations = [
    {
      id: 'drought',
      name: 'Simulate Drought',
      description: 'No rainfall for 30 days',
      icon: Droplets,
      results: {
        ndviDrop: 0.15,
        survivalLoss: 25,
        zonesAffected: 4
      }
    },
    {
      id: 'heatwave',
      name: 'Simulate Heatwave',
      description: '45°C for 7 days',
      icon: Thermometer,
      results: {
        ndviDrop: 0.08,
        survivalLoss: 12,
        zonesAffected: 2
      }
    },
    {
      id: 'pest',
      name: 'Simulate Pest Outbreak',
      description: 'Locust swarm attack',
      icon: Bug,
      results: {
        ndviDrop: 0.12,
        survivalLoss: 18,
        zonesAffected: 3
      }
    }
  ];

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'drought': return <Droplets className="w-5 h-5" />;
      case 'heat': return <Thermometer className="w-5 h-5" />;
      case 'pest': return <Bug className="w-5 h-5" />;
      case 'disease': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const runSimulation = (simulationId: string) => {
    setSelectedSimulation(simulationId);
    // In real app, this would trigger backend simulation
  };

  return (
    <DashboardLayout 
      currentProject="Western Ghats Zone A"
      lastUpdate="1 minute ago"
      systemHealth="warning"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risk & Early Warning</h1>
            <p className="text-gray-600">What will go wrong?</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertTriangle className="w-4 h-4" />
            3 Active Risk Alerts
          </div>
        </div>

        {/* Risk Cards */}
        <div className="grid grid-cols-3 gap-6">
          {riskAlerts.map((risk) => (
            <Card key={risk.id} className={`p-6 border-2 ${getRiskColor(risk.severity)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getRiskIcon(risk.type)}
                  <h3 className="font-semibold capitalize">{risk.type} Risk</h3>
                </div>
                <div className="text-2xl font-bold">{risk.probability}%</div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Expected in {risk.timeframe}</span>
                </div>
                <div className="font-medium text-gray-900">{risk.impact}</div>
                <div className="text-gray-600">
                  Zones affected: {risk.zones.join(', ')}
                </div>
              </div>

              <div className={`mt-3 px-2 py-1 rounded text-xs font-bold text-center ${
                risk.severity === 'high' ? 'bg-red-600 text-white' :
                risk.severity === 'medium' ? 'bg-yellow-600 text-white' :
                'bg-green-600 text-white'
              }`}>
                {risk.severity.toUpperCase()} PRIORITY
              </div>
            </Card>
          ))}
        </div>

        {/* Timeline View */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Risk Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  7d
                </div>
                <div>
                  <div className="font-medium">Heat Stress Warning</div>
                  <div className="text-sm text-gray-600">Temperature spike expected in zones A3, B2</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  14d
                </div>
                <div>
                  <div className="font-medium">Drought Risk Critical</div>
                  <div className="text-sm text-gray-600">No rainfall predicted, immediate intervention needed</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  30d
                </div>
                <div>
                  <div className="font-medium">Pest Season Begins</div>
                  <div className="text-sm text-gray-600">Monitor for early signs of infestation</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Simulation Mode */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Simulation Mode (Highlight Feature)
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {simulations.map((sim) => {
              const Icon = sim.icon;
              return (
                <button
                  key={sim.id}
                  onClick={() => runSimulation(sim.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                    selectedSimulation === sim.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{sim.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">{sim.description}</div>
                </button>
              );
            })}
          </div>

          {selectedSimulation && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Simulation Results</h4>
              {(() => {
                const sim = simulations.find(s => s.id === selectedSimulation);
                if (!sim) return null;
                
                return (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-600">-{sim.results.ndviDrop.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">NDVI Drop</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{sim.results.survivalLoss}%</div>
                      <div className="text-sm text-gray-600">Survival Loss</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{sim.results.zonesAffected}</div>
                      <div className="text-sm text-gray-600">Zones Affected</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </Card>

        {/* Action Recommendations */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Immediate Actions Needed</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
              <div>
                <div className="font-medium text-red-800">Install irrigation in Zone A1</div>
                <div className="text-sm text-red-600">Drought risk in 14 days - Critical</div>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Plan Action
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div>
                <div className="font-medium text-yellow-800">Apply shade nets in Zone A3</div>
                <div className="text-sm text-yellow-600">Heat stress expected in 7 days - Medium</div>
              </div>
              <Button size="sm" variant="outline">
                Plan Action
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
              <div>
                <div className="font-medium text-blue-800">Schedule pest monitoring</div>
                <div className="text-sm text-blue-600">Preventive measure for next month - Low</div>
              </div>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PredictionDashboard;