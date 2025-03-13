import { FC, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { addAddress, fetchAddressById, updateAddress } from "../../features/address/addressSlice";
import { AppDispatch } from "../../store";

import toast from 'react-hot-toast';
import Label from "../../components/Label/Label";
import ButtonPrimary from "../../shared/Button/ButtonPrimary";
import ButtonSecondary from "../../shared/Button/ButtonSecondary";
import Input from "../../shared/Input/Input";
import { Address } from '../../types';

interface Props {
    isActive: boolean;
    onCloseActive: () => void;
    onOpenActive: () => void;
    id?: number;
}

const AddShippingAddress: FC<Props> = ({ isActive, onCloseActive, id }) => {
    const dispatch: AppDispatch = useDispatch();

    // State lưu dữ liệu địa chỉ
    const [formData, setFormData] = useState<Address>({
        id: 0,
        firstName: "",
        lastName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        default: false,
        createdDate: "",
        updatedDate: ""
    });

    // Fetch address data if id is provided
    useEffect(() => {
        if (id) {
            const fetchAddress = async () => {
                try {
                    const address = await dispatch(fetchAddressById(id)).unwrap();
                    setFormData(address);
                } catch (error) {
                    console.error("Failed to fetch address", error);
                }
            };
            fetchAddress();
        }
    }, [id, dispatch]);

    // Hàm xử lý thay đổi giá trị input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Hàm lưu địa chỉ
    const handleSaveAddress = async () => {
        try {
            if (id) {
                await dispatch(updateAddress({ ...formData, id })).unwrap();
                toast.success("Đã cập nhật địa chỉ");
            } else {
                await dispatch(addAddress(formData)).unwrap();
                toast.success("Đã thêm địa chỉ mới");
            }
            onCloseActive();
        } catch (error) {
            console.error("Failed to save address", error);
            toast.error("Lỗi khi lưu địa chỉ");
        }
    };

    const renderShippingAddress = () => {
        return (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl ">
                <div
                    className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${isActive ? "block" : "hidden"
                        }`}
                >
                    {/* ============ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                        <div>
                            <Label className="text-sm">Tên</Label>
                            <Input className="mt-1.5" name="firstName" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div>
                            <Label className="text-sm">Họ</Label>
                            <Input className="mt-1.5" name="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>
                    </div>

                    {/* ============ */}
                    <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
                        <div className="flex-1">
                            <Label className="text-sm">Địa chỉ</Label>
                            <Input
                                className="mt-1.5"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    {/* ============ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                        <div>
                            <Label className="text-sm">Thành phố/Huyện/Quận</Label>
                            <Input className="mt-1.5" name="city" value={formData.city} onChange={handleChange} />
                        </div>

                    </div>

                    {/* ============ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                        <div>
                            <Label className="text-sm">Tỉnh/Thành phố</Label>
                            <Input className="mt-1.5" name="state" value={formData.state} onChange={handleChange} />
                        </div>
                        <div>
                            <Label className="text-sm">Mã bưu điện</Label>
                            <Input className="mt-1.5" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                        </div>
                    </div>

                    {/* ============ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                        <div>
                            <Label className="text-sm">Số điện thoại</Label>
                            <Input className="mt-1.5" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <Label className="text-sm">Email</Label>
                            <Input className="mt-1.5" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                    </div>

                    {/* ============ */}
                    <div className="flex flex-col sm:flex-row pt-6">
                        <ButtonPrimary className="sm:!px-7 shadow-none" onClick={handleSaveAddress}>
                            Lưu
                        </ButtonPrimary>
                        <ButtonSecondary className="mt-3 sm:mt-0 sm:ml-3" onClick={onCloseActive}>
                            Hủy
                        </ButtonSecondary>
                    </div>
                </div>
            </div>
        );
    };

    return renderShippingAddress();
}

export default AddShippingAddress;
