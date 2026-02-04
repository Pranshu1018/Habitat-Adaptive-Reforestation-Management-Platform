import { AnalysisController, SiteAnalysisRequest, SiteAnalysisResponse } from '../backend/analysisController';

export class AnalysisAPI {
  private static readonly API_BASE = 'http://localhost:3001/api';

  static async analyzeSite(
    lat: number,
    lng: number,
    simulationMode: boolean = false,
    scenario?: any
  ): Promise<SiteAnalysisResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/site/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lng, simulationMode, scenario }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform backend response to match frontend interface
      return this.transformBackendResponse(data);
    } catch (error) {
      console.error('Error analyzing site:', error);

      // Fallback to mock analysis if backend is unavailable
      console.warn('Falling back to mock analysis due to backend error');
      try {
        return await this.getMockAnalysis(lat, lng, simulationMode, scenario);
      } catch (mockError) {
        console.error('Mock analysis also failed, using static fallback:', mockError);
        return this.getStaticFallback(lat, lng);
      }
    }
  }

  private static getStaticFallback(lat: number, lng: number): SiteAnalysisResponse {
    // Ultimate fallback if everything else fails
    return {
      landScore: 78,
      priority: 'Medium',
      soil: {
        ph: 6.5,
        nitrogen: 'medium',
        phosphorus: 'high',
        potassium: 'medium',
        organic_matter: 2.4,
        texture: 'loamy_sand',
        drainage: 'good',
        depth: 120,
        confidence: 0.5,
        source: 'Fallback System'
      },
      climate: {
        avgTemp: 26,
        minTemp: 18,
        maxTemp: 32,
        rainfall: 1100,
        rainfallSeason: 'bimodal',
        droughtRisk: 'low',
        humidity: 65,
        growingSeason: 300,
        frostDays: 0,
        confidence: 0.5,
        source: 'Fallback System'
      },
      vegetation: {
        vegetationIndex: 0.55,
        landType: 'grassland',
        forestCover: 25,
        grassCover: 60,
        bareSoil: 15,
        degradationLevel: 'moderate',
        regenerationPotential: 0.7,
        erosionRisk: 'low',
        confidence: 0.5,
        source: 'Fallback System'
      },
      recommendedSpecies: [
        {
          name: "Acacia",
          scientificName: "Acacia koa",
          survivalProbability: 85,
          matchScore: 88,
          reason: "Highly adaptable to current conditions",
          pros: ["Drought resistant", "Nitrogen fixing"],
          cons: ["Slow initial growth"],
          growthRate: "medium",
          maturityYears: 15,
          height: 20,
          uses: ["wood", "shade"],
          carbonSequestration: 15,
          biodiversityValue: 8,
          suitabilityFactors: {}
        }
      ],
      risks: [
        {
          id: 'fallback-risk-1',
          type: 'drought',
          probability: 88,
          severity: 'critical',
          expectedDate: new Date(Date.now() + 86400000 * 18).toISOString(),
          daysAhead: 18,
          description: 'CRITICAL drought risk: Projecting severe soil moisture depletion within 3 weeks if irrigation is not optimized.',
          mitigationActions: [
            'Deploy emergency water storage',
            'Commence hyper-local soil moisture tracking',
            'Activate solar-shade deployment'
          ],
          confidence: 0.9
        }
      ],
      metadata: {
        location: { lat, lng },
        analysisDate: new Date().toISOString(),
        dataConfidence: { soil: 0.5, climate: 0.5, vegetation: 0.5 },
        processingTime: 0
      }
    };
  }

  private static transformBackendResponse(backendData: any): SiteAnalysisResponse {
    return {
      landScore: backendData.landScore || 50,
      priority: backendData.priority || 'Medium',
      soil: {
        ph: backendData.soil?.ph || 6.5,
        nitrogen: backendData.soil?.nitrogen || 'medium',
        phosphorus: backendData.soil?.phosphorus || 'medium',
        potassium: backendData.soil?.potassium || 'medium',
        organic_matter: backendData.soil?.organicCarbon || 2.0,
        texture: backendData.soil?.texture || 'loamy',
        drainage: backendData.soil?.drainage || 'moderate',
        depth: backendData.soil?.depth || 100,
        confidence: backendData.metadata?.dataConfidence?.soil || 0.8,
        source: backendData.soil?.mock ? 'Mock Data' : 'SoilGrids API'
      },
      climate: {
        avgTemp: backendData.weather?.current?.temp || 25,
        minTemp: backendData.weather?.current?.temp - 5 || 20,
        maxTemp: backendData.weather?.current?.temp + 5 || 30,
        rainfall: backendData.weather?.current?.precipitation * 100 || 800,
        rainfallSeason: 'bimodal',
        droughtRisk: 'medium',
        humidity: backendData.weather?.current?.humidity || 65,
        growingSeason: 240,
        frostDays: 0,
        confidence: backendData.metadata?.dataConfidence?.weather || 0.8,
        source: backendData.weather?.mock ? 'Mock Data' : 'OpenWeatherMap API'
      },
      vegetation: {
        vegetationIndex: backendData.vegetation?.ndvi || 0.5,
        landType: backendData.vegetation?.ndvi > 0.6 ? 'forest' :
          backendData.vegetation?.ndvi > 0.3 ? 'grassland' : 'degraded',
        forestCover: backendData.vegetation?.coverage || 40,
        grassCover: 30,
        bareSoil: 30,
        degradationLevel: backendData.vegetation?.ndvi < 0.3 ? 'severe' :
          backendData.vegetation?.ndvi < 0.5 ? 'moderate' : 'low',
        regenerationPotential: 0.7,
        erosionRisk: 'medium',
        confidence: backendData.metadata?.dataConfidence?.vegetation || 0.7,
        source: backendData.vegetation?.mock ? 'Mock Data' : 'Satellite Analysis'
      },
      recommendedSpecies: (backendData.recommendedSpecies || []).map((species: any) => ({
        name: species.name,
        scientificName: species.scientificName,
        survivalProbability: species.survivalProbability,
        matchScore: species.matchScore,
        reason: species.reason,
        pros: species.pros || [],
        cons: species.cons || [],
        growthRate: species.growthRate,
        maturityYears: species.maturityYears,
        height: species.height,
        uses: species.uses || [],
        carbonSequestration: species.carbonSequestration,
        biodiversityValue: species.biodiversityValue,
        suitabilityFactors: species.suitabilityFactors || {}
      })),
      risks: backendData.risks || [],
      metadata: {
        location: { lat: backendData.location?.lat, lng: backendData.location?.lng },
        analysisDate: backendData.metadata?.analysisDate || new Date().toISOString(),
        dataConfidence: backendData.metadata?.dataConfidence || {
          soil: 0.8,
          climate: 0.8,
          vegetation: 0.7
        },
        processingTime: backendData.metadata?.processingTime || 1500
      }
    };
  }

  private static async getMockAnalysis(
    lat: number,
    lng: number,
    simulationMode: boolean = false,
    scenario?: any
  ): Promise<SiteAnalysisResponse> {
    // Import the mock analysis controller
    const { AnalysisController } = await import('../backend/analysisController');
    return AnalysisController.analyzeSite({ lat, lng, simulationMode, scenario });
  }

  static async analyzeSiteBatch(locations: { lat: number; lng: number }[]): Promise<SiteAnalysisResponse[]> {
    try {
      const response = await fetch(`${this.API_BASE}/site/analyze/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locations }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((item: any) => this.transformBackendResponse(item));
    } catch (error) {
      console.error('Error in batch analysis:', error);
      throw error;
    }
  }
}

// Export types for frontend use
export type { SiteAnalysisRequest, SiteAnalysisResponse } from '../backend/analysisController';
