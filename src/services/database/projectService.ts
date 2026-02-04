// Firebase Realtime Database Service for Complete Project Lifecycle
import { 
  ref,
  push,
  set,
  get,
  update,
  query,
  orderByChild,
  equalTo,
  serverTimestamp,
  onValue,
  off
} from 'firebase/database';
import { db } from '@/config/firebase';

// Data Models
export interface Project {
  id?: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    name: string;
    region: string;
  };
  status: 'planning' | 'planting' | 'monitoring' | 'completed';
  createdAt: any;
  updatedAt: any;
  userId?: string;
}

export interface SiteAnalysis {
  id?: string;
  projectId: string;
  analysisDate: any;
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
  suitabilityScore: number;
  recommendedSpecies: any[];
}

export interface PlantingRecord {
  id?: string;
  projectId: string;
  speciesName: string;
  scientificName: string;
  quantity: number;
  plantingDate: any;
  location: {
    lat: number;
    lon: number;
  };
  plantedBy?: string;
  notes?: string;
}

export interface MonitoringRecord {
  id?: string;
  projectId: string;
  monitoringDate: any;
  survivalRate: number;
  healthScore: number;
  ndvi: number;
  issues: string[];
  photos?: string[];
  notes?: string;
}

export interface Prediction {
  id?: string;
  projectId: string;
  predictionDate: any;
  predictedSurvivalRate: number;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
}

export interface Intervention {
  id?: string;
  projectId: string;
  interventionDate: any;
  type: 'watering' | 'fertilization' | 'pest_control' | 'replanting' | 'other';
  description: string;
  cost?: number;
  status: 'planned' | 'in_progress' | 'completed';
}

// Project Management
export const projectService = {
  // Create new project
  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const projectsRef = ref(db, 'projects');
    const newProjectRef = push(projectsRef);
    
    await set(newProjectRef, {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return newProjectRef.key!;
  },

  // Get project by ID
  async getProject(projectId: string): Promise<Project | null> {
    const projectRef = ref(db, `projects/${projectId}`);
    const snapshot = await get(projectRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.key!, ...snapshot.val() } as Project;
    }
    return null;
  },

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    const projectsRef = ref(db, 'projects');
    const snapshot = await get(projectsRef);
    
    if (snapshot.exists()) {
      const projects: Project[] = [];
      snapshot.forEach((childSnapshot) => {
        projects.push({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        });
      });
      return projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    return [];
  },

  // Listen to projects in real-time
  subscribeToProjects(callback: (projects: Project[]) => void): () => void {
    const projectsRef = ref(db, 'projects');
    
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const projects: Project[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          projects.push({
            id: childSnapshot.key!,
            ...childSnapshot.val()
          });
        });
      }
      callback(projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });

    return () => off(projectsRef);
  },

  // Update project status
  async updateProjectStatus(projectId: string, status: Project['status']): Promise<void> {
    const projectRef = ref(db, `projects/${projectId}`);
    await update(projectRef, {
      status,
      updatedAt: serverTimestamp()
    });
  },

  // Update project
  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    const projectRef = ref(db, `projects/${projectId}`);
    await update(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }
};

// Site Analysis Management
export const analysisService = {
  // Save site analysis
  async saveAnalysis(analysisData: Omit<SiteAnalysis, 'id'>): Promise<string> {
    const analysesRef = ref(db, 'siteAnalyses');
    const newAnalysisRef = push(analysesRef);
    
    await set(newAnalysisRef, {
      ...analysisData,
      analysisDate: serverTimestamp()
    });
    
    return newAnalysisRef.key!;
  },

  // Get analysis by project ID
  async getAnalysisByProject(projectId: string): Promise<SiteAnalysis[]> {
    const analysesRef = ref(db, 'siteAnalyses');
    const snapshot = await get(analysesRef);
    
    const analyses: SiteAnalysis[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.projectId === projectId) {
          analyses.push({
            id: childSnapshot.key!,
            ...data
          });
        }
      });
    }
    return analyses.sort((a, b) => (b.analysisDate || 0) - (a.analysisDate || 0));
  },

  // Get latest analysis
  async getLatestAnalysis(projectId: string): Promise<SiteAnalysis | null> {
    const analyses = await this.getAnalysisByProject(projectId);
    return analyses.length > 0 ? analyses[0] : null;
  },

  // Listen to analyses in real-time
  subscribeToAnalyses(projectId: string, callback: (analyses: SiteAnalysis[]) => void): () => void {
    const analysesRef = ref(db, 'siteAnalyses');
    
    const unsubscribe = onValue(analysesRef, (snapshot) => {
      const analyses: SiteAnalysis[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.projectId === projectId) {
            analyses.push({
              id: childSnapshot.key!,
              ...data
            });
          }
        });
      }
      callback(analyses.sort((a, b) => (b.analysisDate || 0) - (a.analysisDate || 0)));
    });

    return () => off(analysesRef);
  }
};

// Planting Records Management
export const plantingService = {
  // Record planting
  async recordPlanting(plantingData: Omit<PlantingRecord, 'id'>): Promise<string> {
    const plantingsRef = ref(db, 'plantingRecords');
    const newPlantingRef = push(plantingsRef);
    
    await set(newPlantingRef, {
      ...plantingData,
      plantingDate: plantingData.plantingDate || serverTimestamp()
    });
    
    return newPlantingRef.key!;
  },

  // Get planting records by project
  async getPlantingsByProject(projectId: string): Promise<PlantingRecord[]> {
    const plantingsRef = ref(db, 'plantingRecords');
    const snapshot = await get(plantingsRef);
    
    const plantings: PlantingRecord[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.projectId === projectId) {
          plantings.push({
            id: childSnapshot.key!,
            ...data
          });
        }
      });
    }
    return plantings.sort((a, b) => (b.plantingDate || 0) - (a.plantingDate || 0));
  },

  // Get total trees planted
  async getTotalTreesPlanted(projectId: string): Promise<number> {
    const plantings = await this.getPlantingsByProject(projectId);
    return plantings.reduce((sum, p) => sum + p.quantity, 0);
  }
};

// Monitoring Records Management
export const monitoringService = {
  // Add monitoring record
  async addMonitoring(monitoringData: Omit<MonitoringRecord, 'id'>): Promise<string> {
    const monitoringsRef = ref(db, 'monitoringRecords');
    const newMonitoringRef = push(monitoringsRef);
    
    await set(newMonitoringRef, {
      ...monitoringData,
      monitoringDate: monitoringData.monitoringDate || serverTimestamp()
    });
    
    return newMonitoringRef.key!;
  },

  // Get monitoring records by project
  async getMonitoringByProject(projectId: string): Promise<MonitoringRecord[]> {
    const monitoringsRef = ref(db, 'monitoringRecords');
    const snapshot = await get(monitoringsRef);
    
    const records: MonitoringRecord[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.projectId === projectId) {
          records.push({
            id: childSnapshot.key!,
            ...data
          });
        }
      });
    }
    return records.sort((a, b) => (b.monitoringDate || 0) - (a.monitoringDate || 0));
  },

  // Get latest monitoring
  async getLatestMonitoring(projectId: string): Promise<MonitoringRecord | null> {
    const records = await this.getMonitoringByProject(projectId);
    return records.length > 0 ? records[0] : null;
  },

  // Listen to monitoring records in real-time
  subscribeToMonitoring(projectId: string, callback: (records: MonitoringRecord[]) => void): () => void {
    const monitoringsRef = ref(db, 'monitoringRecords');
    
    const unsubscribe = onValue(monitoringsRef, (snapshot) => {
      const records: MonitoringRecord[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.projectId === projectId) {
            records.push({
              id: childSnapshot.key!,
              ...data
            });
          }
        });
      }
      callback(records.sort((a, b) => (b.monitoringDate || 0) - (a.monitoringDate || 0)));
    });

    return () => off(monitoringsRef);
  }
};

// Prediction Management
export const predictionService = {
  // Save prediction
  async savePrediction(predictionData: Omit<Prediction, 'id'>): Promise<string> {
    const predictionsRef = ref(db, 'predictions');
    const newPredictionRef = push(predictionsRef);
    
    await set(newPredictionRef, {
      ...predictionData,
      predictionDate: serverTimestamp()
    });
    
    return newPredictionRef.key!;
  },

  // Get predictions by project
  async getPredictionsByProject(projectId: string): Promise<Prediction[]> {
    const predictionsRef = ref(db, 'predictions');
    const snapshot = await get(predictionsRef);
    
    const predictions: Prediction[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.projectId === projectId) {
          predictions.push({
            id: childSnapshot.key!,
            ...data
          });
        }
      });
    }
    return predictions.sort((a, b) => (b.predictionDate || 0) - (a.predictionDate || 0));
  }
};

// Intervention Management
export const interventionService = {
  // Create intervention
  async createIntervention(interventionData: Omit<Intervention, 'id'>): Promise<string> {
    const interventionsRef = ref(db, 'interventions');
    const newInterventionRef = push(interventionsRef);
    
    await set(newInterventionRef, {
      ...interventionData,
      interventionDate: interventionData.interventionDate || serverTimestamp()
    });
    
    return newInterventionRef.key!;
  },

  // Get interventions by project
  async getInterventionsByProject(projectId: string): Promise<Intervention[]> {
    const interventionsRef = ref(db, 'interventions');
    const snapshot = await get(interventionsRef);
    
    const interventions: Intervention[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.projectId === projectId) {
          interventions.push({
            id: childSnapshot.key!,
            ...data
          });
        }
      });
    }
    return interventions.sort((a, b) => (b.interventionDate || 0) - (a.interventionDate || 0));
  },

  // Update intervention status
  async updateInterventionStatus(interventionId: string, status: Intervention['status']): Promise<void> {
    const interventionRef = ref(db, `interventions/${interventionId}`);
    await update(interventionRef, { status });
  }
};
