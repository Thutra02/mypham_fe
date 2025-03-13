"use client"
import { Transition } from "@headlessui/react";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { addCartItem } from "../features/cart/cartSlice";
import ButtonPrimary from "../shared/Button/ButtonPrimary";
import ButtonSecondary from "../shared/Button/ButtonSecondary";
import NcImage from "../shared/NcImage/NcImage";
import { AppDispatch } from "../store";
import { Product } from "../types";
import BagIcon from "./BagIcon";
import ModalQuickView from "./ModalQuickView";
import Prices from "./Prices";
import ProductStatus from "./ProductStatus";

export interface ProductCardProps {
  className?: string;
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({
  className = "",
  product
}) => {
  const image = product?.productImages?.length > 0 ? product?.productImages[0]?.image : "";
  const [showModalQuickView, setShowModalQuickView] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();
  const notifyAddTocart = async (product: Product) => {
    try {

      await dispatch(addCartItem(
        {
          productId: product.id,
          quantity: 1
        }
      )).unwrap();

      toast.custom(
        (t) => (
          <Transition
            appear
            show={t.visible}
            className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
            enter="transition-all duration-150"
            enterFrom="opacity-0 translate-x-20"
            enterTo="opacity-100 translate-x-0"
            leave="transition-all duration-150"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-20"
          >
            <p className="block text-base font-semibold leading-none">
              Thêm giỏ hàng thành công
            </p>
            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
            {renderProductCartOnNotify()}
          </Transition>
        ),
        { position: "top-right", id: "nc-product-notify", duration: 3000 }
      );
    } catch (error) {
      console.log(error);
      toast.error("Thêm giỏ hàng thất bại");
    }
  };

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image || "/default-image.jpg"}
            alt={product?.name || "Product Image"}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{product?.name || "Product Name"}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    {product?.brand?.name || "Brand"} - {product?.category?.name || "Category"}
                  </span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                </p>
              </div>
              <Prices price={product?.salePrice ?? product?.price} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">Qty 1</p>

            <div className="flex">
              <Link
                to={"/cart"}
                className="font-medium text-primary-6000 dark:text-primary-500 "
              >
                View cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGroupButtons = (product: Product) => {
    return (
      <div className="absolute bottom-0 group-hover:bottom-4 inset-x-1 flex justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <ButtonPrimary
          className="shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => notifyAddTocart(product)}
        >
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ml-1">Add to bag</span>
        </ButtonPrimary>
        <ButtonSecondary
          className="ml-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => setShowModalQuickView(true)}
        >
          <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
          <span className="ml-1">Quick view</span>
        </ButtonSecondary>
      </div>
    );
  };

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}
        data-nc-id="ProductCard"
      >
        <Link to={`/cua-hang/${product?.id}`} className="absolute inset-0"></Link>
        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
          <Link to={`/cua-hang/${product?.id}`} className="block">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              src={image || "/default-image.jpg"}
              className="object-cover w-full h-full drop-shadow-xl"
            />
          </Link>
          <ProductStatus status={
            product?.sale ? "sale" : product?.stock > 0 ? "stock" : "out of stock"
          } />

          {renderGroupButtons(product)}
        </div>
        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
          <div className="flex flex-col">
            <h2 className="nc-ProductCard__title text-base font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-full">
              {product?.name || "Product Name"}
            </h2>
          </div>
          <div className="flex justify-between items-end">
            <Prices price={product?.salePrice || product?.price} />
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 text-amber-400" />
              <span className="text-sm ml-1 text-slate-500">
                {product?.reviews?.reduce((acc, review) => acc + review.star, 0) /
                  (product?.reviews?.length || 1)} ({product?.reviews?.length ?? 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>
      <ModalQuickView
        show={showModalQuickView}
        product={product}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
