import { motion } from 'framer-motion';
import { TrendingUp, Leaf } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface GlobalAnalytics {
  totalCarbonSequestered: number;
  carbonGrowthPercent: number;
  carbonTimelineData: Array<{ year: string; carbon: number }>;
}

interface CarbonSequestrationCardProps {
  analytics: GlobalAnalytics;
}

const CarbonSequestrationCard = ({ analytics }: CarbonSequestrationCardProps) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl p-5 flex-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Carbon Sequestration</h3>
            <p className="text-xs text-muted-foreground">Total CO₂ captured</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-success/10 text-success text-sm font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>+{analytics.carbonGrowthPercent}%</span>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-foreground">
          {formatNumber(analytics.totalCarbonSequestered)}
        </span>
        <span className="text-muted-foreground text-sm ml-2">t CO₂</span>
      </div>

      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analytics.carbonTimelineData}>
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [`${formatNumber(value)} t`, 'CO₂']}
            />
            <Line
              type="monotone"
              dataKey="carbon"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CarbonSequestrationCard;
