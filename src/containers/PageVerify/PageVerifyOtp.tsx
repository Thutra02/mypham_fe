import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { verifyOtp } from "../../features/auth/authSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import { AppDispatch } from "../../store";

const PageVerifyOtp: FC = () => {
  // lấy query params từ URL
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await dispatch(verifyOtp({
        otp: data?.otp,
        email: email || "",
      })).unwrap();
      navigate("/change-password-new?email=" + email);
      toast.success("Xác minh OTP thành công");
    } catch (error) {
      console.error("Failed to verify OTP", error);
      toast.error("Xác minh OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nc-PageVerifyOtp" data-nc-id="PageVerifyOtp">
      <title>Xác minh OTP || fashionFactory React Template</title>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Xác minh OTP
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Mã OTP
              </span>
              <Input
                type="text"
                placeholder="Nhập mã OTP"
                className="mt-1"
                {...register("otp", { required: "OTP là bắt buộc" })}
              />
              {errors.otp && <p className="text-red-500 text-sm">{String(errors.otp.message)}</p>}
            </label>
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? "Đang xác minh..." : "Xác minh"}
            </ButtonPrimary>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageVerifyOtp;