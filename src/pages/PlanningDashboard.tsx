import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { siteAPI } from '@/services/api';
import { projectService } from '@/services/database/projectService';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoicHJhbnNodTA3ZCIsImEiOiJjbWw3M240M2gwazV4M2VzZjRpcmxiNTN0In0.SFKEOeg3yta40EtvdyZNbA';

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface AnalysisResult {
  location: Location;
  landScore: number;
  priority: string;
  soil: any;
  weather: any;
  vegetation: any;
  recommendedSpecies: any[];
}

const PlanningDashboard = () => {
  const navigate = useNavigate();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [projectName, setProjectName] = useState('');
  const [area, setArea] = useState<number>(100);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [saving, setSaving] = useState(false);

  // Predefined locations
  const predefinedLocations = [
    { name: 'Western Ghats, Karnataka', lat: 14.0, lng: 75.5 },
    { name: 'Aravalli Range, Rajasthan', lat: 25.5, lng: 73.0 },
    { name: 'Eastern Ghats, Andhra Pradesh', lat: 17.0, lng: 82.0 },
    { name: 'Sundarbans, West Bengal', lat: 21.9, lng: 89.0 },
  ];

  useEffect(() => {
    // Initialize map
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [78.9629, 20.5937], // Center of India
      zoom: 4
    });

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click handler
    mapInstance.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      handleMapClick(lat, lng);
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    const location: Location = {
      lat,
      lng,
      name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    };

    setSelectedLocation(location);
    setAnalysisResult(null);

    // Update or create marker
    if (marker) {
      marker.setLngLat([lng, lat]);
    } else if (map) {
      const newMarker = new mapboxgl.Marker({ color: '#10b981' })
        .setLngLat([lng, lat])
        .addTo(map);
      setMarker(newMarker);
    }

    // Fly to location
    if (map) {
      map.flyTo({ center: [lng, lat], zoom: 12 });
    }
  };

  const handlePredefinedLocation = (location: typeof predefinedLocations[0]) => {
    handleMapClick(location.lat, location.lng);
    setSelectedLocation({ ...location });
  };

  const handleAnalyze = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await siteAPI.analyzeCompleteSite({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        name: selectedLocation.name,
        hectares: area
      });

      // Extract data from response
      const result = response.data || response;
      setAnalysisResult(result);
      toast.success('Site analysis complete!');
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.error || 'Failed to analyze site');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveProject = async () => {
    if (!analysisResult || !projectName) {
      toast.error('Please complete analysis and enter project name');
      return;
    }

    setSaving(true);
    try {
      const project = {
        name: projectName,
        location: {
          lat: analysisResult.location.lat,
          lon: analysisResult.location.lng,
          name: analysisResult.location.name,
          region: 'India'
        },
        area: area,
        status: 'planning' as const,
        landScore: analysisResult.landScore,
        priority: analysisResult.priority,
        species: analysisResult.recommendedSpecies.slice(0, 3).map((sp, idx) => ({
          name: sp.name,
          scientificName: sp.scientificName,
          quantity: Math.round((area * 100) * [0.5, 0.3, 0.2][idx]),
          percentage: [50, 30, 20][idx],
          survivalProbability: sp.survivalProbability
        })),
        baseline: {
          ndvi: analysisResult.vegetation?.ndvi || 0.35,
          soilMoisture: analysisResult.soil?.moisture || 45,
          temperature: analysisResult.weather?.current?.temp || 25,
          date: new Date().toISOString()
        },
        createdAt: new Date().toISOString()
      };

      const projectId = await projectService.createProject(project);
      
      toast.success('Project saved successfully!');
      
      // Navigate to planting after short delay
      setTimeout(() => {
        navigate('/planting');
      }, 1500);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout currentProject={projectName || 'New Project'}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <h1 className="text-3xl font-bold text-gray-900">Planning Dashboard</h1>
          <p className="text-gray-600 mt-1">Select area and analyze site for restoration</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map Section */}
          <div className="flex-1 relative">
            <div id="map" className="w-full h-full" />
            
            {/* Quick Location Selector */}
            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
              <h3 className="font-semibold mb-2">Quick Select</h3>
              <div className="space-y-2">
                {predefinedLocations.map((loc) => (
                  <Button
                    key={loc.name}
                    onClick={() => handlePredefinedLocation(loc)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {loc.name}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Or click anywhere on the map
              </p>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="w-96 bg-white border-l overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Location Info */}
              {selectedLocation && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900">Selected Location</h3>
                      <p className="text-sm text-green-700 mt-1">{selectedLocation.name}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Project Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Western Ghats Restoration 2026"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (hectares) *
                  </label>
                  <Input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(parseInt(e.target.value) || 0)}
                    placeholder="e.g., 100"
                  />
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!selectedLocation || analyzing}
                className="w-full"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Site...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4 mr-2" />
                    Analyze Site
                  </>
                )}
              </Button>

              {/* Analysis Results */}
              {analysisResult && (
                <div className="space-y-4">
                  {/* Land Score */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Suitability Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-green-600">
                        {analysisResult.landScore}/100
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${
                          analysisResult.priority === 'High' ? 'text-red-600' :
                          analysisResult.priority === 'Medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {analysisResult.priority} Priority
                        </div>
                        <div className="text-xs text-gray-500">
                          {analysisResult.landScore >= 70 ? 'Excellent' :
                           analysisResult.landScore >= 50 ? 'Good' : 'Moderate'}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Recommended Species */}
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Top Species</h3>
                    <div className="space-y-3">
                      {analysisResult.recommendedSpecies.slice(0, 3).map((species, idx) => (
                        <div key={idx} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-green-900">{species.name}</h4>
                              <p className="text-xs text-gray-600 italic">{species.scientificName}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-green-600">
                                {species.survivalProbability}%
                              </div>
                              <div className="text-xs text-gray-500">survival</div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">{species.reason}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Save Project */}
                  <Button
                    onClick={handleSaveProject}
                    disabled={!projectName || saving}
                    className="w-full"
                    size="lg"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Project
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Instructions */}
              {!selectedLocation && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">📍 Get Started</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                    <li>Click on the map or select a quick location</li>
                    <li>Enter project name and area</li>
                    <li>Click "Analyze Site" to get recommendations</li>
                    <li>Review species and save project</li>
                  </ol>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlanningDashboard;
