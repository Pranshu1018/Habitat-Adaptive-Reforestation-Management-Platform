import CarbonSequestrationCard from './CarbonSequestrationCard';
import EcologicalCompositionCard from './EcologicalCompositionCard';
import SocialImpactCard from './SocialImpactCard';

const AnalyticsStrip = () => {
  return (
    <div className="flex gap-4 p-4">
      <CarbonSequestrationCard />
      <EcologicalCompositionCard />
      <SocialImpactCard />
    </div>
  );
};

export default AnalyticsStrip;
