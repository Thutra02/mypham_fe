import { StarIcon } from "@heroicons/react/24/solid";
import { FC } from "react";
import Avatar from "../shared/Avatar/Avatar";
import { Review } from "../types";



export interface ReviewItemProps {
  className?: string;
  data?: Review;
}



const ReviewItem: FC<ReviewItemProps> = ({
  className = "",
  data
}) => {
  return (
    <div
      className={`nc-ReviewItem flex flex-col ${className}`}
      data-nc-id="ReviewItem"
    >
      <div className=" flex space-x-4 ">
        <div className="flex-shrink-0 pt-0.5">
          <Avatar
            sizeClass="h-10 w-10 text-lg"
            radius="rounded-full"
            userName={data?.user?.username}
            imgUrl={data?.user?.avatar}
          />
        </div>

        <div className="flex-1 flex justify-between">
          <div className="text-sm sm:text-base">
            <span className="block font-semibold">{data?.user?.username}</span>
            <span className="block mt-0.5 text-slate-500 dark:text-slate-400 text-sm">
              {data?.createdDate}
            </span>
          </div>

          {
            data?.star && (
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 text-yellow-400">{data?.star}</span>
              </div>
            )
          }
        </div>
      </div>
      <div className="mt-4 prose prose-sm sm:prose dark:prose-invert sm:max-w-2xl">
        <p className="text-slate-600 dark:text-slate-300">{data?.review}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
