import { FC } from "react";
import { Blog } from "../../types";
import Card12 from "./Card12";
import Card13 from "./Card13";


export interface SectionMagazine5Props {
  className?: string;
  blogLatest?: Blog[];
  loading ?: boolean;
  error ?: string | null;
}

const SectionMagazine5: FC<SectionMagazine5Props> = ({ className = "", blogLatest, }) => {


  // Xử lý các trạng thái hiển thị
  const renderContent = () => {
    // Trường hợp loading
    if (!blogLatest) {
      return (
        <div className="text-center py-8">
          <span>Loading...</span>
        </div>
      );
    }

    // Trường hợp có lỗi
    if (blogLatest === null) {
      return (
        <div className="text-center py-8">
          <span>Error: {blogLatest}</span>
        </div>
      );
    }

    // Trường hợp không có dữ liệu
    if (!blogLatest || blogLatest.length === 0) {
      return (
        <div className="text-center py-8">
          <span>No blogs available</span>
        </div>
      );
    }

    // Trường hợp có dữ liệu
    return (
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Hiển thị Card12 chỉ khi có phần tử đầu tiên */}
        {blogLatest[0] ? (
          <Card12 blog={blogLatest[0]} />
        ) : (
          <div>No featured blog available</div>
        )}

        <div className="grid gap-6 md:gap-8">
          {blogLatest
            .slice(1)
            .map((item: Blog, index: number) => (
              <Card13 key={item.id || index} blog={item} />
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-SectionMagazine5 ${className}`}>
      {renderContent()}
    </div>
  );
};

export default SectionMagazine5;