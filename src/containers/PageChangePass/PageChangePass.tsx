import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { changePass } from "../../features/auth/authSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import { AppDispatch } from "../../store";

const PageChangePass: FC = () => {
    const query = new URLSearchParams(useLocation().search);
    const email = query.get("email");

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            await dispatch(changePass({
                email: email || "",
                currentPassword: data?.currentPassword,
                newPassword: data?.newPassword,
            })).unwrap();
            navigate("/login");
            toast.success("Thay đổi mật khẩu thành công");
        } catch (error) {
            console.error("Failed to change password", error);
            toast.error("Thay đổi mật khẩu thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nc-PageChangePass" data-nc-id="PageChangePass">
            <title>Thay đổi mật khẩu || fashionFactory React Template</title>
            <div className="container mb-24 lg:mb-32">
                <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
                    Thay đổi mật khẩu
                </h2>
                <div className="max-w-md mx-auto space-y-6">
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Mật khẩu mới
                            </span>
                            <Input
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                className="mt-1"
                                {...register("newPassword", { required: "Mật khẩu mới là bắt buộc" })}
                            />
                            {errors.newPassword && <p className="text-red-500 text-sm">{String(errors.newPassword.message)}</p>}
                        </label>
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Xác nhận mật khẩu
                            </span>
                            <Input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                className="mt-1"
                                {...register("confirmPassword", {
                                    required: "Xác nhận mật khẩu là bắt buộc",
                                    validate: (value) => value === watch('newPassword') || "Mật khẩu không khớp"
                                })}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{String(errors.confirmPassword.message)}</p>}
                        </label>
                        <ButtonPrimary type="submit" disabled={loading}>
                            {loading ? "Đang thay đổi..." : "Thay đổi mật khẩu"}
                        </ButtonPrimary>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PageChangePass;