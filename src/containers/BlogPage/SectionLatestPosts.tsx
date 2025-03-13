import { FC } from "react";
import Heading from "../../components/Heading/Heading";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Pagination from "../../shared/Pagination/Pagination";
import { Blog } from "../../types";
import { Pagination as PG } from "../../types/pagination.types";
import Card3 from "./Card3";
import WidgetCategories from "./WidgetCategories";
//
export interface SectionLatestPostsProps {
  className?: string;
  postCardName?: "card3";
  allBlog?: Blog[];
  pag: PG;
  onPageChange: (page: number) => void;
}

const SectionLatestPosts: FC<SectionLatestPostsProps> = ({
  className = "",
  allBlog,
  pag,
  onPageChange,
}) => {

  return (
    <div className={`nc-SectionLatestPosts relative ${className}`}>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/5 xl:w-2/3 xl:pr-14">
          <Heading>Latest Articles 🎈</Heading>
          <div className={`grid gap-6 md:gap-8 grid-cols-1`}>
            {
              allBlog?.map((blog: Blog, index) => (
                <Card3 key={blog.id || index} blog={blog} />
              ))
            }
          </div>
          <div className="flex flex-col mt-12 md:mt-20 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <Pagination onPageChange={onPageChange}
              pagination={pag}
            />
            <ButtonPrimary>Show me more</ButtonPrimary>
          </div>
        </div>
        <div className="w-full space-y-7 mt-24 lg:mt-0 lg:w-2/5 lg:pl-10 xl:pl-0 xl:w-1/3 ">
          <WidgetCategories />
        </div>
      </div>
    </div>
  );
};

export default SectionLatestPosts;
