import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchBlogById } from "../../features/blog/blogSlice";
import Avatar from "../../shared/Avatar/Avatar";
import Badge from "../../shared/Badge/Badge";
import NcImage from "../../shared/NcImage/NcImage";
import SocialsList from "../../shared/SocialsList/SocialsList";
import Tag from "../../shared/Tag/Tag";
import { AppDispatch, RootState } from "../../store";

const BlogSingle = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { blog, loading, error } = useSelector((state: RootState) => state.blogs);
 
  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(Number(id)));
    }

  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return <div>error</div>;
  }
  if (!blog) {
    return <div>not found</div>;
  }

  const renderHeader = () => {
    return (
      <header className="container rounded-xl">
        <div className="max-w-screen-md mx-auto space-y-5">
          <Badge href="##" color="purple" name={
            <span className="text-xs">{blog?.category?.name}</span>
          } />
          <h1
            className=" text-neutral-900 font-semibold text-3xl md:text-4xl md:!leading-[120%] lg:text-4xl dark:text-neutral-100 max-w-4xl "
            title="Quiet ingenuity: 120,000 lunches and counting"
          >
            {blog?.title}
          </h1>


          <div className="w-full border-b border-neutral-100 dark:border-neutral-800"></div>
          <div className="flex flex-col items-center sm:flex-row sm:justify-between">
            <div className="nc-PostMeta2 flex items-center flex-wrap text-neutral-700 text-left dark:text-neutral-200 text-sm leading-none flex-shrink-0">
              <Avatar
                containerClassName="flex-shrink-0"
                sizeClass="w-8 h-8 sm:h-11 sm:w-11 "
                imgUrl={blog?.author?.avatar}
              />
              <div className="ml-3">
                <div className="flex items-center">
                  <a className="block font-semibold" href="##">
                    {blog?.author?.username}
                  </a>
                </div>
                <div className="text-xs mt-[6px]">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {blog?.createdDate}
                  </span>
                  <span className="mx-2 font-semibold">·</span>

                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-1.5 sm:ml-3">
              <SocialsList />
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderContent = () => {
    return (
      <div
        id="single-entry-content"
        className="prose prose-sm !max-w-screen-md sm:prose lg:prose-lg mx-auto dark:prose-invert"

        dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
      >

      </div>
    );
  };

  const renderTags = () => {
    return (
      <div className="max-w-screen-md mx-auto flex flex-wrap space-x-2">
        {blog?.tags?.map((tag, index) => (
          <Tag key={index} tag={tag} />
        ))}
      </div>
    );
  };



  return (
    <div className="nc-PageSingle pt-8 lg:pt-16 ">
      <title>Single Blog || fashionFactory Ecommerce React Template</title>
      {renderHeader()}
      <NcImage
        className="w-full rounded-xl"
        containerClassName="container my-10 sm:my-12 "
        src={
          blog?.image
        }
      />

      <div className="nc-SingleContent container space-y-10">
        {renderContent()}
        {renderTags()}
        <div className="max-w-screen-md mx-auto border-b border-t border-neutral-100 dark:border-neutral-700"></div>


      </div>

    </div>
  );
};

export default BlogSingle;
