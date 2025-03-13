import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardCategory1 from "../../components/CardCategories/CardCategory1";
import { fetchBlogCategoryCount } from "../../features/blogCategory/blogCategorySlice";
import { AppDispatch, RootState } from "../../store";
import { BlogCategoryCount } from "../../types";
import WidgetHeading1 from "./WidgetHeading1";

export interface WidgetCategoriesProps {
  className?: string;
}

const WidgetCategories: FC<WidgetCategoriesProps> = ({
  className = "bg-neutral-100 dark:bg-neutral-800",
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { categoryCount } = useSelector((state: RootState) => state.blogCategories);

  useEffect(() => {
    dispatch(fetchBlogCategoryCount());
  }, [dispatch]);

  return (
    <div
      className={`nc-WidgetCategories rounded-3xl  overflow-hidden ${className}`}
      data-nc-id="WidgetCategories"
    >
      <WidgetHeading1
        title="✨ Trending topic"
        viewAll={{ label: "", href: "#" }}
      />
      <div className="flow-root">
        <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
          {categoryCount && categoryCount.slice(0,6).map((category: BlogCategoryCount, index: number) => (
            <CardCategory1
              blogCategory={category}
              className="p-4 xl:p-5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetCategories;
