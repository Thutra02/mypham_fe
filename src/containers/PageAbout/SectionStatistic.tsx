import { FC } from "react";
import Heading from "../../components/Heading/Heading";

export interface Statistic {
  id: string;
  heading: string;
  subHeading: string;
}

const FOUNDER_DEMO: Statistic[] = [
  {
    id: "1",
    heading: "10 triệu",
    subHeading:
      "Bài viết đã được công khai trên toàn thế giới (tính đến ngày 30 tháng 9 năm 2025)",
  },
  {
    id: "2",
    heading: "100,000",
    subHeading: "Tài khoản người dùng đã đăng ký (tính đến ngày 30 tháng 9 năm 2025)",
  },
  {
    id: "3",
    heading: "220+",
    subHeading:
      "Quốc gia và khu vực có sự hiện diện của chúng tôi (tính đến ngày 30 tháng 9 năm 2025)",
  },
];

export interface SectionStatisticProps {
  className?: string;
}

const SectionStatistic: FC<SectionStatisticProps> = ({ className = "" }) => {
  return (
    <div className={`nc-SectionStatistic relative ${className}`}>
      <Heading
        desc=" Chúng tôi công bằng và độc lập, mỗi ngày chúng tôi tạo ra các chương trình và nội dung đặc sắc, đẳng cấp thế giới."
      >
        🚀 Thông tin nhanh
      </Heading>
      <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3 xl:gap-8">
        {FOUNDER_DEMO.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl dark:border-neutral-800"
          >
            <h3 className="text-2xl font-semibold leading-none text-neutral-900 md:text-3xl dark:text-neutral-200">
              {item.heading}
            </h3>
            <span className="block text-sm text-neutral-500 mt-3 sm:text-base dark:text-neutral-400">
              {item.subHeading}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionStatistic;
