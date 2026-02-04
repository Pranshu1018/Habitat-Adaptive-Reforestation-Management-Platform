import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign } from 'lucide-react';
import { globalAnalytics } from '@/data/mockData';

const SocialImpactCard = () => {
  const [displayedFarmers, setDisplayedFarmers] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = globalAnalytics.smallholderFarmers / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= globalAnalytics.smallholderFarmers) {
        setDisplayedFarmers(globalAnalytics.smallholderFarmers);
        clearInterval(timer);
      } else {
        setDisplayedFarmers(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    return `$${formatNumber(num)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-2xl p-5 flex-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chart-earth/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-chart-earth" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Social Impact</h3>
            <p className="text-xs text-muted-foreground">Community benefits</p>
          </div>
        </div>
      </div>

      {/* Main Metric - Farmers */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-foreground">
          {formatNumber(displayedFarmers)}
        </span>
        <span className="text-muted-foreground text-sm ml-2">farmers</span>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs text-muted-foreground">Income Increase</span>
          </div>
          <span className="text-lg font-semibold text-foreground">
            +{globalAnalytics.averageIncomeIncrease}%
          </span>
        </div>
        <div className="p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Timber Value</span>
          </div>
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(globalAnalytics.timberValue)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialImpactCard;
