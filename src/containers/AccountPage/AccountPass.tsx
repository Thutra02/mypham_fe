import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Label from "../../components/Label/Label";
import { changePassword } from "../../features/auth/authSlice";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import { AppDispatch } from "../../store";
import CommonLayout from "./CommonLayout";

const AccountPass = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch: AppDispatch = useDispatch();
  const onSubmit = async (data: any) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("Password does not match");
        return;
      }
      await dispatch(changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })).unwrap();
      toast.success("Change password successfully");
    } catch (error) {
      toast.error("Change password failed");
    }
  };

  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Update your password
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
            <div>
              <Label>Current password</Label>
              <Input type="password" className="mt-1.5" {...register("currentPassword", { required: true })} />
              {errors.currentPassword && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div>
              <Label>New password</Label>
              <Input type="password" className="mt-1.5" {...register("newPassword", { required: true })} />
              {errors.newPassword && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input type="password" className="mt-1.5" {...register("confirmPassword", { required: true })} />
              {errors.confirmPassword && <span className="text-red-500 text-sm">This field is required</span>}
            </div>
            <div className="pt-2">
              <ButtonPrimary type="submit">Update password</ButtonPrimary>
            </div>
          </form>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountPass;
