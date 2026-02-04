import { SoilService } from './soilService';
import { ClimateService } from './climateService';
import { VegetationService } from './vegetationService';
import { LandScoring } from './logic/landScoring';
import { SpeciesMatcher } from './logic/speciesMatcher';
import { riskPredictor } from '../analytics/riskPredictor';

export interface SiteAnalysisRequest {
  lat: number;
  lng: number;
  simulationMode?: boolean;
  scenario?: any;
}

export interface SiteAnalysisResponse {
  landScore: number;
  priority: 'High' | 'Medium' | 'Low';
  soil: any;
  climate: any;
  vegetation: any;
  recommendedSpecies: any[];
  risks?: any[];
  metadata: {
    location: { lat: number; lng: number };
    analysisDate: string;
    dataConfidence: {
      soil: number;
      climate: number;
      vegetation: number;
    };
    processingTime: number;
  };
}

export class AnalysisController {
  static async analyzeSite(request: SiteAnalysisRequest): Promise<SiteAnalysisResponse> {
    const startTime = Date.now();

    try {
      // Step 1: Gather environmental data from all services
      const [soilResponse, climateResponse, vegetationResponse] = await Promise.all([
        SoilService.getSoilData(request.lat, request.lng),
        ClimateService.getClimateData(request.lat, request.lng),
        VegetationService.getVegetationData(request.lat, request.lng)
      ]);

      // Step 2: Calculate land suitability score
      const landScoreResult = LandScoring.calculateLandScore(
        soilResponse.data,
        climateResponse.data,
        vegetationResponse.data
      );

      // Step 3: Get species recommendations
      const recommendedSpecies = SpeciesMatcher.getRecommendedSpecies(
        soilResponse.data,
        climateResponse.data,
        landScoreResult.overallScore,
        5 // Return top 5 recommendations
      );

      // Step 4: Calculate risks (Proactive intelligence)
      // Generate a realistic 21-day mock forecast for evaluation
      const mockForecast = Array.from({ length: 21 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        // Vary weather based on climate data
        const tempVar = (Math.random() - 0.5) * 4;
        const rainVar = Math.random() < 0.2 ? Math.random() * 10 : 0; // 20% chance of rain

        return {
          date: date.toISOString(),
          temp: climateResponse.data.avgTemp + tempVar,
          precipitation: rainVar,
          humidity: climateResponse.data.humidity + (Math.random() - 0.5) * 10
        };
      });

      const risks = await riskPredictor.assessAllRisks(
        request.lat,
        request.lng,
        {
          current: climateResponse.data,
          forecast: mockForecast,
          metadata: { lastUpdate: new Date().toISOString() }
        } as any,
        { healthScore: vegetationResponse.data.vegetationIndex * 100 } as any,
        soilResponse.data as any,
        request.simulationMode,
        request.scenario
      );

      // Step 5: Calculate processing time
      const processingTime = Date.now() - startTime;

      // Step 6: Assemble response
      const response: SiteAnalysisResponse = {
        landScore: landScoreResult.overallScore,
        priority: landScoreResult.priority,
        soil: {
          ...soilResponse.data,
          confidence: soilResponse.confidence,
          source: soilResponse.source
        },
        climate: {
          ...climateResponse.data,
          confidence: climateResponse.confidence,
          source: climateResponse.source
        },
        vegetation: {
          ...vegetationResponse.data,
          confidence: vegetationResponse.confidence,
          source: vegetationResponse.source
        },
        recommendedSpecies: recommendedSpecies.map(rec => ({
          name: rec.species.name,
          scientificName: rec.species.scientificName,
          survivalProbability: Math.round(rec.survivalProbability * 100),
          matchScore: Math.round(rec.matchScore * 100),
          reason: rec.reason,
          pros: rec.pros,
          cons: rec.cons,
          growthRate: rec.species.growthRate,
          maturityYears: rec.species.maturityYears,
          height: rec.species.height,
          uses: rec.species.uses,
          carbonSequestration: rec.species.carbonSequestration,
          biodiversityValue: rec.species.biodiversityValue,
          suitabilityFactors: rec.suitabilityFactors
        })),
        risks,
        metadata: {
          location: { lat: request.lat, lng: request.lng },
          analysisDate: new Date().toISOString(),
          dataConfidence: {
            soil: soilResponse.confidence,
            climate: climateResponse.confidence,
            vegetation: vegetationResponse.confidence
          },
          processingTime
        }
      };

      return response;
    } catch (error) {
      console.error('Error in site analysis:', error);
      throw new Error(`Site analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getBatchAnalysis(requests: SiteAnalysisRequest[]): Promise<SiteAnalysisResponse[]> {
    // Process multiple sites in parallel
    const analyses = await Promise.allSettled(
      requests.map(request => this.analyzeSite(request))
    );

    // Filter out failed analyses and return successful ones
    return analyses
      .filter((result): result is PromiseFulfilledResult<SiteAnalysisResponse> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  static validateRequest(request: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.lat || typeof request.lat !== 'number' || request.lat < -90 || request.lat > 90) {
      errors.push('Latitude must be a number between -90 and 90');
    }

    if (!request.lng || typeof request.lng !== 'number' || request.lng < -180 || request.lng > 180) {
      errors.push('Longitude must be a number between -180 and 180');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
