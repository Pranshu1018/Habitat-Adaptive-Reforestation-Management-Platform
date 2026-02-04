import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import RegionCard from './RegionCard';
import { regions, Region } from '@/data/mockData';

interface RegionSidebarProps {
  selectedRegion: Region | null;
  onSelectRegion: (region: Region) => void;
}

const RegionSidebar = ({ selectedRegion, onSelectRegion }: RegionSidebarProps) => {
  const groupedRegions = useMemo(() => {
    const groups: Record<string, Region[]> = {};
    regions.forEach((region) => {
      if (!groups[region.continent]) {
        groups[region.continent] = [];
      }
      groups[region.continent].push(region);
    });
    return groups;
  }, []);

  const continentOrder = ['Africa', 'Asia', 'South America'];

  return (
    <div className="w-80 h-full glass-card border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <h2 className="font-semibold text-foreground">Restoration Regions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {regions.length} active projects worldwide
        </p>
      </div>

      {/* Region List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {continentOrder.map((continent, index) => (
            <motion.div
              key={continent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                {continent}
              </h3>
              <div className="space-y-3">
                {groupedRegions[continent]?.map((region) => (
                  <RegionCard
                    key={region.id}
                    region={region}
                    isSelected={selectedRegion?.id === region.id}
                    onSelect={onSelectRegion}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RegionSidebar;
