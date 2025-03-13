import { FC } from "react";
import { Link } from "react-router";
import PostCardMeta from "../../components/PostCardMeta/PostCardMeta";
import { _getTitleRd, imgHigtQualitys } from "../../contains/fakeData";
import NcImage from "../../shared/NcImage/NcImage";
import SocialsShare from "../../shared/SocialsShare/SocialsShare";
import { Blog } from "../../types";

export interface Card12Props {
  className?: string;
  blog: Blog;
}

const Card12: FC<Card12Props> = ({ className = "h-full", blog }) => {
  return (
    <div
      className={`nc-Card12 group relative flex flex-col ${className}`}
      data-nc-id="Card12"
    >
      <Link
        to={`/bai-viet/${blog?.id}`}
        className="block flex-shrink-0 flex-grow relative w-full h-0 aspect-w-4 aspect-h-3 rounded-3xl overflow-hidden"
      >
        <NcImage
          src={
            blog?.image || imgHigtQualitys[0]
          }
          containerClassName="absolute inset-0"
          alt={"title"}
        />
      </Link>

      <SocialsShare className="absolute hidden md:grid gap-[5px] right-4 top-4 opacity-0 z-[-1] group-hover:z-10 group-hover:opacity-100 transition-all duration-300" />

      <div className=" mt-8 pr-10 flex flex-col">
        <h2
          className={`nc-card-title block font-semibold text-neutral-900 dark:text-neutral-100 transition-colors text-lg sm:text-2xl`}
        >
          <Link
            to={`/bai-viet/${blog?.id}`}
            className="line-clamp-2 capitalize"
            title={"title"}
          >
            {
              blog?.title || _getTitleRd()
            }
          </Link>
        </h2>
        <span className="hidden sm:block mt-4 text-neutral-500 dark:text-neutral-400">
          <span className="line-clamp-2" dangerouslySetInnerHTML={{ __html: `${blog?.content.substring(0, 200)}` }}>

          </span>
        </span>
        <PostCardMeta className="mt-5" blog={blog} />
      </div>
    </div>
  );
};

export default Card12;
