import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Satellite,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  TreePine,
  User,
  Leaf,
  Sun,
  Activity,
  Info,
  Save,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteAPI } from '@/services/api';
import { toast } from 'sonner';
import { projectService, analysisService } from '@/services/database/projectService';

interface AnalysisStep {
  id: number;
  title: string;
  status: 'pending' | 'loading' | 'complete' | 'error';
}

interface SiteData {
  location: { lat: number; lon: number; name: string };
  satellite: {
    ndvi: number;
    landCover: string;
    degradationLevel: string;
    priority: 'high' | 'medium' | 'low';
  };
  soil: {
    ph: number;
    nitrogen: string;
    phosphorus: string;
    moisture: number;
    texture: string;
  };
  climate: {
    rainfall: number;
    temperature: number;
    seasonality: string;
  };
  species: Array<{
    name: string;
    scientificName: string;
    survivalProbability: number;
    reason: string;
    careRequirements: string[];
    imageUrl: string;
  }>;
  suitabilityScore: number;
}

const SiteAnalysisComplete = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);

  const locations = [
    { 
      name: 'Western Ghats', 
      region: 'Karnataka, India',
      lat: 14.0, 
      lon: 75.5, 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      description: 'Biodiversity hotspot with high rainfall'
    },
    { 
      name: 'Aravalli Range', 
      region: 'Rajasthan, India',
      lat: 25.5, 
      lon: 73.0, 
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
      description: 'Degraded forest area needing restoration'
    },
    { 
      name: 'Eastern Ghats', 
      region: 'Andhra Pradesh, India',
      lat: 17.0, 
      lon: 82.0, 
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80',
      description: 'Tropical dry deciduous forest zone'
    },
    { 
      name: 'Sundarbans', 
      region: 'West Bengal, India',
      lat: 21.9, 
      lon: 89.2, 
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
      description: 'Mangrove forest ecosystem'
    },
  ];

  const steps: AnalysisStep[] = [
    { id: 1, title: 'Select Region', status: 'pending' },
    { id: 2, title: 'Satellite Analysis', status: 'pending' },
    { id: 3, title: 'Soil & Climate', status: 'pending' },
    { id: 4, title: 'Species Matching', status: 'pending' },
  ];

  const analyzeCompleteSite = async () => {
    if (!selectedLocation) return;

    setLoading(true);
    setCurrentStep(1);

    try {
      // Step 1: Satellite Data
      await simulateStep(1, 'Fetching satellite imagery...');
      
      // Step 2: Soil & Climate
      await simulateStep(2, 'Analyzing soil and climate...');
      
      // Step 3: Species Matching
      await simulateStep(3, 'Matching optimal species...');

      // Fetch real data - use 'lng' parameter as backend expects
      const data = await siteAPI.analyze({
        lat: selectedLocation.lat,
        lng: selectedLocation.lon,  // Changed from 'lon' to 'lng'
        name: selectedLocation.name,
        hectares: 1000
      });

      // Transform to our format
      const transformedData: SiteData = {
        location: {
          lat: selectedLocation.lat,
          lon: selectedLocation.lon,
          name: selectedLocation.name
        },
        satellite: {
          ndvi: data.vegetation?.ndvi || 0.45,
          landCover: data.vegetation?.coverage > 50 ? 'Moderate Forest' : 'Degraded Land',
          degradationLevel: data.vegetation?.healthScore < 50 ? 'High' : data.vegetation?.healthScore < 70 ? 'Medium' : 'Low',
          priority: data.landScore > 70 ? 'high' : data.landScore > 50 ? 'medium' : 'low'
        },
        soil: {
          ph: data.soil?.ph || 6.5,
          nitrogen: data.soil?.nitrogen || 'medium',
          phosphorus: data.soil?.phosphorus || 'low',
          moisture: data.soil?.moisture || 60,
          texture: 'Loamy'
        },
        climate: {
          rainfall: 1200,
          temperature: data.weather?.current?.temp || 24,
          seasonality: 'Monsoon'
        },
        species: data.recommendedSpecies?.slice(0, 3).map((s: any) => ({
          name: s.name,
          scientificName: s.scientificName,
          survivalProbability: s.survivalProbability,
          reason: s.reason,
          careRequirements: s.uses || ['Moderate watering', 'Full sunlight'],
          imageUrl: getSpeciesImage(s.name)
        })) || generateSpeciesRecommendations(data),
        suitabilityScore: data.landScore || 75
      };

      setAnalysisData(transformedData);
      setCurrentStep(4);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Using demo data.');
      setAnalysisData(getDemoData(selectedLocation));
      setCurrentStep(4);
    } finally {
      setLoading(false);
    }
  };

  const simulateStep = (step: number, message: string) => {
    return new Promise((resolve) => {
      setCurrentStep(step);
      toast.info(message);
      setTimeout(resolve, 1500);
    });
  };

  const getSpeciesImage = (name: string) => {
    const images: Record<string, string> = {
      'Teak': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400',
      'Neem': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400',
      'Sal': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      'Bamboo': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'Sandalwood': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'Acacia Senegal': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      'Baobab': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400',
      'Moringa': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'
    };
    return images[name] || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400';
  };

  const saveProjectToDatabase = async () => {
    if (!analysisData || !selectedLocation) {
      toast.error('No analysis data to save');
      return;
    }

    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      setLoading(true);

      // Create project
      const projectId = await projectService.createProject({
        name: projectName,
        location: {
          lat: selectedLocation.lat,
          lon: selectedLocation.lon,
          name: selectedLocation.name,
          region: selectedLocation.region
        },
        status: 'planning'
      });

      // Save analysis
      await analysisService.saveAnalysis({
        projectId,
        satellite: analysisData.satellite,
        soil: analysisData.soil,
        climate: analysisData.climate,
        suitabilityScore: analysisData.suitabilityScore,
        recommendedSpecies: analysisData.species
      });

      setSavedProjectId(projectId);
      setShowSaveDialog(false);
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSpeciesRecommendations = (data: any) => {
    const ph = data.soil?.ph || 6.5;
    const temp = data.weather?.current?.temp || 24;

    const allSpecies = [
      {
        name: 'Teak',
        scientificName: 'Tectona grandis',
        survivalProbability: 88,
        reason: `Optimal for pH ${ph.toFixed(1)} and ${temp}°C temperature. High-value timber species.`,
        careRequirements: ['Moderate watering', 'Full sunlight', 'Well-drained soil'],
        imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400',
        conditions: { phMin: 6.0, phMax: 7.5, rainfallMin: 800, tempMin: 20, tempMax: 30 }
      },
      {
        name: 'Neem',
        scientificName: 'Azadirachta indica',
        survivalProbability: 92,
        reason: `Excellent drought tolerance. Thrives in pH ${ph.toFixed(1)} soil. Medicinal properties.`,
        careRequirements: ['Low watering', 'Full sunlight', 'Drought resistant'],
        imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400',
        conditions: { phMin: 5.5, phMax: 8.0, rainfallMin: 400, tempMin: 18, tempMax: 35 }
      },
      {
        name: 'Sal',
        scientificName: 'Shorea robusta',
        survivalProbability: 85,
        reason: `Native species for ${temp}°C climate. Excellent carbon sequestration.`,
        careRequirements: ['Regular watering', 'Partial shade', 'Moist soil'],
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        conditions: { phMin: 5.5, phMax: 7.0, rainfallMin: 1000, tempMin: 20, tempMax: 28 }
      },
      {
        name: 'Bamboo',
        scientificName: 'Bambusa bambos',
        survivalProbability: 95,
        reason: `Fast-growing. Perfect for soil pH ${ph.toFixed(1)}. Prevents erosion.`,
        careRequirements: ['High watering', 'Full sunlight', 'Fast growth'],
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        conditions: { phMin: 5.0, phMax: 7.5, rainfallMin: 800, tempMin: 15, tempMax: 35 }
      },
      {
        name: 'Sandalwood',
        scientificName: 'Santalum album',
        survivalProbability: 78,
        reason: `High economic value. Suitable for ${temp}°C temperature. Aromatic wood.`,
        careRequirements: ['Moderate watering', 'Partial shade', 'Host plant needed'],
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        conditions: { phMin: 6.0, phMax: 7.5, rainfallMin: 600, tempMin: 20, tempMax: 30 }
      },
    ];

    // Filter and sort by suitability
    return allSpecies
      .filter(s => ph >= s.conditions.phMin && ph <= s.conditions.phMax)
      .sort((a, b) => b.survivalProbability - a.survivalProbability)
      .slice(0, 3);
  };

  const getDemoData = (location: any): SiteData => {
    return {
      location: { lat: location.lat, lon: location.lon, name: location.name },
      satellite: {
        ndvi: 0.45,
        landCover: 'Degraded Forest',
        degradationLevel: 'Medium',
        priority: 'high'
      },
      soil: {
        ph: 6.5,
        nitrogen: 'medium',
        phosphorus: 'low',
        moisture: 60,
        texture: 'Loamy'
      },
      climate: {
        rainfall: 1200,
        temperature: 24,
        seasonality: 'Monsoon'
      },
      species: [
        {
          name: 'Teak',
          scientificName: 'Tectona grandis',
          survivalProbability: 88,
          reason: 'Optimal for pH 6.5 and 24°C temperature. High-value timber species.',
          careRequirements: ['Moderate watering', 'Full sunlight', 'Well-drained soil'],
          imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400'
        },
        {
          name: 'Neem',
          scientificName: 'Azadirachta indica',
          survivalProbability: 92,
          reason: 'Excellent drought tolerance. Thrives in pH 6.5 soil. Medicinal properties.',
          careRequirements: ['Low watering', 'Full sunlight', 'Drought resistant'],
          imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400'
        },
        {
          name: 'Bamboo',
          scientificName: 'Bambusa bambos',
          survivalProbability: 95,
          reason: 'Fast-growing. Perfect for soil pH 6.5. Prevents erosion.',
          careRequirements: ['High watering', 'Full sunlight', 'Fast growth'],
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
        }
      ],
      suitabilityScore: 75
    };
  };

  return (
    <div className="min-h-screen bg-[#E8F3F1]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HABITAT</h1>
                <p className="text-xs text-gray-500">Strategic Site Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="w-10 h-10 rounded-full bg-[#7FD957] flex items-center justify-center cursor-pointer">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep > index 
                      ? 'bg-[#7FD957] border-[#7FD957] text-white' 
                      : currentStep === index
                      ? 'bg-white border-[#7FD957] text-[#7FD957]'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > index ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-bold">{step.id}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= index ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${
                    currentStep > index ? 'bg-[#7FD957]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Select Region */}
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Select a <span className="text-[#2D5F3F]">Region</span>
                </h2>
                <p className="text-gray-600">
                  Choose a location to analyze for reforestation suitability
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {locations.map((location) => (
                  <motion.div
                    key={location.name}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedLocation(location)}
                    className={`relative h-64 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${
                      selectedLocation?.name === location.name
                        ? 'border-[#7FD957] shadow-lg'
                        : 'border-transparent'
                    }`}
                    style={{
                      backgroundImage: `url(${location.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="relative h-full p-6 flex flex-col justify-end">
                      <h3 className="text-2xl font-bold text-white mb-1">{location.name}</h3>
                      <p className="text-white/90 text-sm mb-2">{location.region}</p>
                      <p className="text-white/70 text-xs">{location.description}</p>
                      {selectedLocation?.name === location.name && (
                        <div className="absolute top-4 right-4">
                          <div className="w-8 h-8 rounded-full bg-[#7FD957] flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <Button
                    size="lg"
                    onClick={analyzeCompleteSite}
                    disabled={loading}
                    className="bg-[#2D5F3F] hover:bg-[#234A32] text-white px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Start Analysis
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Loading Steps */}
          {currentStep > 0 && currentStep < 4 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E8F3F1] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#2D5F3F] animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep]?.title}
              </h3>
              <p className="text-gray-600">
                {currentStep === 1 && 'Fetching satellite imagery and analyzing vegetation...'}
                {currentStep === 2 && 'Analyzing soil properties and climate patterns...'}
                {currentStep === 3 && 'Matching optimal native species for your site...'}
              </p>
            </motion.div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && analysisData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Priority Banner */}
              <div className={`rounded-2xl p-6 ${
                analysisData.satellite.priority === 'high' 
                  ? 'bg-green-50 border-2 border-green-200'
                  : analysisData.satellite.priority === 'medium'
                  ? 'bg-yellow-50 border-2 border-yellow-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {analysisData.location.name}
                    </h3>
                    <p className="text-gray-600">
                      Priority: <span className="font-semibold capitalize">{analysisData.satellite.priority}</span> Restoration Zone
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900">{analysisData.suitabilityScore}</div>
                    <div className="text-sm text-gray-600">Suitability Score</div>
                  </div>
                </div>
              </div>

              {/* Analysis Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Satellite Data */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Satellite className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Satellite Analysis</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">NDVI Index</div>
                      <div className="text-xl font-bold text-gray-900">{analysisData.satellite.ndvi.toFixed(3)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Land Cover</div>
                      <div className="text-lg font-semibold text-gray-900">{analysisData.satellite.landCover}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Degradation</div>
                      <div className="text-lg font-semibold text-gray-900">{analysisData.satellite.degradationLevel}</div>
                    </div>
                  </div>
                </div>

                {/* Soil Data */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Soil Properties</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">pH Level</div>
                      <div className="text-xl font-bold text-gray-900">{analysisData.soil.ph.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Moisture</div>
                      <div className="text-lg font-semibold text-gray-900">{analysisData.soil.moisture}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Texture</div>
                      <div className="text-lg font-semibold text-gray-900">{analysisData.soil.texture}</div>
                    </div>
                  </div>
                </div>

                {/* Climate Data */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Climate</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Rainfall</div>
                      <div className="text-xl font-bold text-gray-900">{analysisData.climate.rainfall} mm</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Temperature</div>
                      <div className="text-lg font-semibold text-gray-900">{analysisData.climate.temperature}°C</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Pattern</div>
                      <div className="text-lg font-semibold text-gray-900">{analysisData.climate.seasonality}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Species Recommendations */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Recommended Native Species</h3>
                    <p className="text-sm text-gray-600">Optimized for maximum survival probability</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {analysisData.species.map((species, index) => (
                    <div key={index} className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#7FD957] transition-all">
                      <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                        <img 
                          src={species.imageUrl} 
                          alt={species.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-[#7FD957] text-white px-2 py-1 rounded-full text-xs font-bold">
                          {species.survivalProbability}%
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{species.name}</h4>
                      <p className="text-xs text-gray-500 italic mb-3">{species.scientificName}</p>
                      
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-gray-700">{species.reason}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-700">Care Requirements:</p>
                        {species.careRequirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#7FD957]" />
                            <span className="text-xs text-gray-600">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(0);
                    setSelectedLocation(null);
                    setAnalysisData(null);
                    setSavedProjectId(null);
                  }}
                >
                  Analyze Another Site
                </Button>
                
                {!savedProjectId ? (
                  <Button
                    className="bg-[#2D5F3F] hover:bg-[#234A32] text-white"
                    onClick={() => setShowSaveDialog(true)}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Project
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Project Saved
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => toast.success('Report generated! (Feature coming soon)')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>

              {/* Save Project Dialog */}
              {showSaveDialog && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={() => setShowSaveDialog(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Save Project</h3>
                    <p className="text-gray-600 mb-6">
                      Give your reforestation project a name to track it through the complete lifecycle.
                    </p>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Western Ghats Restoration 2024"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-700">
                        <strong>Location:</strong> {selectedLocation?.name}<br />
                        <strong>Suitability Score:</strong> {analysisData?.suitabilityScore}/100<br />
                        <strong>Recommended Species:</strong> {analysisData?.species.length}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowSaveDialog(false)}
                        className="flex-1"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveProjectToDatabase}
                        className="flex-1 bg-[#2D5F3F] hover:bg-[#234A32] text-white"
                        disabled={loading || !projectName.trim()}
                      >
                        {loading ? (
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
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SiteAnalysisComplete;
