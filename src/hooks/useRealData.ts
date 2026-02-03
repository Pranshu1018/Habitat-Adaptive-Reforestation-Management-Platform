// React Hook for Real Data Integration
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dataIntegrationService, SiteAnalysis, SimulationScenario } from '@/services/dataIntegrationService';
import { Region } from '@/data/mockData';

export interface UseRealDataOptions {
  lat: number;
  lon: number;
  name: string;
  hectares?: number;
  simulationMode?: boolean;
  simulationScenario?: SimulationScenario;
}

export function useRealData(options: UseRealDataOptions) {
  const {
    lat,
    lon,
    name,
    hectares = 100,
    simulationMode = false,
    simulationScenario,
  } = options;

  return useQuery({
    queryKey: ['siteAnalysis', lat, lon, simulationMode, simulationScenario],
    queryFn: () => dataIntegrationService.analyzeSite(
      lat,
      lon,
      name,
      hectares,
      simulationMode,
      simulationScenario
    ),
    staleTime: simulationMode ? 0 : 30 * 60 * 1000, // 30 minutes for real data, 0 for simulation
    refetchInterval: simulationMode ? false : 5 * 60 * 1000, // Refetch every 5 minutes for real data
  });
}

export function useMultipleSites(
  sites: Array<{ lat: number; lon: number; name: string; hectares: number }>
) {
  return useQuery({
    queryKey: ['multipleSites', sites],
    queryFn: () => dataIntegrationService.analyzeMultipleSites(sites),
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Convert SiteAnalysis to Region format for compatibility with existing UI
 */
export function siteAnalysisToRegion(
  analysis: SiteAnalysis,
  regionId: string,
  country: string,
  countryCode: string,
  continent: string,
  imageUrl: string
): Region {
  return {
    id: regionId,
    name: analysis.location.name,
    country,
    countryCode,
    continent,
    coordinates: [analysis.location.lon, analysis.location.lat],
    plots: Math.round(Math.random() * 200 + 100), // Mock data
    initiatives: Math.round(Math.random() * 20 + 10), // Mock data
    hectares: 100, // Default
    imageUrl,
    suitabilityScore: analysis.suitabilityScore,
    climate: {
      rainfall: Math.round(analysis.weather.forecast.reduce((sum, day) => sum + day.precipitation, 0) * 365 / analysis.weather.forecast.length),
      temperature: Math.round(analysis.weather.current.temp),
      seasonality: 'Variable',
    },
    soil: analysis.soil,
    carbonSequestered: Math.round(analysis.carbonEstimate.currentStock),
    survivalRate: Math.round(analysis.vegetation.healthScore * 0.9), // Approximate
    species: analysis.speciesRecommendations.map(spec => ({
      id: spec.id,
      name: spec.name,
      scientificName: spec.scientificName,
      survivalProbability: spec.survivalProbability,
      reason: spec.reason,
      imageUrl: spec.imageUrl,
    })),
    risks: analysis.risks.map(risk => ({
      id: risk.id,
      type: risk.type,
      probability: risk.probability,
      severity: risk.severity,
      expectedDate: new Date(risk.expectedDate).toISOString().split('T')[0],
      description: risk.description,
    })),
  };
}

/**
 * Hook to enhance existing regions with real data
 */
export function useEnhancedRegions(regions: Region[], simulationMode: boolean = false) {
  const [enhancedRegions, setEnhancedRegions] = useState<Region[]>(regions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const enhanceRegions = async () => {
      setLoading(true);
      try {
        const enhanced = await Promise.all(
          regions.slice(0, 3).map(async (region) => {
            try {
              const analysis = await dataIntegrationService.analyzeSite(
                region.coordinates[1],
                region.coordinates[0],
                region.name,
                region.hectares,
                simulationMode
              );

              return siteAnalysisToRegion(
                analysis,
                region.id,
                region.country,
                region.countryCode,
                region.continent,
                region.imageUrl
              );
            } catch (error) {
              console.error(`Failed to enhance region ${region.name}:`, error);
              return region; // Return original on error
            }
          })
        );

        // Combine enhanced regions with remaining mock regions
        setEnhancedRegions([...enhanced, ...regions.slice(3)]);
      } catch (error) {
        console.error('Failed to enhance regions:', error);
        setEnhancedRegions(regions);
      } finally {
        setLoading(false);
      }
    };

    enhanceRegions();
  }, [simulationMode]);

  return { enhancedRegions, loading };
}
