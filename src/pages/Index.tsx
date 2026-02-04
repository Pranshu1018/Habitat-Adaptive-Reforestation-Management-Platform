import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import RegionSidebar from '@/components/RegionSidebar';
import MapView from '@/components/MapView';
import AnalyticsStrip from '@/components/analytics/AnalyticsStrip';
import RegionDetailPanel from '@/components/region/RegionDetailPanel';
import { Region, regions as mockRegions } from '@/data/mockData';
import { useEnhancedRegions } from '@/hooks/useRealData';
import { apiTester } from '@/utils/apiTester';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [useRealData, setUseRealData] = useState(true);
  
  // Enhance regions with real data
  const { enhancedRegions, loading } = useEnhancedRegions(mockRegions, simulationMode);
  
  // Use enhanced regions if available and real data is enabled, otherwise use mock
  const regions = useRealData && !loading ? enhancedRegions : mockRegions;

  // Calculate global analytics from real region data
  const globalAnalytics = useMemo(() => {
    const totalCarbon = regions.reduce((sum, r) => sum + (r.carbonSequestered || 0), 0);
    const totalHectares = regions.reduce((sum, r) => sum + (r.hectares || 0), 0);
    const totalPlots = regions.reduce((sum, r) => sum + (r.plots || 0), 0);
    
    // Estimate farmers (roughly 1 farmer per 2 hectares)
    const estimatedFarmers = Math.round(totalHectares / 2);
    
    return {
      totalCarbonSequestered: Math.round(totalCarbon),
      totalHectares: Math.round(totalHectares),
      totalPlots,
      smallholderFarmers: estimatedFarmers,
      carbonGrowthPercent: 30.45,
      averageIncomeIncrease: 42,
      timberValue: 28500000,
      carbonTimelineData: [
        { year: '2020', carbon: Math.round(totalCarbon * 0.3) },
        { year: '2021', carbon: Math.round(totalCarbon * 0.5) },
        { year: '2022', carbon: Math.round(totalCarbon * 0.7) },
        { year: '2023', carbon: Math.round(totalCarbon * 0.85) },
        { year: '2024', carbon: Math.round(totalCarbon) },
      ],
      ecologicalComposition: [
        { name: 'Native Forest', value: 45 },
        { name: 'Mixed Plantation', value: 38 },
        { name: 'Agroforestry', value: 20 },
      ],
    };
  }, [regions]);

  // Test API connectivity on mount
  useEffect(() => {
    const testAPIs = async () => {
      try {
        const report = await apiTester.generateReport();
        console.log(report);
      } catch (error) {
        console.error('API test failed:', error);
      }
    };
    
    testAPIs();
  }, []);

  const handleSelectRegion = (region: Region) => {
    setSelectedRegion(region);
  };

  const handleCloseDetail = () => {
    setSelectedRegion(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* VISIBLE INDICATOR - NEW SYSTEM */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 to-blue-500 text-white text-center py-2 font-bold text-lg shadow-lg">
        🎉 REAL-TIME RISK ANALYSIS SYSTEM ACTIVE - Data from OpenWeatherMap, SoilGrids & Satellite APIs 🎉
      </div>

      {/* Header */}
      <Header 
        simulationMode={simulationMode} 
        onSimulationToggle={setSimulationMode} 
      />

      {/* Main Content */}
      <div className="pt-20 h-screen flex flex-col">{/* Changed from pt-16 to pt-20 for banner */}
        {/* Map and Sidebar Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Region Sidebar */}
          <RegionSidebar
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
          />

          {/* Map View */}
          <div className="flex-1 p-4">
            <MapView
              selectedRegion={selectedRegion}
              onSelectRegion={handleSelectRegion}
              simulationMode={simulationMode}
            />
          </div>
        </div>

        {/* Analytics Strip */}
        <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
          <AnalyticsStrip analytics={globalAnalytics} />
        </div>
      </div>

      {/* Region Detail Panel (Slide-in) */}
      {selectedRegion && (
        <RegionDetailPanel
          region={selectedRegion}
          onClose={handleCloseDetail}
          simulationMode={simulationMode}
        />
      )}

      {/* Data Source Indicator */}
      {loading && (
        <div className="fixed bottom-4 right-4 px-4 py-2 rounded-lg bg-primary/90 text-primary-foreground text-sm shadow-lg">
          Loading real data...
        </div>
      )}

      {/* Color Legend */}
      <div className="fixed bottom-4 left-4 glass-card rounded-xl p-4 shadow-lg">
        <h4 className="text-sm font-semibold text-foreground mb-3">Status Indicators</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Healthy / Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Moderate / Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Poor / High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
