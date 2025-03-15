import { FC, useState } from "react";
import useBoolean from "react-use/lib/useBoolean";
import useInterval from "react-use/lib/useInterval";
import image1 from "../../images/b1.jpg";
import image2 from "../../images/b2.jpg";
import image3 from "../../images/b3.jpg";
import Next from "../../shared/NextPrev/Next";
import Prev from "../../shared/NextPrev/Prev";

export interface SectionHero2Props {
  className?: string;
}

const IMAGE_DATA = [image1, image2, image3];
let TIME_OUT: ReturnType<typeof setTimeout> | null = null;

const SectionHero2: FC<SectionHero2Props> = ({ className = "" }) => {
  const [indexActive, setIndexActive] = useState(0);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  useInterval(() => {
    handleAutoNext();
  }, isRunning ? 5500 : null);

  const handleAutoNext = () => {
    setIndexActive((state) => (state >= IMAGE_DATA.length - 1 ? 0 : state + 1));
  };

  const handleClickNext = () => {
    setIndexActive((state) => (state >= IMAGE_DATA.length - 1 ? 0 : state + 1));
    handleAfterClick();
  };

  const handleClickPrev = () => {
    setIndexActive((state) => (state === 0 ? IMAGE_DATA.length - 1 : state - 1));
    handleAfterClick();
  };

  const handleAfterClick = () => {
    toggleIsRunning(false);
    if (TIME_OUT) clearTimeout(TIME_OUT);
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true);
    }, 1000);
  };

  return (
    <div className={`relative w-full h-[75vh] overflow-hidden ${className}`}>
      {IMAGE_DATA.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === indexActive ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <Prev
        className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10"
        btnClassName="w-12 h-12 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full"
        svgSize="w-6 h-6"
        onClickPrev={handleClickPrev}
      />
      <Next
        className="absolute right-5 top-1/2 transform -translate-y-1/2 z-10"
        btnClassName="w-12 h-12 bg-white bg-opacity-50 hover:bg-opacity-70 rounded-full"
        svgSize="w-6 h-6"
        onClickNext={handleClickNext}
      />
    </div>
  );
};

export default SectionHero2;
