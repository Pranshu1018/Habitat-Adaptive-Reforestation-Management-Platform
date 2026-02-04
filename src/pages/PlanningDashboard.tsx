// PLANNING UI - "Where & What should we plant?"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Activity, TreePine, Target, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { siteAPI } from '@/services/api';
import { toast } from 'sonner';

interface SiteData {
  location: { lat: number; lon: number; name: string };
  priority: 'high' | 'medium' | 'low';
  suitabilityScore: number;
  soil: { ph: number; moisture: number; nitrogen: string };
  climate: { rainfall: number; temperature: number };
  species: Array<{
    name: string;
    survivalProbability: number;
    reason: string;
  }>;
}

const PlanningDashboard = () => {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(false);

  // Predefined zones with priority classification
  const zones = [
    { 
      id: 1, 
      name: 'Western Ghats Zone A', 
      lat: 14.0, 
      lon: 75.5, 
      priority: 'high',
      degradation: 'Severe deforestation',
      area: '2,500 hectares'
    },
    { 
      id: 2, 
      name: 'Aravalli Range B', 
      lat: 25.5, 
      lon: 73.0, 
      priority: 'high',
      degradation: 'Mining damage',
      area: '1,800 hectares'
    },
    { 
      id: 3, 
      name: 'Eastern Ghats C', 
      lat: 17.0, 
      lon: 82.0, 
      priority: 'medium',
      degradation: 'Moderate degradation',
      area: '3,200 hectares'
    },
    { 
      id: 4, 
      name: 'Sundarbans D', 
      lat: 21.9, 
      lon: 89.2, 
      priority: 'low',
      degradation: 'Stable ecosystem',
      area: '1,200 hectares'
    },
  ];

  const analyzeSite = async (zone: any) => {
    setLoading(true);
    setSelectedZone(zone);
    
    try {
      const response = await siteAPI.analyze({
        lat: zone.lat,
        lon: zone.lon,
        name: zone.name,
        hectares: parseInt(zone.area.split(',')[0])
      });

      // Transform backend data to UI format
      const transformedData: SiteData = {
        location: { lat: zone.lat, lon: zone.lon, name: zone.name },
        priority: zone.priority,
        suitabilityScore: response.landScore || 75,
        soil: {
          ph: response.soil?.ph || 6.5,
          moisture: response.soil?.moisture || 60,
          nitrogen: response.soil?.nitrogen || 'medium'
        },
        climate: {
          rainfall: 1200,
          temperature: response.weather?.current?.temp || 24
        },
        species: response.recommendedSpecies?.slice(0, 3).map((s: any) => ({
          name: s.name,
          survivalProbability: s.survivalProbability,
          reason: s.reason
        })) || []
      };

      setSiteData(transformedData);
    } catch (error) {
      toast.error('Analysis failed. Using demo data.');
      // Fallback demo data
      setSiteData({
        location: { lat: zone.lat, lon: zone.lon, name: zone.name },
        priority: zone.priority,
        suitabilityScore: 75,
        soil: { ph: 6.5, moisture: 60, nitrogen: 'medium' },
        climate: { rainfall: 1200, temperature: 24 },
        species: [
          { name: 'Teak', survivalProbability: 88, reason: 'Optimal pH and temperature' },
          { name: 'Neem', survivalProbability: 92, reason: 'Excellent drought tolerance' },
          { name: 'Bamboo', survivalProbability: 95, reason: 'Fast growth, erosion control' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout 
      currentProject="Forest Restoration Planning"
      lastUpdate="2 minutes ago"
      systemHealth="healthy"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site & Species Planner</h1>
            <p className="text-gray-600">Where & What should we plant?</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4" />
            Goal: Maximum survival probability
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Map Area */}
          <div className="col-span-8">
            <Card className="p-6 h-96">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Priority Zones Map</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>High Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Stable</span>
                  </div>
                </div>
              </div>
              
              {/* Simplified Map View */}
              <div className="relative h-full bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => analyzeSite(zone)}
                      className={`absolute w-16 h-16 rounded-full border-4 transition-all hover:scale-110 ${
                        zone.priority === 'high' ? 'bg-red-500 border-red-600' :
                        zone.priority === 'medium' ? 'bg-yellow-500 border-yellow-600' :
                        'bg-green-500 border-green-600'
                      } ${selectedZone?.id === zone.id ? 'ring-4 ring-blue-300' : ''}`}
                      style={{
                        left: `${20 + (zone.id * 15)}%`,
                        top: `${30 + (zone.id * 10)}%`
                      }}
                    >
                      <div className="text-white text-xs font-bold">{zone.id}</div>
                    </button>
                  ))}
                </div>
                
                {selectedZone && (
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                    <div className="font-semibold">{selectedZone.name}</div>
                    <div className="text-sm text-gray-600">{selectedZone.area}</div>
                    <div className="text-sm text-gray-600">{selectedZone.degradation}</div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Site Intelligence Panel */}
          <div className="col-span-4 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Site Intelligence
              </h3>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Analyzing site...
                </div>
              ) : siteData ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suitability Score</span>
                    <span className="font-bold text-lg">{siteData.suitabilityScore}/100</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Priority</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(siteData.priority)}`}>
                      {siteData.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Soil pH</span>
                      </div>
                      <span className="font-medium">{siteData.soil.ph}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Moisture</span>
                      </div>
                      <span className="font-medium">{siteData.soil.moisture}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Rainfall</span>
                      </div>
                      <span className="font-medium">{siteData.climate.rainfall}mm</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Temperature</span>
                      </div>
                      <span className="font-medium">{siteData.climate.temperature}°C</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a zone to analyze
                </div>
              )}
            </Card>

            {/* Zone List */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Available Zones</h3>
              <div className="space-y-2">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => analyzeSite(zone)}
                    className={`w-full text-left p-2 rounded border transition-colors ${
                      selectedZone?.id === zone.id 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{zone.name}</div>
                        <div className="text-xs text-gray-500">{zone.area}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(zone.priority)}`}>
                        {zone.priority}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Recommended Species Panel */}
        {siteData && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TreePine className="w-5 h-5" />
              Recommended Species for {siteData.location.name}
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {siteData.species.map((species, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{species.name}</h4>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold">
                      {species.survivalProbability}%
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{species.reason}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline">
                Export Analysis
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Proceed to Planting
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlanningDashboard;