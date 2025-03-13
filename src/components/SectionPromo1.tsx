import { FC } from "react";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import ButtonSecondary from "../shared/Button/ButtonSecondary";
import Logo from "../shared/Logo/Logo";
import NcImage from "../shared/NcImage/NcImage";
import rightImgDemo from "./../images/rightLargeImg.png";
import rightLargeImgDark from "./../images/rightLargeImgDark.png";

export interface SectionPromo1Props {
  className?: string;
}

const SectionPromo1: FC<SectionPromo1Props> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionPromo1 relative flex flex-col lg:flex-row items-center ${className}`}
      data-nc-id="SectionPromo1"
    >
      <div className="relative flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5">
        <Logo className="w-28" />
        <h2 className="font-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl mt-6 sm:mt-10 !leading-[1.2] tracking-tight">
          Kiếm tiền miễn phí <br /> với Beautico
        </h2>
        <span className="block mt-6 text-slate-500 dark:text-slate-400 ">
          Với fashionFactory bạn sẽ được freeship & combo tiết kiệm...
        </span>
        <div className="flex space-x-2 sm:space-x-5 mt-6 sm:mt-12">
          <ButtonPrimary href="/cua-hang" className="">
            Combo tiết kiệm
          </ButtonPrimary>
          <ButtonSecondary
            href="/cua-hang"
            className="border border-slate-100 dark:border-slate-700"
          >
            Khám phá thêm
          </ButtonSecondary>
        </div>
      </div>
      <div className="relative flex-1 max-w-xl lg:max-w-none">
        <NcImage containerClassName="block dark:hidden" src={rightImgDemo} />
        <NcImage
          containerClassName="hidden dark:block"
          src={rightLargeImgDark}
        />
      </div>
    </div>
  );
};

export default SectionPromo1;
