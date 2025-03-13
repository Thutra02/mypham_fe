import { FC, useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Label from "../../components/Label/Label";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import Input from "../../shared/Input/Input";
import Textarea from "../../shared/Textarea/Textarea";
import CommonLayout from "./CommonLayout";

export interface AccountPageProps {
  className?: string;
}

interface FormValues {
  username: string;
  email: string;
  phone: string;
  bio: string;
}

const AccountPage: FC<AccountPageProps> = ({ className = "" }) => {
  const { updateUserInformation, userInformation, changeAvatar } = useContext<AuthContextType>(AuthContext as any);

  // Khai báo useForm với defaultValues từ userInfo
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: userInformation?.username || "",
      email: userInformation?.email || "",
      phone: userInformation?.phone || "",
      bio: userInformation?.bio || "",
    },
  });

  const handleChangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await changeAvatar(formData);
        toast.success("Change avatar successfully");
      } catch (error) {
        toast.error("Change avatar failed");
      }
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Thêm logic xử lý submit ở đây (ví dụ: gọi API để cập nhật thông tin)
      await updateUserInformation(data);
      toast.success("Account updated successfully");
    } catch (error) {
      toast.error("An error occurred");

    }
  };

  return (
    <div className={`nc-AccountPage ${className}`} data-nc-id="AccountPage">
      <title>Account || fashionFactory ecommerce React Template</title>
      <CommonLayout>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-10 sm:space-y-12">
            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl font-semibold">Account information</h2>
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 flex items-start">
                {/* AVATAR */}
                <div className="relative rounded-full overflow-hidden flex">
                  {
                    userInformation?.avatar === null ? (
                      <div className="w-32 h-32 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-2xl rounded-full">
                        <i className="las la-user-circle"></i>
                      </div>
                    ) : <img
                      src={userInformation?.avatar}
                      alt=""
                      className="w-32 h-32 rounded-full object-cover z-0"
                    />
                  }

                  <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="mt-1 text-xs">Change Image</span>
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleChangeImage}
                  />
                </div>
              </div>
              <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
                <div>
                  <Label>Full name</Label>
                  <Input
                    className="mt-1.5"
                    {...register("username", { required: "Full name is required" })}
                  />
                  {errors.username && (
                    <span className="text-red-500 text-sm">{errors.username.message}</span>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-envelope"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      placeholder="example@email.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      disabled={true}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email.message}</span>
                  )}
                </div>

                <div>
                  <Label>Phone number</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-phone-volume"></i>
                    </span>
                    <Input
                      className="!rounded-l-none"
                      {...register("phone", { required: "Phone number is required" })}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-red-500 text-sm">{errors.phone.message}</span>
                  )}
                </div>

                <div>
                  <Label>About you</Label>
                  <Textarea
                    className="mt-1.5"
                    {...register("bio", { required: "Bio is required" })}
                  />
                  {errors.bio && (
                    <span className="text-red-500 text-sm">{errors.bio.message}</span>
                  )}
                </div>

                <div className="pt-2">
                  <ButtonPrimary type="submit">Update account</ButtonPrimary>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CommonLayout>
    </div>
  );
};

export default AccountPage;