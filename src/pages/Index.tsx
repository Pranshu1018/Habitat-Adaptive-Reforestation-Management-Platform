import { useState, useEffect } from 'react';
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
      {/* Header */}
      <Header 
        simulationMode={simulationMode} 
        onSimulationToggle={setSimulationMode} 
      />

      {/* Main Content */}
      <div className="pt-16 h-screen flex flex-col">
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
          <AnalyticsStrip />
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
    </div>
  );
};

export default Index;
