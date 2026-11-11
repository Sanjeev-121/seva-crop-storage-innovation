import { FiInfo } from "react-icons/fi";

function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <FiInfo aria-hidden="true" /> Frontend prototype: all storages, prices,
      schemes and applications shown here are SAMPLE data, not real.
    </div>
  );
}

export default DemoBanner;