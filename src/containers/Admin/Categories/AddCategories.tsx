import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import api from "../../../api/api";
import {
  addCategory,
  fetchCategoryById,
  updateCategory,
} from "../../../features/category/categorySlice";
import { AppDispatch, RootState } from "../../../store";
import { Category } from "../../../types";
import { uploadImage } from "../../../utils/uploadImage";
import "../Brand/ListBrand.css"; // Sử dụng lại file CSS từ ListBrand

const AddCategories = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { category } = useSelector((state: RootState) => state.categories);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setValue("image", file); // Use setValue to update the image file
      setImagePreview(imageUrl);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(Number(id))).then((action) => {
        if (fetchCategoryById.fulfilled.match(action)) {
          const category = action.payload;
          setValue("name", category.name);
          setValue("description", category.description);
          setValue("image", category.image);
          setValue("active", category.active ? "true" : "false");
          setImagePreview(category.image);
        }
      });
    }
  }, [id, dispatch, setValue]);

  // Xử lý submit form
  const onSubmit = async (data: any) => {
    try {
      let imageUrl = imagePreview;
      if (data.image && typeof data.image !== "string") {
        const formDataImage = new FormData();
        formDataImage.append("file", data.image);
        const image = await uploadImage(formDataImage);
        imageUrl = api.getUri() + "/api" + image;
      }

      const newCategory: Category = {
        id: category ? category.id : Date.now(),
        name: data.name,
        description: data.description,
        image: imageUrl!,
        active: data.active === "true",
        createdDate: category ? category.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      if (category?.id) {
        await dispatch(updateCategory(newCategory)).unwrap();
        toast.success("Cập nhật danh mục thành công");
      } else {
        await dispatch(addCategory(newCategory)).unwrap();
        toast.success("Thêm danh mục thành công");
      }
      navigate("/admin/categories");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="form-container">
      {/* Header */}
      <div className="form-header">
        <h1 className="form-title">
          {category ? `Chỉnh danh mục: ${category.name}` : "Thêm danh mục"}
        </h1>
        <NavLink to="/admin/categories" className="form-back-link">
          <span className="form-back-link-text">Quay lại danh sách danh mục</span>
        </NavLink>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Name and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Tên
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Tên là bắt buộc" })}
              className={`form-input ${errors.name ? "form-input-error" : ""}`}
            />
            {errors.name && typeof errors.name.message === "string" && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="active" className="form-label">
              Trạng thái
            </label>
            <select
              id="active"
              {...register("active")}
              className="form-select"
            >
              <option value={"true"}>Hoạt động</option>
              <option value={"false"}>Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Mô tả
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="form-textarea"
          />
        </div>

        {/* Image */}
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Ảnh
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-file-input"
          />
          {imagePreview && (
            <div className="form-image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <NavLink to="/admin/categories" className="form-cancel-button">
            Hủy
          </NavLink>
          <button type="submit" className="form-submit-button">
            {category ? "Cập nhật danh mục" : "Lưu danh mục"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategories;