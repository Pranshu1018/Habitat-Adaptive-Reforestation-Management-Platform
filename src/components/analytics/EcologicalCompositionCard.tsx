import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Trees } from 'lucide-react';
import { globalAnalytics } from '@/data/mockData';

const EcologicalCompositionCard = () => {
  const COLORS = ['hsl(150, 52%, 33%)', 'hsl(210, 60%, 50%)', 'hsl(25, 40%, 45%)'];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-2xl p-5 flex-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chart-blue/10 flex items-center justify-center">
            <Trees className="w-5 h-5 text-chart-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Ecological Composition</h3>
            <p className="text-xs text-muted-foreground">Forest type breakdown</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut Chart */}
        <div className="w-28 h-28 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={globalAnalytics.ecologicalComposition}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={45}
                paddingAngle={2}
                dataKey="value"
              >
                {globalAnalytics.ecologicalComposition.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-muted-foreground">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {globalAnalytics.ecologicalComposition.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <span className="text-xs font-medium text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="text-sm text-muted-foreground">
          Total Reforested:{' '}
          <span className="font-semibold text-foreground">
            {formatNumber(globalAnalytics.totalHectares)} ha
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EcologicalCompositionCard;
