import { FC } from "react";
import { Link } from "react-router";
import imgAds from "../../images/ads.png";
import NcImage from "../../shared/NcImage/NcImage";

export interface SectionAdsProps {
  className?: string;
}

const SectionAds: FC<SectionAdsProps> = ({ className = "" }) => {
  return (
    <Link to="#" className={`nc-SectionAds block w-full ${className}`}>
      <NcImage className="w-full" src={imgAds} />
    </Link>
  );
};

export default SectionAds;
