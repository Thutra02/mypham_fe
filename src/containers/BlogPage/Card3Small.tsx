import { FC } from "react";
import { Link } from "react-router";
import PostCardMeta from "../../components/PostCardMeta/PostCardMeta";
import { _getTitleRd } from "../../contains/fakeData";

export interface Card3SmallProps {
  className?: string;
}

const Card3Small: FC<Card3SmallProps> = ({ className = "h-full" }) => {
  return (
    <div
      className={`nc-Card3Small relative flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center ${className}`}
      data-nc-id="Card3Small"
    >
      <Link
        to={"/blog-single"}
        className=" absolute inset-0"
        title={"title"}
      ></Link>
      <div className="relative space-y-2">
        <PostCardMeta />
        <h2 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
          <Link
            to={"/blog-single"}
            className=" line-clamp-2 capitalize"
            title={"title"}
          >
            {_getTitleRd()}
          </Link>
        </h2>
      </div>
 
    </div>
  );
};

export default Card3Small;
