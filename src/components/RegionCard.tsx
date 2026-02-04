import { motion } from 'framer-motion';
import { TreeDeciduous, MapPin, ArrowRight, Leaf, Droplets, AlertTriangle } from 'lucide-react';
import { Region, countryFlags } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface RegionCardProps {
  region: Region;
  isSelected: boolean;
  onSelect: (region: Region) => void;
}

const RegionCard = ({ region, isSelected, onSelect }: RegionCardProps) => {
  // Get vegetation health color
  const getVegetationColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get soil quality color
  const getSoilColor = (quality: string) => {
    if (quality === 'high' || quality === 'Excellent' || quality === 'Good') return 'bg-green-500';
    if (quality === 'medium' || quality === 'Fair') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get risk level color
  const getRiskColor = (risks: any[]) => {
    if (!risks || risks.length === 0) return 'bg-green-500';
    const highRisk = risks.some(r => r.severity === 'critical' || r.severity === 'high');
    const mediumRisk = risks.some(r => r.severity === 'medium');
    if (highRisk) return 'bg-red-500';
    if (mediumRisk) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Calculate vegetation health score
  const vegetationScore = region.survivalRate || 75;
  
  // Get soil quality from region data
  const soilQuality = region.managementData?.soilQuality?.qualityLevel || 
                      region.soil?.nitrogen || 'medium';
  
  // Get risk level
  const riskLevel = region.managementData?.riskLevel || 
                    (region.risks && region.risks.length > 0 ? 'MEDIUM' : 'LOW');

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer group",
        "border-2 transition-all duration-300",
        isSelected 
          ? "border-primary shadow-glow-lg" 
          : "border-transparent shadow-glass hover:shadow-glass-lg"
      )}
      onClick={() => onSelect(region)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={region.imageUrl}
          alt={region.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-5 h-48 flex flex-col justify-between">
        {/* Top - Country Info & Status Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{countryFlags[region.countryCode]}</span>
            <span className="text-white/90 font-medium text-sm">{region.country}</span>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-1.5">
            {/* Vegetation Health */}
            <div className="group/tooltip relative">
              <div className={cn(
                "w-2 h-2 rounded-full",
                getVegetationColor(vegetationScore)
              )} />
              <div className="absolute right-0 top-6 hidden group-hover/tooltip:block z-10 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap">
                Vegetation: {vegetationScore}%
              </div>
            </div>
            
            {/* Soil Quality */}
            <div className="group/tooltip relative">
              <div className={cn(
                "w-2 h-2 rounded-full",
                getSoilColor(soilQuality)
              )} />
              <div className="absolute right-0 top-6 hidden group-hover/tooltip:block z-10 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap">
                Soil: {typeof soilQuality === 'string' ? soilQuality : 'Medium'}
              </div>
            </div>
            
            {/* Risk Level */}
            <div className="group/tooltip relative">
              <div className={cn(
                "w-2 h-2 rounded-full",
                getRiskColor(region.risks)
              )} />
              <div className="absolute right-0 top-6 hidden group-hover/tooltip:block z-10 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap">
                Risk: {riskLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom - Region Details */}
        <div className="space-y-3">
          <div>
            <h3 className="text-white font-semibold text-lg leading-tight">{region.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-white/60" />
              <span className="text-white/60 text-xs">{region.continent}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <TreeDeciduous className="w-4 h-4" />
              <span>{region.plots} plots</span>
            </div>
            <div className="h-4 w-px bg-white/30" />
            <span>{region.initiatives} initiatives</span>
          </div>

          {/* Explore Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl",
              "bg-primary/90 text-primary-foreground font-medium text-sm",
              "transition-all duration-300 glow-button",
              "group-hover:bg-primary group-hover:shadow-glow"
            )}
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RegionCard;
