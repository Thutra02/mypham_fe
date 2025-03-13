import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BgGlassmorphism from "../../components/BgGlassmorphism/BgGlassmorphism";
import SectionPromo3 from "../../components/SectionPromo3";
import { fetchBlogs, fetchNewBlog } from "../../features/blog/blogSlice";
import { AppDispatch, RootState } from "../../store";
import SectionAds from "./SectionAds";
import SectionLatestPosts from "./SectionLatestPosts";
import SectionMagazine5 from "./SectionMagazine5";

// DEMO DATA

const BlogPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { blogNew, blogs, loading, pagination, error } = useSelector((state: RootState) => state.blogs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNewBlog());
    dispatch(fetchBlogs({ page: currentPage, size: 10, search: "" }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  }

  return (
    <div className="nc-BlogPage overflow-hidden relative">

      <title>Blog || fashionFactory React Template</title>


      {/* ======== BG GLASS ======== */}
      <BgGlassmorphism />
      {/* ======== ALL SECTIONS ======== */}
      <div className="container relative">
        {/* === SECTION 1 === */}
        <div className="pt-12 pb-16 lg:pb-28">
          <SectionMagazine5 blogLatest={blogNew} loading={loading} error={error}  />
        </div>

        {/* === SECTION 1 === */}
        <SectionAds />

        {/* === SECTION 8 === */}
        {pagination && <SectionLatestPosts className="py-16 lg:py-28" allBlog={blogs} pag={pagination} onPageChange={handlePageChange}/>}

        {/* === SECTION 1 === */}
        <SectionPromo3 className="pb-16 lg:pb-28" />
      </div>
    </div>
  );
};

export default BlogPage;
