// Habitat Mock Data - Global Restoration Regions

export interface Region {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  coordinates: [number, number];
  plots: number;
  initiatives: number;
  hectares: number;
  imageUrl: string;
  suitabilityScore: number;
  climate: {
    rainfall: number;
    temperature: number;
    seasonality: string;
  };
  soil: {
    ph: number;
    nitrogen: 'low' | 'medium' | 'high';
    phosphorus: 'low' | 'medium' | 'high';
    potassium: 'low' | 'medium' | 'high';
    moisture: number;
    texture: string;
    organic_matter: number;
  };
  vegetation: {
    health: number; // 0-100 NDVI equivalent
    coverage: number; // 0-100 percentage
    diversity: number; // 0-100 species diversity
    degradation: 'low' | 'medium' | 'high' | 'severe';
  };
  riskZones: {
    drought: 'low' | 'medium' | 'high';
    flood: 'low' | 'medium' | 'high';
    fire: 'low' | 'medium' | 'high';
    erosion: 'low' | 'medium' | 'high';
  };
  carbonSequestered: number;
  survivalRate: number;
  species: Species[];
  risks: Risk[];
  restorationPriority: 'low' | 'medium' | 'high' | 'critical';
  ecosystemType: string;
}

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  survivalProbability: number;
  reason: string;
  imageUrl: string;
}

export interface Risk {
  id: string;
  type: 'drought' | 'heat' | 'pest' | 'flood';
  probability: number;
  severity: 'low' | 'medium' | 'high';
  expectedDate: string;
  description: string;
}

export interface Recommendation {
  id: string;
  action: string;
  reason: string;
  impact: string;
  confidence: number;
  category: 'irrigation' | 'soil' | 'species' | 'protection';
}

export const regions: Region[] = [
  // Africa
  {
    id: 'uganda-1',
    name: 'Mount Elgon',
    country: 'Uganda',
    countryCode: 'UG',
    continent: 'Africa',
    coordinates: [34.5, 1.1],
    plots: 156,
    initiatives: 12,
    hectares: 4520,
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    suitabilityScore: 87,
    climate: { rainfall: 1450, temperature: 22, seasonality: 'Bimodal' },
    soil: { ph: 6.2, nitrogen: 'medium', phosphorus: 'low', potassium: 'medium', moisture: 65 },
    carbonSequestered: 18500,
    survivalRate: 82,
    species: [
      { id: 's1', name: 'African Mahogany', scientificName: 'Khaya anthotheca', survivalProbability: 88, reason: 'Native species with high drought tolerance', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400' },
      { id: 's2', name: 'Prunus africana', scientificName: 'Prunus africana', survivalProbability: 85, reason: 'Excellent for highland conditions', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400' },
    ],
    risks: [
      { id: 'r1', type: 'drought', probability: 25, severity: 'medium', expectedDate: '2024-06', description: 'Moderate drought risk during dry season' },
    ],
  },
  {
    id: 'kenya-1',
    name: 'Mau Forest',
    country: 'Kenya',
    countryCode: 'KE',
    continent: 'Africa',
    coordinates: [35.5, -0.5],
    plots: 234,
    initiatives: 18,
    hectares: 8750,
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    suitabilityScore: 92,
    climate: { rainfall: 1800, temperature: 18, seasonality: 'Bimodal' },
    soil: { ph: 5.8, nitrogen: 'high', phosphorus: 'medium', potassium: 'high', moisture: 78 },
    carbonSequestered: 32400,
    survivalRate: 89,
    species: [
      { id: 's3', name: 'East African Cedar', scientificName: 'Juniperus procera', survivalProbability: 92, reason: 'Native highland species, excellent carbon capture', imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400' },
      { id: 's4', name: 'Bamboo', scientificName: 'Yushania alpina', survivalProbability: 95, reason: 'Fast growing, prevents soil erosion', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
    ],
    risks: [
      { id: 'r2', type: 'pest', probability: 15, severity: 'low', expectedDate: '2024-08', description: 'Minor pest activity expected' },
    ],
  },
  {
    id: 'ghana-1',
    name: 'Ashanti Region',
    country: 'Ghana',
    countryCode: 'GH',
    continent: 'Africa',
    coordinates: [-1.5, 6.7],
    plots: 189,
    initiatives: 15,
    hectares: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    suitabilityScore: 79,
    climate: { rainfall: 1500, temperature: 26, seasonality: 'Unimodal' },
    soil: { ph: 5.5, nitrogen: 'medium', phosphorus: 'low', potassium: 'medium', moisture: 55 },
    carbonSequestered: 21800,
    survivalRate: 76,
    species: [
      { id: 's5', name: 'Iroko', scientificName: 'Milicia excelsa', survivalProbability: 82, reason: 'Valuable hardwood, adapts to various soils', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400' },
    ],
    risks: [
      { id: 'r3', type: 'heat', probability: 35, severity: 'medium', expectedDate: '2024-03', description: 'Heat stress during dry season' },
    ],
  },
  // Asia
  {
    id: 'indonesia-1',
    name: 'Kalimantan',
    country: 'Indonesia',
    countryCode: 'ID',
    continent: 'Asia',
    coordinates: [116.0, 0.5],
    plots: 312,
    initiatives: 24,
    hectares: 12400,
    imageUrl: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&q=80',
    suitabilityScore: 94,
    climate: { rainfall: 2800, temperature: 27, seasonality: 'Equatorial' },
    soil: { ph: 5.2, nitrogen: 'high', phosphorus: 'medium', potassium: 'high', moisture: 85 },
    carbonSequestered: 48600,
    survivalRate: 91,
    species: [
      { id: 's6', name: 'Meranti', scientificName: 'Shorea spp.', survivalProbability: 94, reason: 'Native dipterocarp, excellent for biodiversity', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
      { id: 's7', name: 'Ramin', scientificName: 'Gonystylus bancanus', survivalProbability: 88, reason: 'Peat-adapted species', imageUrl: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400' },
    ],
    risks: [
      { id: 'r4', type: 'flood', probability: 20, severity: 'low', expectedDate: '2024-11', description: 'Seasonal flooding in low areas' },
    ],
  },
  {
    id: 'india-1',
    name: 'Western Ghats',
    country: 'India',
    countryCode: 'IN',
    continent: 'Asia',
    coordinates: [75.5, 14.0],
    plots: 278,
    initiatives: 21,
    hectares: 9800,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    suitabilityScore: 88,
    climate: { rainfall: 3200, temperature: 24, seasonality: 'Monsoon' },
    soil: { ph: 6.0, nitrogen: 'high', phosphorus: 'medium', potassium: 'medium', moisture: 72 },
    carbonSequestered: 38200,
    survivalRate: 85,
    species: [
      { id: 's8', name: 'Teak', scientificName: 'Tectona grandis', survivalProbability: 90, reason: 'High-value timber, excellent in monsoon climate', imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400' },
      { id: 's9', name: 'Sandalwood', scientificName: 'Santalum album', survivalProbability: 78, reason: 'High economic value, medicinal properties', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    ],
    risks: [
      { id: 'r5', type: 'flood', probability: 30, severity: 'medium', expectedDate: '2024-07', description: 'Monsoon flooding risk' },
    ],
  },
  {
    id: 'vietnam-1',
    name: 'Central Highlands',
    country: 'Vietnam',
    countryCode: 'VN',
    continent: 'Asia',
    coordinates: [108.0, 12.5],
    plots: 198,
    initiatives: 16,
    hectares: 7200,
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
    suitabilityScore: 83,
    climate: { rainfall: 1900, temperature: 23, seasonality: 'Monsoon' },
    soil: { ph: 5.8, nitrogen: 'medium', phosphorus: 'medium', potassium: 'high', moisture: 68 },
    carbonSequestered: 26400,
    survivalRate: 81,
    species: [
      { id: 's10', name: 'Acacia', scientificName: 'Acacia mangium', survivalProbability: 88, reason: 'Fast-growing nitrogen fixer', imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400' },
    ],
    risks: [
      { id: 'r6', type: 'drought', probability: 28, severity: 'medium', expectedDate: '2024-04', description: 'Dry season water stress' },
    ],
  },
  // South America
  {
    id: 'brazil-1',
    name: 'Amazon Basin',
    country: 'Brazil',
    countryCode: 'BR',
    continent: 'South America',
    coordinates: [-60.0, -3.0],
    plots: 456,
    initiatives: 32,
    hectares: 18500,
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    suitabilityScore: 96,
    climate: { rainfall: 2400, temperature: 27, seasonality: 'Equatorial' },
    soil: { ph: 5.0, nitrogen: 'high', phosphorus: 'low', potassium: 'medium', moisture: 88 },
    carbonSequestered: 72800,
    survivalRate: 93,
    species: [
      { id: 's11', name: 'Brazil Nut', scientificName: 'Bertholletia excelsa', survivalProbability: 91, reason: 'Keystone species, supports local economy', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400' },
      { id: 's12', name: 'Açaí Palm', scientificName: 'Euterpe oleracea', survivalProbability: 95, reason: 'High survival, valuable fruit production', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400' },
    ],
    risks: [
      { id: 'r7', type: 'drought', probability: 18, severity: 'low', expectedDate: '2024-09', description: 'El Niño related dry spell' },
    ],
  },
  {
    id: 'colombia-1',
    name: 'Chocó Region',
    country: 'Colombia',
    countryCode: 'CO',
    continent: 'South America',
    coordinates: [-77.0, 5.5],
    plots: 167,
    initiatives: 14,
    hectares: 5800,
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    suitabilityScore: 91,
    climate: { rainfall: 4500, temperature: 26, seasonality: 'Perhumid' },
    soil: { ph: 5.4, nitrogen: 'high', phosphorus: 'medium', potassium: 'high', moisture: 92 },
    carbonSequestered: 24600,
    survivalRate: 88,
    species: [
      { id: 's13', name: 'Ceiba', scientificName: 'Ceiba pentandra', survivalProbability: 90, reason: 'Massive carbon storage, cultural significance', imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400' },
    ],
    risks: [
      { id: 'r8', type: 'flood', probability: 35, severity: 'medium', expectedDate: '2024-05', description: 'Heavy rainfall flooding' },
    ],
  },
  {
    id: 'peru-1',
    name: 'Madre de Dios',
    country: 'Peru',
    countryCode: 'PE',
    continent: 'South America',
    coordinates: [-70.0, -12.5],
    plots: 145,
    initiatives: 11,
    hectares: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&q=80',
    suitabilityScore: 89,
    climate: { rainfall: 2100, temperature: 25, seasonality: 'Seasonal' },
    soil: { ph: 5.6, nitrogen: 'medium', phosphorus: 'low', potassium: 'medium', moisture: 75 },
    carbonSequestered: 21200,
    survivalRate: 84,
    species: [
      { id: 's14', name: 'Shihuahuaco', scientificName: 'Dipteryx micrantha', survivalProbability: 86, reason: 'Exceptional hardwood, long lifespan', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
    ],
    risks: [
      { id: 'r9', type: 'pest', probability: 22, severity: 'low', expectedDate: '2024-08', description: 'Seasonal pest emergence' },
    ],
  },
];

// Global analytics data
export const globalAnalytics = {
  totalCarbonSequestered: 304500,
  carbonGrowthPercent: 30.45,
  totalHectares: 78370,
  ecologicalComposition: [
    { name: 'Native Forest', value: 45, color: 'hsl(var(--chart-green))' },
    { name: 'Mixed Plantation', value: 35, color: 'hsl(var(--chart-blue))' },
    { name: 'Agroforestry', value: 20, color: 'hsl(var(--chart-earth))' },
  ],
  smallholderFarmers: 12847,
  averageIncomeIncrease: 42,
  timberValue: 28500000,
  carbonTimelineData: [
    { year: 2019, carbon: 45000 },
    { year: 2020, carbon: 78000 },
    { year: 2021, carbon: 125000 },
    { year: 2022, carbon: 189000 },
    { year: 2023, carbon: 248000 },
    { year: 2024, carbon: 304500 },
  ],
  vegetationHealthTrend: [
    { month: 'Jan', health: 78 },
    { month: 'Feb', health: 75 },
    { month: 'Mar', health: 72 },
    { month: 'Apr', health: 80 },
    { month: 'May', health: 85 },
    { month: 'Jun', health: 88 },
    { month: 'Jul', health: 90 },
    { month: 'Aug', health: 87 },
    { month: 'Sep', health: 84 },
    { month: 'Oct', health: 82 },
    { month: 'Nov', health: 79 },
    { month: 'Dec', health: 81 },
  ],
};

export const recommendations: Recommendation[] = [
  {
    id: 'rec1',
    action: 'Increase irrigation by 20%',
    reason: 'Soil moisture levels are below optimal for current growth phase',
    impact: 'Expected 15% improvement in survival rate',
    confidence: 87,
    category: 'irrigation',
  },
  {
    id: 'rec2',
    action: 'Apply nitrogen-rich compost',
    reason: 'Nitrogen deficiency detected in soil samples',
    impact: 'Accelerated growth rate by 25%',
    confidence: 92,
    category: 'soil',
  },
  {
    id: 'rec3',
    action: 'Switch to drought-resistant species',
    reason: 'Climate projections indicate increased dry spells',
    impact: 'Long-term resilience improvement',
    confidence: 78,
    category: 'species',
  },
  {
    id: 'rec4',
    action: 'Install pest monitoring stations',
    reason: 'Seasonal pest activity expected to increase',
    impact: 'Early detection reduces crop loss by 40%',
    confidence: 85,
    category: 'protection',
  },
];

// Country flag emojis
export const countryFlags: Record<string, string> = {
  UG: '🇺🇬',
  KE: '🇰🇪',
  GH: '🇬🇭',
  ID: '🇮🇩',
  IN: '🇮🇳',
  VN: '🇻🇳',
  BR: '🇧🇷',
  CO: '🇨🇴',
  PE: '🇵🇪',
};
