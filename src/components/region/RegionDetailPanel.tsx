import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Thermometer, CloudRain, Sun, Leaf, Loader2, AlertTriangle } from 'lucide-react';
import { Region, countryFlags } from '@/data/mockData';
import { cn } from '@/lib/utils';
import SoilIntelligencePanel from './SoilIntelligencePanel';
import SpeciesRecommendations from './SpeciesRecommendations';
import { RiskTimeline } from '@/components/analytics/RiskTimeline';
import RiskAlerts from './RiskAlerts';
import HealthAnalytics from './HealthAnalytics';
import DecisionSupport from './DecisionSupport';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalysisAPI, SiteAnalysisResponse } from '@/services/api/analysisApi';
import EnterpriseService, { EnterpriseWorkflowResponse } from '@/services/api/enterpriseService';
import { Progress } from '@/components/ui/progress';

import { NotificationEngine } from '@/services/analytics/notificationEngine';

interface RegionDetailPanelProps {
  region: Region | null;
  onClose: () => void;
  simulationMode: boolean;
}

const RegionDetailPanel = ({ region, onClose, simulationMode }: RegionDetailPanelProps) => {
  const [analysisData, setAnalysisData] = useState<SiteAnalysisResponse | null>(null);
  const [enterpriseData, setEnterpriseData] = useState<EnterpriseWorkflowResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useEnterpriseWorkflow, setUseEnterpriseWorkflow] = useState(true); // Toggle for demo
  const [activeScenario, setActiveScenario] = useState<{ type: string, intensity: string } | null>(null);

  // Fetch detailed analysis when region changes or simulation mode/scenario changes
  useEffect(() => {
    if (region) {
      if (simulationMode && !activeScenario) {
        // Default scenario if entering simulation mode
        setActiveScenario({ type: 'drought', intensity: 'high' });
      } else if (!simulationMode) {
        setActiveScenario(null);
      }
      fetchAnalysisData();
    }
  }, [region, simulationMode, activeScenario]);

  const fetchAnalysisData = async () => {
    if (!region) return;
    setIsLoading(true);
    setError(null);

    try {
      const [lat, lng] = region.coordinates;

      // Legacy Analysis (now with simulation powers)
      const analysis = await AnalysisAPI.analyzeSite(
        lat,
        lng,
        simulationMode,
        activeScenario ? {
          type: activeScenario.type,
          intensity: activeScenario.intensity,
          duration: 14 // standard window
        } : undefined
      );
      setAnalysisData(analysis);

      // Process notifications if risks are detected
      if (analysis.risks && analysis.risks.length > 0) {
        NotificationEngine.processRisks(analysis.risks, region.name);
      }

      if (useEnterpriseWorkflow && !simulationMode) {
        // Only run heavy enterprise workflow if NOT in simulation mode (or if we updated it too)
        // For now, let's skip re-running enterprise in sim mode to save time/calls, 
        // as we primarily want the Risk Engine output which is in AnalysisAPI.
        const enterpriseResponse = await EnterpriseService.analyzeRestorationSite({
          lat,
          lng,
          regionName: region.name
        });
        setEnterpriseData(enterpriseResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!region) return null;

  const getSuitabilityColor = (score: number) => {
    if (score >= 85) return 'text-success bg-success/10';
    if (score >= 70) return 'text-primary bg-primary/10';
    if (score >= 50) return 'text-warning bg-warning/10';
    return 'text-destructive bg-destructive/10';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-16 bottom-0 w-[480px] glass-card border-l border-border/50 z-40 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{countryFlags[region.countryCode]}</span>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{region.name}</h2>
                <p className="text-sm text-muted-foreground">{region.country} • {region.continent}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Suitability Score */}
          <div className="mt-4">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-muted/50 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Analyzing site...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-destructive/10 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="text-sm text-destructive">Analysis failed</span>
                </div>
              </div>
            ) : analysisData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "px-4 py-2 rounded-xl font-semibold",
                    getSuitabilityColor(analysisData.landScore)
                  )}>
                    <span className="text-2xl">{analysisData.landScore}</span>
                    <span className="text-sm ml-1">/100</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Land Suitability Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        analysisData.priority === 'High' ? "bg-warning/20 text-warning" :
                          analysisData.priority === 'Medium' ? "bg-chart-blue/20 text-chart-blue" :
                            "bg-success/20 text-success"
                      )}>
                        {analysisData.priority} Priority
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {analysisData.metadata.processingTime}ms analysis time
                      </span>
                    </div>
                  </div>
                </div>

                {/* Component Scores */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <p className="text-xs text-muted-foreground">Vegetation</p>
                    <p className="text-sm font-semibold text-foreground">{analysisData.vegetation.vegetationIndex >= 0.6 ? 'Good' : analysisData.vegetation.vegetationIndex >= 0.3 ? 'Moderate' : 'Poor'}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <p className="text-xs text-muted-foreground">Soil</p>
                    <p className="text-sm font-semibold text-foreground">{analysisData.soil.ph >= 6 && analysisData.soil.ph <= 7.5 ? 'Optimal' : 'Needs Work'}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <p className="text-xs text-muted-foreground">Climate</p>
                    <p className="text-sm font-semibold text-foreground">{analysisData.climate.rainfall >= 800 ? 'Suitable' : 'Challenging'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-4 py-2 rounded-xl font-semibold",
                  getSuitabilityColor(region.suitabilityScore)
                )}>
                  <span className="text-2xl">{region.suitabilityScore}</span>
                  <span className="text-sm ml-1">/100</span>
                </div>
                <span className="text-sm text-muted-foreground">Land Suitability Score (Legacy)</span>
              </div>
            )}
          </div>

          {/* Climate Data */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <CloudRain className="w-4 h-4 text-chart-blue" />
              <div>
                <p className="text-sm font-medium">
                  {analysisData ? `${Math.round(analysisData.climate.rainfall)} mm` : `${Math.round(region.climate.rainfall)} mm`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <Thermometer className="w-4 h-4 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-sm font-medium">
                  {analysisData ? `${analysisData.climate.avgTemp.toFixed(1)}°C` : `${region.climate.temperature.toFixed(1)}°C`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <Sun className="w-4 h-4 text-chart-amber" />
              <div>
                <p className="text-xs text-muted-foreground">Season</p>
                <p className="text-sm font-medium text-ellipsis overflow-hidden">
                  {analysisData ? analysisData.climate.rainfallSeason : region.climate.seasonality}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">
            {/* Enhanced Species Recommendations */}
            {analysisData ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-success" />
                  AI Species Recommendations
                </h3>
                <div className="space-y-3">
                  {analysisData.recommendedSpecies.map((species, index) => (
                    <motion.div
                      key={species.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl glass-card border border-border/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{species.name}</h4>
                          <p className="text-sm text-muted-foreground italic">{species.scientificName}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {species.survivalProbability}%
                          </div>
                          <p className="text-xs text-muted-foreground">Survival Rate</p>
                        </div>
                      </div>

                      <p className="text-sm text-foreground mb-3">{species.reason}</p>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="text-xs">
                          <span className="font-medium text-foreground">Growth Rate:</span>
                          <span className="ml-2 text-muted-foreground capitalize">{species.growthRate}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-foreground">Maturity:</span>
                          <span className="ml-2 text-muted-foreground">{species.maturityYears} years</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-foreground">Height:</span>
                          <span className="ml-2 text-muted-foreground">{species.height}m</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-foreground">Carbon:</span>
                          <span className="ml-2 text-muted-foreground">{species.carbonSequestration}t/ha/yr</span>
                        </div>
                      </div>

                      {species.pros.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-success mb-1">Advantages:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {species.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-success">•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {species.cons.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-warning mb-1">Considerations:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {species.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-warning">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <SpeciesRecommendations species={region.species} />
            )}

            {/* Enhanced Soil Intelligence */}
            {analysisData ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Soil Analysis</h3>
                <div className="p-4 rounded-xl glass-card border border-border/50">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">pH Level</p>
                      <p className="text-lg font-semibold text-foreground">{analysisData.soil.ph.toFixed(1)}</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(100, (analysisData.soil.ph / 8) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Organic Matter</p>
                      <p className="text-lg font-semibold text-foreground">{analysisData.soil.organic_matter.toFixed(1)}%</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div
                          className="bg-success h-2 rounded-full"
                          style={{ width: `${Math.min(100, (analysisData.soil.organic_matter / 5) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 rounded-lg bg-secondary/30">
                      <p className="text-xs text-muted-foreground">Nitrogen</p>
                      <p className="text-sm font-medium capitalize text-foreground">{analysisData.soil.nitrogen}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary/30">
                      <p className="text-xs text-muted-foreground">Phosphorus</p>
                      <p className="text-sm font-medium capitalize text-foreground">{analysisData.soil.phosphorus}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary/30">
                      <p className="text-xs text-muted-foreground">Potassium</p>
                      <p className="text-sm font-medium capitalize text-foreground">{analysisData.soil.potassium}</p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Texture: {analysisData.soil.texture} • Drainage: {analysisData.soil.drainage}</p>
                    <p>Depth: {analysisData.soil.depth}cm • Confidence: {Math.round(analysisData.soil.confidence * 100)}%</p>
                  </div>
                </div>
              </div>
            ) : (
              <SoilIntelligencePanel soil={region.soil} />
            )}

            {/* Risk Alerts & Simulation Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Risk Analysis</h3>
                {simulationMode && (
                  <div className="flex gap-1">
                    {['drought', 'heat', 'flood'].map(t => (
                      <button
                        key={t}
                        onClick={() => setActiveScenario({ type: t, intensity: 'high' })}
                        className={cn(
                          "px-2 py-1 text-xs rounded border transition-colors",
                          activeScenario?.type === t
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-muted border-input"
                        )}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Using new RiskTimeline component */}
              <RiskTimeline
                risks={
                  analysisData
                    ? (simulationMode && activeScenario
                      ? analysisData.risks?.filter(r => r.type === activeScenario.type) || []
                      : analysisData.risks || [])
                    : (region.risks || [])
                }
                simulationMode={simulationMode}
              />
            </div>

            {/* Health Analytics */}
            <HealthAnalytics
              survivalRate={region.survivalRate}
              carbonSequestered={region.carbonSequestered}
            />

            {/* Decision Support */}
            <DecisionSupport regionId={region.id} simulationMode={simulationMode} />
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegionDetailPanel;
