import { motion } from 'framer-motion';
import { TreeDeciduous, MapPin, ArrowRight } from 'lucide-react';
import { Region, countryFlags } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface RegionCardProps {
  region: Region;
  isSelected: boolean;
  onSelect: (region: Region) => void;
}

const RegionCard = ({ region, isSelected, onSelect }: RegionCardProps) => {
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
        {/* Top - Country Info */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{countryFlags[region.countryCode]}</span>
          <span className="text-white/90 font-medium text-sm">{region.country}</span>
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
