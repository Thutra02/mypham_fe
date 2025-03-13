import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import BackgroundSection from "../../components/BackgroundSection/BackgroundSection";
import DiscoverMoreSlider from "../../components/DiscoverMoreSlider";
import Heading from "../../components/Heading/Heading";
import SectionClientSay from "../../components/SectionClientSay/SectionClientSay";
import SectionHero2 from "../../components/SectionHero/SectionHero2";
import SectionHowItWork from "../../components/SectionHowItWork/SectionHowItWork";
import SectionPromo1 from "../../components/SectionPromo1";
import SectionPromo2 from "../../components/SectionPromo2";
import SectionPromo3 from "../../components/SectionPromo3";
import SectionSliderCategories from "../../components/SectionSliderCategories/SectionSliderCategories";
import SectionSliderLargeProduct from "../../components/SectionSliderLargeProduct";
import SectionSliderProductCard from "../../components/SectionSliderProductCard";
import SectionSliderProductCard2 from "../../components/SectionSliderProductCard2";
import SectionMagazine5 from "../../containers/BlogPage/SectionMagazine5";
import { fetchBlogs, fetchNewBlog } from "../../features/blog/blogSlice";
import { fetchNewArrivalsProducts, fetchTopSellingProducts } from "../../features/product/productSlice";
import ButtonSecondary from "../../shared/Button/ButtonSecondary";
import { AppDispatch, RootState } from "../../store";

function PageHome() {
  const dispatch: AppDispatch = useDispatch();
  const { blogNew, loading, } = useSelector((state: RootState) => state.blogs);
  const { productTopSelling, productArrivals } = useSelector((state: RootState) => state.products);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchNewBlog());
    dispatch(fetchTopSellingProducts());
    dispatch(fetchNewArrivalsProducts());
    dispatch(fetchBlogs({ page: 1, size: 10, search: "" }));
  }, [dispatch]);
  return (
    <div className="nc-PageHome relative overflow-hidden">
      {/* SECTION HERO */}
      <SectionHero2 />

      <div className="mt-24 lg:mt-32">
        <DiscoverMoreSlider />
      </div>

      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        {/* SECTION */}
        <SectionSliderProductCard2
          data={productArrivals}
        />

        <div className="py-24 lg:py-32 border-t border-b border-slate-200 dark:border-slate-700">
          <SectionHowItWork />
        </div>

        {/* SECTION */}
        <SectionPromo1 />

        {/*  */}
        <SectionPromo2 />

        {/* SECTION 3 */}
        <SectionSliderLargeProduct cardStyle="style2" />

        {/*  */}
        <SectionSliderCategories />

        {/* SECTION */}
        <SectionPromo3 />

        <SectionSliderProductCard
          data={productTopSelling}
          heading="Best Sellers"
          subHeading="Best selling of the month"
        />

        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <div>
            <Heading rightDescText="Từ bài viết của Beautico">
              Bài viết mới nhất
            </Heading>
            <SectionMagazine5 blogLatest={blogNew} loading={loading} />
            <div className="flex mt-16 justify-center">
              <ButtonSecondary type="button" onClick={() => {
                navigate("/bai-viet");
              }}>
                Xem thêm bài viết
              </ButtonSecondary>
            </div>
          </div>
        </div>

        {/*  */}
        <SectionClientSay />
      </div>
    </div>
  );
}

export default PageHome;
