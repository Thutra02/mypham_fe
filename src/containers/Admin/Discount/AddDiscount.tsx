import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router";
import {
  addDiscount,
  fetchDiscountById,
  updateDiscount,
} from "../../../features/discount/discountSlice";
import { AppDispatch, RootState } from "../../../store";
import { Discount, DiscountType } from "../../../types/discount.types";
import "../Brand/AddBrand.css"; // Sử dụng cùng file CSS với AddBrand

const AddDiscount = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { discount } = useSelector((state: RootState) => state.discounts);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      discountCode: "",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 0,
      minOrderValue: 0,
      maxDiscountAmount: 0,
      maxUsage: 0,
      startDate: "",
      endDate: "",
      isActive: "true",
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchDiscountById(Number(id))).then((action) => {
        if (fetchDiscountById.fulfilled.match(action)) {
          const discount = action.payload;
          setValue("name", discount.name);
          setValue("discountCode", discount.discountCode);
          setValue("discountType", discount.discountType);
          setValue("discountValue", discount.discountValue);
          setValue("minOrderValue", discount.minOrderValue);
          setValue("maxDiscountAmount", discount.maxDiscountAmount);
          setValue("maxUsage", discount.maxUsage);
          setValue(
            "startDate",
            new Date(discount.startDate).toISOString().split("T")[0]
          );
          setValue(
            "endDate",
            new Date(discount.endDate).toISOString().split("T")[0]
          );
          setValue("isActive", discount.active ? "true" : "false");
        }
      });
    }
  }, [id, dispatch, setValue]);

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const maxDiscountAmount = watch("maxDiscountAmount");
  const discountType = watch("discountType");

  const onSubmit = async (data: any) => {
    const newDiscount: Discount = {
      id: discount ? discount.id : Date.now(),
      ...data,
      active: data.isActive === "true" ? true : false,
      usageCount: discount ? discount.usageCount : 0,
      applicableProductId: discount ? discount.applicableProductId : 0,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };
    try {
      if (discount?.id) {
        await dispatch(updateDiscount(newDiscount)).unwrap();
        toast.success("Discount updated successfully");
      } else {
        await dispatch(addDiscount(newDiscount)).unwrap();
        toast.success("Discount added successfully");
      }
      navigate("/admin/discounts");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="form-container">
      {/* Header */}
      <div className="form-header">
        <h1 className="form-title">
          {discount ? `Sửa mã - ${discount.name}` : "Thêm mã giảm giá"}
        </h1>
        <NavLink
          to="/admin/discounts"
          className="form-back-link"
        >
          <span className="form-back-link-text">Quay lại danh sách mã giảm giá</span>
        </NavLink>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Name and Discount Code */}
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
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="discountCode" className="form-label">
              Mã giảm giá
            </label>
            <input
              type="text"
              id="discountCode"
              {...register("discountCode", {
                required: "Mã giảm giá là bắt buộc",
              })}
              className={`form-input ${errors.discountCode ? "form-input-error" : ""}`}
            />
            {errors.discountCode && (
              <p className="error-message">{errors.discountCode.message}</p>
            )}
          </div>
        </div>

        {/* Discount Type and Discount Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="discountType" className="form-label">
              Loại giảm giá
            </label>
            <select
              id="discountType"
              {...register("discountType")}
              className="form-select"
            >
              <option value={DiscountType.PERCENTAGE}>Phần trăm</option>
              <option value={DiscountType.FIXED}>Số tiền cố định</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="discountValue" className="form-label">
              Giá trị giảm giá
            </label>
            <input
              type="number"
              id="discountValue"
              {...register("discountValue", {
                required: "Giá trị giảm giá là bắt buộc",
                min: { value: 1, message: "Giá trị giảm giá phải lớn hơn 0" },
                validate: (value) => {
                  if (discountType === DiscountType.PERCENTAGE) {
                    return (
                      value <= 100 ||
                      "Giá trị giảm giá phần trăm không được vượt quá 100%"
                    );
                  }
                  const max = maxDiscountAmount ? maxDiscountAmount : Infinity;
                  return (
                    value <= max ||
                    "Giá trị giảm giá không được vượt quá số tiền giảm giá tối đa"
                  );
                },
              })}
              className={`form-input ${errors.discountValue ? "form-input-error" : ""}`}
            />
            {errors.discountValue && (
              <p className="error-message">{errors.discountValue.message}</p>
            )}
          </div>
        </div>

        {/* Min Order Value and Max Discount Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="minOrderValue" className="form-label">
              Giá trị đơn hàng tối thiểu
            </label>
            <input
              type="number"
              id="minOrderValue"
              {...register("minOrderValue", {
                required: "Giá trị đơn hàng tối thiểu là bắt buộc",
              })}
              className={`form-input ${errors.minOrderValue ? "form-input-error" : ""}`}
            />
            {errors.minOrderValue && (
              <p className="error-message">{errors.minOrderValue.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="maxDiscountAmount" className="form-label">
              Số tiền giảm giá tối đa
            </label>
            <input
              type="number"
              id="maxDiscountAmount"
              {...register("maxDiscountAmount", {
                required: "Số tiền giảm giá tối đa là bắt buộc",
              })}
              className={`form-input ${errors.maxDiscountAmount ? "form-input-error" : ""}`}
            />
            {errors.maxDiscountAmount && (
              <p className="error-message">{errors.maxDiscountAmount.message}</p>
            )}
          </div>
        </div>

        {/* Start Date and End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              id="startDate"
              {...register("startDate", {
                required: "Ngày bắt đầu là bắt buộc",
                validate: (value) => {
                  const start = new Date(value);
                  const end = new Date(endDate);
                  return start < end || "Ngày bắt đầu phải trước ngày kết thúc";
                },
              })}
              className={`form-input ${errors.startDate ? "form-input-error" : ""}`}
            />
            {errors.startDate && (
              <p className="error-message">{errors.startDate.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endDate" className="form-label">
              Ngày kết thúc
            </label>
            <input
              type="date"
              id="endDate"
              {...register("endDate", {
                required: "Ngày kết thúc là bắt buộc",
                validate: (value) => {
                  const start = new Date(startDate);
                  const end = new Date(value);
                  return end > start || "Ngày kết thúc phải sau ngày bắt đầu";
                },
              })}
              className={`form-input ${errors.endDate ? "form-input-error" : ""}`}
            />
            {errors.endDate && (
              <p className="error-message">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Max Usage and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="maxUsage" className="form-label">
              Số lần sử dụng tối đa
            </label>
            <input
              type="number"
              id="maxUsage"
              {...register("maxUsage", {
                required: "Số lần sử dụng tối đa là bắt buộc",
              })}
              className={`form-input ${errors.maxUsage ? "form-input-error" : ""}`}
            />
            {errors.maxUsage && (
              <p className="error-message">{errors.maxUsage.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="isActive" className="form-label">
              Trạng thái
            </label>
            <select
              id="isActive"
              {...register("isActive")}
              className="form-select"
            >
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <NavLink to="/admin/discounts" className="form-cancel-button">
            Hủy
          </NavLink>
          <button type="submit" className="form-submit-button">
            {discount ? "Cập nhật mã giảm giá" : "Lưu mã giảm giá"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDiscount;
