import {
    BanknotesIcon,
    EnvelopeIcon,
    PhoneIcon,
    StarIcon
} from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Prices from "../../components/Prices";
import { fetchOrderDetails, updateOrderStatus } from "../../features/order/orderSlice";
import ButtonSecondary from "../../shared/Button/ButtonSecondary";
import { AppDispatch, RootState } from "../../store";
import { CartItem, Order, OrderStatus } from "../../types";
import formatDate from "../../utils/formatDate";
import formatCurrencyVND from "../../utils/formatMoney";
import CommonLayout from "./CommonLayout";
const AccountOrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { orderDetails: order, error } = useSelector((state: RootState) => state.orders);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(fetchOrderDetails(Number(id)));
        }
    }
        , [dispatch]);

    const handleStatusChange = (status: OrderStatus) => {
        try {
            dispatch(updateOrderStatus({
                id: order?.id ?? 0,
                status: status
            }));


        } catch (error) {
            console.log(error);
        }
    };
    const handleReviewProduct = ({ productId }: {
        productId: number
        orderItemId: number
    }) => {
        console.log("productId", productId)
        navigate(`/account-my-order/review/${productId}?orderId=${order?.id}`);
    }


    if (error) {
        return <div className="px-6 py-4 text-center text-sm text-gray-500">{error}</div>;
    }
    if (!order) {
        return <div className="px-6 py-4 text-center text-sm text-gray-500">Không tìm thấy đơn hàng</div>;
    }
    const renderProductItem = (cartItem: CartItem, index: number) => {
        const { product, quantity, unitPrice, id } = cartItem;
        const canReview = order.status === OrderStatus.DELIVERED
        console.log("canReview", product)
        return (
            <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
                <div className="h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                        src={product?.productImages[0]?.image ?? "/placeholder.svg?height=40&width=40"}
                        alt={product?.name}
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                    <div>
                        <div className="flex justify-between ">
                            <div>
                                <h3 className="text-base font-medium line-clamp-1">{product?.name}</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    <span>{product?.brand?.name}</span>
                                    <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                                    <span>{product?.category?.name}</span>
                                </p>
                            </div>
                            <Prices className="mt-0.5 ml-2" price={unitPrice} />
                        </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500 dark:text-slate-400 flex items-center">
                            <span className="hidden sm:inline-block">Qty</span>
                            <span className="inline-block sm:hidden">x</span>
                            <span className="ml-2">{quantity}</span>
                        </p>
                        {canReview && (
                            <button
                                onClick={() => handleReviewProduct({
                                    productId: product.id,
                                    orderItemId: id
                                })}
                                className="flex items-center text-primary-600 hover:text-primary-500 font-medium"
                            >
                                <StarIcon className="h-4 w-4 mr-1" />
                                Đánh giá sản phẩm
                            </button>
                        )}

                    </div>
                </div>
            </div>
        );
    };
    const renderOrder = ({
        key, order
    }: {
        key: number;
        order: Order;
    }) => {
        return (
            <div key={key} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
                    <div>
                        <p className="text-lg font-semibold">{order.id}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                            <span>{formatDate(order?.orderDate ?? "")}</span>
                            <span className="mx-2">·</span>
                            <span className="text-primary-500">{
                                order.status
                            }</span>
                        </p>
                    </div>
                    {
                        order.status === OrderStatus.PENDING && (
                            <div className="mt-3 sm:mt-0">
                                <ButtonSecondary
                                    sizeClass="py-2.5 px-4 sm:px-6"
                                    fontSize="text-sm font-medium"
                                    type="button"
                                    onClick={
                                        () => handleStatusChange(OrderStatus.CANCELLED)
                                    }
                                >
                                    Huỷ đơn hàng
                                </ButtonSecondary>
                            </div>
                        )
                    }

                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
                    {
                        order.orderItems.map((item: CartItem, index: number) => renderProductItem(item, index))
                    }
                </div>
            </div>
        );
    };
    return (
        <div>
            <CommonLayout>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {
                            renderOrder(
                                {
                                    key: order.id,
                                    order: order
                                }
                            )
                        }
                    </div>
                    <div className="lg:col-span-1">
                        {/* Customer Information */}
                        <div className="bg-white shadow rounded-lg mb-6">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900">Thông tin khách hàng</h2>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={order.user.avatar || "/placeholder.svg?height=40&width=40"}
                                        alt={order.user.username}
                                        className="h-10 w-10 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="text-md font-medium">{order.user.username}</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                                            {order.user.email}
                                        </div>
                                        {order.user.phone && (
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <PhoneIcon className="h-4 w-4 mr-1" />
                                                {order.user.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white shadow rounded-lg mb-6">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900">Địa chỉ giao hàng</h2>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <p className="text-md font-medium">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{order.shippingAddress.streetAddress}</p>
                                <p className="text-sm text-gray-500">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                </p>
                                {order.shippingAddress.phone && (
                                    <div className="flex items-center text-sm text-gray-500 mt-2">
                                        <PhoneIcon className="h-4 w-4 mr-1" />
                                        {order.shippingAddress.phone}
                                    </div>
                                )}
                                {order.shippingAddress.email && (
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                                        {order.shippingAddress.email}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white shadow rounded-lg mb-6">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900">Thông tin thanh toán</h2>
                            </div>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <div className="flex items-center mb-4">
                                    <BanknotesIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-md font-medium">Phương thức thanh toán</p>
                                        <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-500">Tổng tiền hàng:</p>
                                        <p className="text-sm font-medium">{formatCurrencyVND(order.totalAmount)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-500">Giảm giá:</p>
                                        <p className="text-sm font-medium text-red-600">-{formatCurrencyVND(order.discountAmount)}</p>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200 flex justify-between">
                                        <p className="text-base font-medium">Tổng thanh toán:</p>
                                        <p className="text-base font-bold text-blue-600">{formatCurrencyVND(order.finalAmount ?? order.totalAmount)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </CommonLayout>
        </div>
    )
}

export default AccountOrderDetail