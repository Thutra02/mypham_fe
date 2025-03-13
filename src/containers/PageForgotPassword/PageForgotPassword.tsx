import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { forgotPassword } from "../../features/auth/authSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import { AppDispatch } from "../../store";

export interface PageForgotPasswordProps {
    className?: string;
}

const PageForgotPassword: FC<PageForgotPasswordProps> = ({ className = "" }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await dispatch(forgotPassword(data?.email)).unwrap();
            toast.success("Yêu cầu đặt lại mật khẩu đã được gửi");
            navigate("/verify-otp?email=" + data?.email);
        } catch (error) {
            console.error("Failed to send reset password request", error);
            toast.error("Gửi yêu cầu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`nc-PageForgotPassword ${className}`} data-nc-id="PageForgotPassword">
            <title>Quên mật khẩu || fashionFactory React Template</title>
            <div className="container mb-24 lg:mb-32">
                <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
                    Quên mật khẩu
                </h2>
                <div className="max-w-md mx-auto space-y-6">
                    {/* FORM */}
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Địa chỉ email
                            </span>
                            <Input
                                type="email"
                                placeholder="example@example.com"
                                className="mt-1"
                                {...register("email", { required: "Email là bắt buộc" })}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
                        </label>
                        <ButtonPrimary type="submit" disabled={loading}>
                            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                        </ButtonPrimary>
                    </form>
                    {/* ==== */}
                    <span className="block text-center text-neutral-700 dark:text-neutral-300">
                        Nhớ mật khẩu? {` `}
                        <Link className="text-green-600" to="/login">
                            Đăng nhập
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PageForgotPassword;
