import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import api from "../../../api/api";
import {
  addBrand,
  fetchBrandById,
  updateBrand,
} from "../../../features/brand/brandSlice";
import { AppDispatch, RootState } from "../../../store";
import { Brand } from "../../../types";
import { uploadImage } from "../../../utils/uploadImage";
import "./AddBrand.css"; // Import file CSS tùy chỉnh

const AddBrand = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { brand } = useSelector((state: RootState) => state.brands);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBrandById(id)).then((action) => {
        if (fetchBrandById.fulfilled.match(action)) {
          const brand = action.payload;
          setValue("name", brand.name);
          setValue("description", brand.description);
          setValue("active", brand.active ? "true" : "false");
          setImagePreview(brand.image);
        }
      });
    }
  }, [id, dispatch, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(imageUrl);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      let imageUrl = imagePreview;
      if (imageFile != null) {
        const formDataImage = new FormData();
        formDataImage.append("file", imageFile);
        const image = await uploadImage(formDataImage);
        imageUrl = api.getUri() + "/api" + image;
      }

      const newBrand: Brand = {
        id: brand ? brand.id : Date.now(),
        name: data.name,
        description: data.description,
        image: imageUrl ?? brand?.image ?? "",
        active: data.active === "true",
        createdDate: brand ? brand.createdDate : new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      if (brand) {
        await dispatch(updateBrand(newBrand)).unwrap();
        toast.success("Cập nhật thương hiệu thành công");
      } else {
        await dispatch(addBrand(newBrand)).unwrap();
        toast.success("Thêm thương hiệu thành công");
      }

      navigate("/admin/brand");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1 className="form-title">
          {brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
        </h1>
        <NavLink to="/admin/brand" className="form-back-link">
          <span className="form-back-link-text">Quay lại danh sách thương hiệu</span>
        </NavLink>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Name and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Tên
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên không được để trống" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="name"
                  className={`form-input ${errors.name ? "form-input-error" : ""}`}
                />
              )}
            />
            {errors.name && typeof errors.name.message === "string" && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="active" className="form-label">
              Trạng thái
            </label>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <select {...field} id="active" className="form-select">
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              )}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Mô tả
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Mô tả không được để trống" }}
            render={({ field }) => (
              <textarea
                {...field}
                id="description"
                rows={4}
                className="form-textarea"
              />
            )}
          />
          {errors.description && typeof errors.description.message === "string" && (
            <p className="error-message">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Hình ảnh
          </label>
          <input
            type="file"
            id="image"
            name="image"
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
          <NavLink to="/admin/brand" className="form-cancel-button">
            Hủy
          </NavLink>
          <button type="submit" className="form-submit-button">
            {brand ? "Cập nhật thương hiệu" : "Lưu thương hiệu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;