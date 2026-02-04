import CarbonSequestrationCard from './CarbonSequestrationCard';
import EcologicalCompositionCard from './EcologicalCompositionCard';
import SocialImpactCard from './SocialImpactCard';

interface GlobalAnalytics {
  totalCarbonSequestered: number;
  totalHectares: number;
  totalPlots: number;
  smallholderFarmers: number;
  carbonGrowthPercent: number;
  averageIncomeIncrease: number;
  timberValue: number;
  carbonTimelineData: Array<{ year: string; carbon: number }>;
  ecologicalComposition: Array<{ name: string; value: number }>;
}

interface AnalyticsStripProps {
  analytics: GlobalAnalytics;
}

const AnalyticsStrip = ({ analytics }: AnalyticsStripProps) => {
  return (
    <div className="flex gap-4 p-4">
      <CarbonSequestrationCard analytics={analytics} />
      <EcologicalCompositionCard analytics={analytics} />
      <SocialImpactCard analytics={analytics} />
    </div>
  );
};

export default AnalyticsStrip;
