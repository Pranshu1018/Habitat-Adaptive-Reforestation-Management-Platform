import { motion, AnimatePresence } from 'framer-motion';
import { X, Thermometer, CloudRain, Sun, Leaf } from 'lucide-react';
import { Region, countryFlags } from '@/data/mockData';
import { cn } from '@/lib/utils';
import SoilIntelligencePanel from './SoilIntelligencePanel';
import SpeciesRecommendations from './SpeciesRecommendations';
import RiskAlerts from './RiskAlerts';
import HealthAnalytics from './HealthAnalytics';
import DecisionSupport from './DecisionSupport';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RegionDetailPanelProps {
  region: Region | null;
  onClose: () => void;
  simulationMode: boolean;
}

const RegionDetailPanel = ({ region, onClose, simulationMode }: RegionDetailPanelProps) => {
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
          <div className="mt-4 flex items-center gap-4">
            <div className={cn(
              "px-4 py-2 rounded-xl font-semibold",
              getSuitabilityColor(region.suitabilityScore)
            )}>
              <span className="text-2xl">{region.suitabilityScore}</span>
              <span className="text-sm ml-1">/100</span>
            </div>
            <span className="text-sm text-muted-foreground">Land Suitability Score</span>
          </div>

          {/* Climate Data */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <CloudRain className="w-4 h-4 text-chart-blue" />
              <div>
                <p className="text-xs text-muted-foreground">Rainfall</p>
                <p className="text-sm font-medium">{region.climate.rainfall} mm</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <Thermometer className="w-4 h-4 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-sm font-medium">{region.climate.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
              <Sun className="w-4 h-4 text-chart-amber" />
              <div>
                <p className="text-xs text-muted-foreground">Seasonality</p>
                <p className="text-sm font-medium text-ellipsis overflow-hidden">{region.climate.seasonality}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">
            {/* Species Recommendations */}
            <SpeciesRecommendations species={region.species} />

            {/* Soil Intelligence */}
            <SoilIntelligencePanel soil={region.soil} />

            {/* Risk Alerts */}
            <RiskAlerts risks={region.risks} simulationMode={simulationMode} />

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
