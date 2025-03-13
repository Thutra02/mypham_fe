import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../../features/auth/authSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import { AppDispatch } from "../../store";

export interface PageSignUpProps {
  className?: string;
}

const PageSignUp: FC<PageSignUpProps> = ({ className = "" }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  
  const onSubmit = async (data: any) => {
    try {
      await dispatch(registerUser({
        username: data.username,
        email: data.email,
        password: data.password
      })).unwrap();
      navigate("/login");
      toast.success("Đăng ký thành công");
    } catch (error) {
      console.error("Failed to register", error);
      toast.error("Đăng ký thất bại");
    }
  };

  return (
    <div className={`nc-PageSignUp  ${className}`} data-nc-id="PageSignUp">
      <title>Đăng ký || fashionFactory React Template</title>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Đăng ký
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Username */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">Tên người dùng</span>
              <Input
                type="text"
                placeholder="Tên người dùng của bạn"
                className="mt-1"
                {...register("username", {
                  required: "Tên người dùng là bắt buộc",
                  minLength: { value: 3, message: "Tên người dùng phải có ít nhất 3 ký tự" },
                  maxLength: { value: 20, message: "Tên người dùng không quá 20 ký tự" }
                })}
              />
              {errors.username && <p className="text-red-500 text-sm">{String(errors.username.message)}</p>}
            </label>

            {/* Email */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">Địa chỉ email</span>
              <Input
                type="email"
                placeholder="example@example.com"
                className="mt-1"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
            </label>

            {/* Password */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">Mật khẩu</span>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="mt-1"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
                      message: "Mật khẩu phải có ít nhất 1 chữ cái và 1 số"
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{String(errors.password.message)}</p>}
            </label>

            {/* Confirm Password */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">Xác nhận mật khẩu</span>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  className="mt-1"
                  {...register("confirmPassword", {
                    required: "Xác nhận mật khẩu là bắt buộc",
                    validate: (value) => value === watch("password") || "Mật khẩu không khớp"
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{String(errors.confirmPassword.message)}</p>}
            </label>

            <ButtonPrimary type="submit">Tiếp tục</ButtonPrimary>
          </form>

          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Đã có tài khoản? {` `}
            <Link className="text-green-600" to="/login">
              Đăng nhập
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
