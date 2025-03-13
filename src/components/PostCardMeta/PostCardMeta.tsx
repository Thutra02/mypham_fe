import { FC } from "react";
import { Link } from "react-router";
import { _getPersonNameRd } from "../../contains/fakeData";
import Avatar from "../../shared/Avatar/Avatar";
import { Blog } from "../../types";

export interface PostCardMetaProps {
  className?: string;

  blog?: Blog;
}

const PostCardMeta: FC<PostCardMetaProps> = ({
  className = "leading-none",

  blog
}) => {
  return (
    <div
      className={`nc-PostCardMeta inline-flex items-center fledx-wrap text-neutral-800 dark:text-neutral-200 text-sm ${className}`}
      data-nc-id="PostCardMeta"
    >
      <Link
        to={"#"}
        className="flex-shrink-0 relative flex items-center space-x-2"
      >

        <Avatar radius="rounded-full" sizeClass={"h-7 w-7 text-sm"} imgUrl={blog?.author?.avatar} />

        <span className="block text-neutral-6000 hover:text-black dark:text-neutral-300 dark:hover:text-white font-medium">
          {
            blog?.author?.username || _getPersonNameRd()
          }
        </span>
      </Link>
      <>
        <span className="text-neutral-500 dark:text-neutral-400 mx-[6px] font-medium">
          ·
        </span>
        <span className="text-neutral-500 dark:text-neutral-400 font-normal line-clamp-1">
          {blog?.createdDate || "2021-09-01"}
        </span>
      </>
    </div>
  );
};

export default PostCardMeta;
