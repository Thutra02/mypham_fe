import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import SectionPromo1 from "../components/SectionPromo1";
import { filterProducts, setFilters } from "../features/product/productSlice";
import Pagination from "../shared/Pagination/Pagination";
import { AppDispatch, RootState } from "../store";
import SidebarFilters from "./SidebarFilters";

export interface PageCollection2Props {
  className?: string;
}

const PageCollection2: FC<PageCollection2Props> = ({ className = "" }) => {
  const { products, error, pagination, filters } = useSelector((state: RootState) => state.products);
  const dispatch: AppDispatch = useDispatch()


  useEffect(() => {
    dispatch(filterProducts(filters));
  }, [filters, dispatch]);

  const onPageChange = (page: number) => {
    dispatch(setFilters({ ...filters, page }));
  };
  return (
    <div className={`nc-PageCollection2 ${className}`} data-nc-id="PageCollection2">
      <title>Category || fashionFactory Ecommerce Template</title>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          <main>
            {/* LOOP ITEMS */}
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar with sticky positioning */}
              <aside className="lg:w-1/3 xl:w-1/4 pr-4">
                <div className="sticky top-4" style={{ height: "fit-content" }}>
                  <SidebarFilters />
                </div>
              </aside>

              <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mx-4 border-t lg:border-t-0"></div>

              <div className="flex-1">
                {error ? (
                  <div className="flex items-center justify-center min-h-[300px]">
                    <span className="text-red-500">{error}</span>
                  </div>
                ) : products?.length > 0 ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
                    {products.map((product, index) => (
                      <ProductCard key={index} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[300px]">No products available</div>
                )}

                <div className="flex justify-center items-center mt-10">
                  {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* === SECTION 5 === */}
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* SUBCRIBES */}
        <SectionPromo1 />
      </div>
    </div>
  );
};

export default PageCollection2;
