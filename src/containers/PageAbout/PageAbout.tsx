import { FC } from "react";
import BackgroundSection from "../../components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "../../components/BgGlassmorphism/BgGlassmorphism";
import SectionClientSay from "../../components/SectionClientSay/SectionClientSay";
import SectionPromo3 from "../../components/SectionPromo3";
import rightImg from "../../images/hero-right1.png";
import SectionFounder from "./SectionFounder";
import SectionHero from "./SectionHero";
import SectionStatistic from "./SectionStatistic";

export interface PageAboutProps {
  className?: string;
}

const PageAbout: FC<PageAboutProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-PageAbout overflow-hidden relative ${className}`}
      data-nc-id="PageAbout"
    >

      <title>About || fashionFactory React Template</title>


      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />

      <div className="container py-16 lg:py-28 space-y-16 lg:space-y-28">
        <SectionHero
          rightImg={rightImg}
          heading="👋 Thông tin về cửa hàng."
          btnText=""
          subHeading="Chúng tôi công bằng và độc lập, mỗi ngày chúng tôi tạo ra các chương trình và nội dung đặc sắc, đẳng cấp thế giới."
        />

        <SectionFounder />
        <div className="relative py-16">
          <BackgroundSection />
          <SectionClientSay />
        </div>

        <SectionStatistic />

        <SectionPromo3 />
      </div>
    </div>
  );
};

export default PageAbout;
