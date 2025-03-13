import { FC } from "react";
import { Link } from "react-router";
import { Tag as Tg } from "../../types/tag.types";

export interface TagProps {
  className?: string;
  hideCount?: boolean;
  tag?: Tg;
}

const Tag: FC<TagProps> = ({ className = "",   tag }) => {
  return (
    <Link
      className={`nc-Tag inline-block bg-white text-sm text-neutral-600 dark:text-slate-400 py-2 px-3 rounded-lg border border-neutral-100 md:py-2.5 md:px-4 dark:bg-neutral-700 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-6000 ${className}`}
      data-nc-id="Tag"
      to={"#"}
    >
      {`${tag?.name}`}
     </Link>
  );
};

export default Tag;
