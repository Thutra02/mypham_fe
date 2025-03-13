"use client";

import { Switch } from "@headlessui/react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import { fetchBrands } from "../../../features/brand/brandSlice";
import { fetchCategories } from "../../../features/category/categorySlice";
import {
  addProduct,
  fetchProductById,
  updateProduct,
} from "../../../features/product/productSlice";
import { AppDispatch, RootState } from "../../../store";
import { ProductRequest } from "../../../types";
import { uploadImages } from "../../../utils/uploadImage";

interface FormInputs {
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  ingredients: string;
  productUsage: string;
  brandId: number;
  categoryId: number;
  active: boolean;
  isSale: boolean;
  discountPercentage: number | null;
}

const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number
) => {
  return price - (price * discountPercentage) / 100;
};

const calculateDiscountPercentage = (price: number, salePrice: number) => {
  return Math.round(((price - salePrice) / price) * 100);
};

const AddProduct: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { brands } = useSelector((state: RootState) => state.brands);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { id } = useParams<{ id: string }>();
  const { product } = useSelector((state: RootState) => state.products);
  const dispatch: AppDispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      active: true,
      isSale: false,
      salePrice: null,
      discountPercentage: null,
    },
  });
  const navigate = useNavigate();
  const isSale = watch("isSale");
  const watchPrice = watch("price");
  const watchDiscountPercentage = watch("discountPercentage");

  const discountedPrice =
    watchPrice && watchDiscountPercentage
      ? calculateDiscountedPrice(watchPrice, watchDiscountPercentage)
      : watch("salePrice");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImagePreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newImagePreviewUrls]);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    dispatch(
      fetchBrands({
        page: 1,
        search: "",
        size: 100,
      })
    );
    dispatch(
      fetchCategories({
        page: 1,
        search: "",
        size: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id))).then((action) => {
        if (fetchProductById.fulfilled.match(action)) {
          const product = action.payload;
          const isSale =
            product.salePrice !== null && product.salePrice < product.price;

          reset({
            name: product.name,
            description: product.description,
            price: product.price,
            salePrice: product.salePrice,
            stock: product.stock,
            ingredients: product.ingredients,
            productUsage: product.productUsage,
            brandId: product.brand.id,
            categoryId: product.category.id,
            active: product.active,
            isSale: isSale,
            discountPercentage: isSale
              ? calculateDiscountPercentage(
                  product.price,
                  product.salePrice ?? 0
                )
              : null,
          });
          setImagePreviewUrls(
            product.productImages.map((image) => image.image)
          );
        }
      });
    }
  }, [id, dispatch, reset]);

  useEffect(() => {
    if (isSale && watchPrice && watchDiscountPercentage) {
      const newSalePrice = calculateDiscountedPrice(
        watchPrice,
        watchDiscountPercentage
      );
      setValue("salePrice", newSalePrice);
    } else if (!isSale) {
      setValue("salePrice", null);
      setValue("discountPercentage", null);
    }
  }, [isSale, watchPrice, watchDiscountPercentage, setValue]);

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    try {
      let listImage = imagePreviewUrls || [];

      if (selectedImages.length > 0) {
        const newImages = new FormData();
        selectedImages.forEach((image) => newImages.append("files", image));
        listImage = await uploadImages(newImages);
      }

      if (listImage.length === 0) {
        toast.error("Vui lòng chọn ít nhất một ảnh sản phẩm");
        setIsSubmitting(false);
        return;
      }

      const newProduct: ProductRequest = {
        id: product?.id || null,
        ...data,
        salePrice: data.isSale ? data.salePrice : null,
        sale: data.isSale,
        images: listImage,
      };
      console.log(newProduct);

      if (product) {
        await dispatch(
          updateProduct({ ...newProduct, id: product.id })
        ).unwrap();
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await dispatch(addProduct(newProduct)).unwrap();
        toast.success("Thêm sản phẩm thành công");
      }

      navigate("/admin/products");
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" p-6  mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h1>
          <NavLink
            to="/admin/products"
            className="text-indigo-600 hover:text-indigo-900 flex items-center"
          >
            <span className="mr-2">Back to Product List</span>
          </NavLink>
        </div>
        <p className="  text-sm text-gray-600">
          Điền thông tin chi tiết để {product ? "chỉnh sửa" : "tạo"} sản phẩm
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg">
          {/* Basic Information */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", {
                    required: "Vui lòng nhập tên sản phẩm",
                    minLength: {
                      value: 3,
                      message: "Tên sản phẩm phải có ít nhất 3 ký tự",
                    },
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.name ? "border-red-300" : ""
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số lượng trong kho
                </label>
                <input
                  type="number"
                  id="stock"
                  min="0"
                  {...register("stock", {
                    required: "Vui lòng nhập số lượng",
                    min: { value: 0, message: "Số lượng không thể âm" },
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.stock ? "border-red-300" : ""
                  }`}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giá bán
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">₫</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    {...register("price", {
                      required: "Vui lòng nhập giá bán",
                      min: { value: 0, message: "Giá không thể âm" },
                    })}
                    className={`block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.price ? "border-red-300" : ""
                    }`}
                    placeholder="0"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">VND</span>
                  </div>
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="active"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Trạng thái hoạt động
                  </label>
                  <Controller
                    name="active"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        checked={value}
                        onChange={onChange}
                        className={`${
                          value ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">Kích hoạt sản phẩm</span>
                        <span
                          className={`${
                            value ? "translate-x-5" : "translate-x-0"
                          } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        >
                          <span
                            className={`${
                              value
                                ? "opacity-0 duration-100 ease-out"
                                : "opacity-100 duration-200 ease-in"
                            } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                            aria-hidden="true"
                          >
                            <svg
                              className="h-3 w-3 text-gray-400"
                              fill="none"
                              viewBox="0 0 12 12"
                            >
                              <path
                                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            className={`${
                              value
                                ? "opacity-100 duration-200 ease-in"
                                : "opacity-0 duration-100 ease-out"
                            } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                            aria-hidden="true"
                          >
                            <svg
                              className="h-3 w-3 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 12 12"
                            >
                              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                            </svg>
                          </span>
                        </span>
                      </Switch>
                    )}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {watch("active") ? "Đang hoạt động" : "Không hoạt động"}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="isSale"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Đang giảm giá
                  </label>
                  <Controller
                    name="isSale"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        checked={value}
                        onChange={onChange}
                        className={`${
                          value ? "bg-blue-600" : "bg-gray-200"
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">Bật giảm giá</span>
                        <span
                          className={`${
                            value ? "translate-x-5" : "translate-x-0"
                          } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        >
                          <span
                            className={`${
                              value
                                ? "opacity-0 duration-100 ease-out"
                                : "opacity-100 duration-200 ease-in"
                            } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                            aria-hidden="true"
                          >
                            <svg
                              className="h-3 w-3 text-gray-400"
                              fill="none"
                              viewBox="0 0 12 12"
                            >
                              <path
                                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                          <span
                            className={`${
                              value
                                ? "opacity-100 duration-200 ease-in"
                                : "opacity-0 duration-100 ease-out"
                            } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                            aria-hidden="true"
                          >
                            <svg
                              className="h-3 w-3 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 12 12"
                            >
                              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                            </svg>
                          </span>
                        </span>
                      </Switch>
                    )}
                  />
                </div>

                {isSale && (
                  <>
                    <div className="mt-2">
                      <label
                        htmlFor="discountPercentage"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phần trăm giảm giá
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          id="discountPercentage"
                          {...register("discountPercentage", {
                            required: isSale
                              ? "Vui lòng nhập phần trăm giảm giá"
                              : false,
                            min: {
                              value: 0,
                              message: "Phần trăm không thể âm",
                            },
                            max: {
                              value: 100,
                              message: "Phần trăm không thể lớn hơn 100",
                            },
                          })}
                          className={`block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.discountPercentage ? "border-red-300" : ""
                          }`}
                          placeholder="0"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">%</span>
                        </div>
                      </div>
                      {errors.discountPercentage && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.discountPercentage.message}
                        </p>
                      )}
                    </div>

                    <div className="mt-2">
                      <label
                        htmlFor="salePrice"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Giá khuyến mãi
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">₫</span>
                        </div>
                        <input
                          type="number"
                          id="salePrice"
                          {...register("salePrice", {
                            min: { value: 0, message: "Giá không thể âm" },
                            validate: (value) => {
                              const price = watch("price");
                              return (
                                !value ||
                                !price ||
                                value < price ||
                                "Giá khuyến mãi phải nhỏ hơn giá gốc"
                              );
                            },
                          })}
                          className={`block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.salePrice ? "border-red-300" : ""
                          }`}
                          placeholder="0"
                          value={discountedPrice || ""}
                          readOnly
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">VND</span>
                        </div>
                      </div>
                      {errors.salePrice && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.salePrice.message}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mô tả sản phẩm
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register("description", {
                    required: "Vui lòng nhập mô tả sản phẩm",
                    minLength: {
                      value: 10,
                      message: "Mô tả phải có ít nhất 10 ký tự",
                    },
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.description ? "border-red-300" : ""
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Categories and Brands */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Phân loại
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Danh mục
                </label>
                <select
                  id="categoryId"
                  {...register("categoryId", {
                    required: "Vui lòng chọn danh mục",
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.categoryId ? "border-red-300" : ""
                  }`}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="brandId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Thương hiệu
                </label>
                <select
                  id="brandId"
                  {...register("brandId", {
                    required: "Vui lòng chọn thương hiệu",
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.brandId ? "border-red-300" : ""
                  }`}
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brandId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.brandId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin bổ sung
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="ingredients"
                  className="block text-sm font-medium text-gray-700"
                >
                  Thành phần
                </label>
                <textarea
                  id="ingredients"
                  rows={3}
                  {...register("ingredients")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nhập thành phần sản phẩm..."
                />
              </div>

              <div>
                <label
                  htmlFor="productUsage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hướng dẫn sử dụng
                </label>
                <textarea
                  id="productUsage"
                  rows={3}
                  {...register("productUsage")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nhập hướng dẫn sử dụng..."
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Hình ảnh sản phẩm
            </h2>

            {/* Image preview grid */}
            <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-3 lg:grid-cols-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}

              {/* Upload button */}
              <div className="relative aspect-square">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
                <label
                  htmlFor="images"
                  className="h-full w-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-600">
                    Thêm ảnh
                  </span>
                </label>
              </div>
            </div>

            {imagePreviewUrls.length === 0 && (
              <p className="text-sm text-gray-500">
                Chưa có ảnh nào được chọn. Bạn có thể tải lên nhiều ảnh cùng
                lúc.
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
