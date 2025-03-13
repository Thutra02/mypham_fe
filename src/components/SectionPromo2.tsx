import { FC } from "react";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import Logo from "../shared/Logo/Logo";
import NcImage from "../shared/NcImage/NcImage";
import backgroundLineSvg from "./../images/Moon.svg";
import rightImgDemo from "./../images/promo2.png";

export interface SectionPromo2Props {
  className?: string;
}

const SectionPromo2: FC<SectionPromo2Props> = ({ className = "lg:pt-10" }) => {
  return (
    <div className={`nc-SectionPromo2 ${className}`}>
      <div className="relative flex flex-col lg:flex-row lg:justify-end bg-yellow-50 dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-4 pb-0 sm:p-5 sm:pb-0 lg:p-24">
        <div className="absolute inset-0">
          <img
            className="absolute w-full h-full object-contain dark:opacity-5"
            src={backgroundLineSvg}
            alt="backgroundLineSvg"
          />
        </div>

        <div className="lg:w-[45%] max-w-lg relative">
          <Logo className="w-28" />
          <h2 className="font-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl mt-6 sm:mt-10 !leading-[1.13] tracking-tight">
            Ưu đãi đặc biệt <br />
            cho sản phẩm
          </h2>
          <span className="block mt-6 text-slate-500 dark:text-slate-400">
            Thời trang là một hình thức tự thể hiện và tự chủ tại một thời điểm và địa điểm cụ thể.
          </span>
          <div className="flex space-x-2 sm:space-x-5 mt-6 sm:mt-12">
            <ButtonPrimary
              href="/page-search"
              className="dark:bg-slate-200 dark:text-slate-900"
            >
              Khám phá thêm
            </ButtonPrimary>
          </div>
        </div>

        <NcImage
          containerClassName="relative block lg:absolute lg:left-0 lg:bottom-0 mt-10 lg:mt-0 max-w-xl lg:max-w-[calc(55%-40px)]"
          src={rightImgDemo}
        />
      </div>
    </div>
  );
};

export default SectionPromo2;
