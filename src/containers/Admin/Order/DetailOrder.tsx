import { Listbox, Transition } from '@headlessui/react';
import {
  ArrowLeftIcon,
  BanknotesIcon,
  CheckIcon,
  ClockIcon,
  EnvelopeIcon,
  PencilIcon,
  PhoneIcon,
  TrashIcon,
  TruckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import OrderItemsTable from '../../../components/OrderItemsTable';
import OrderTimeline from '../../../components/OrderTimeline';
import { fetchOrderDetails, sendMailOrder, updateOrderStatus } from '../../../features/order/orderSlice';
import { AppDispatch, RootState } from '../../../store';
import { OrderStatus } from '../../../types/order.types';
import formatCurrencyVND from '../../../utils/formatMoney';

const DetailOrder = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { orderDetails: order, loading } = useSelector((state: RootState) => state.orders);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  console.log(order)
  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setSelectedStatus(newStatus);
  };

  const saveChanges = async () => {
    if (order && selectedStatus) {
      try {
        dispatch(updateOrderStatus({ id: order.id, status: selectedStatus }));
        toast.success("Cập nhật trạng thái đơn hàng thành công");
        setIsEditing(false);
      } catch (error) {
        console.log(error);
        toast.error("Cập nhật trạng thái đơn hàng thất bại");

      }
    }
  };

  const handleSendEmail = async () => {
    try {
      await dispatch(sendMailOrder({
        email: order?.user?.email ?? "",
        orderId: order?.id ?? 0,
      })).unwrap();
      toast.success("Gửi email thành công");
    } catch (error) {
      console.log(error);
      toast.error("Gửi email thất bại");
    }
  }
  const cancelChanges = () => {
    if (order) {
      setSelectedStatus(order.status);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy đơn hàng</h1>
        <p className="text-gray-600 mt-2">Đơn hàng bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
        <button
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };


  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800 border-green-200";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Chờ xử lý";
      case OrderStatus.PROCESSING:
        return "Đang xử lý";
      case OrderStatus.SHIPPED:
        return "Đã giao cho vận chuyển";
      case OrderStatus.DELIVERED:
        return "Đã giao hàng";
      case OrderStatus.CANCELLED:
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <ClockIcon className="h-5 w-5" />;
      case OrderStatus.SHIPPED:
        return <TruckIcon className="h-5 w-5" />;
      case OrderStatus.DELIVERED:
        return <CheckIcon className="h-5 w-5" />;
      case OrderStatus.CANCELLED:
        return <XMarkIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <button className="mr-4 text-gray-500 hover:text-gray-700" onClick={() => window.history.back()}>
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng #{order.orderId.substring(0, 8)}</h1>
              </div>
              <p className="mt-1 text-sm text-gray-500">Đặt lúc {formatDate(order.orderDate)}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">

              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                type='button' onClick={handleSendEmail}

              >
                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-500" />
                Gửi email
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <TrashIcon className="h-4 w-4 mr-2" />
                Xóa
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column - Order info */}
          <div className="lg:col-span-2">
            {/* Order Status */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Trạng thái đơn hàng</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Cập nhật
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={saveChanges}
                      className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Lưu
                    </button>
                    <button
                      onClick={cancelChanges}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Hủy
                    </button>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {isEditing ? (
                  <div className="w-full max-w-xs">
                    <Listbox value={selectedStatus} onChange={handleStatusChange}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                          <span className="flex items-center">
                            {getStatusIcon(selectedStatus || OrderStatus.PENDING)}
                            <span className="ml-2 block truncate">
                              {getStatusText(selectedStatus || OrderStatus.PENDING)}
                            </span>
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                            {Object.values(OrderStatus).map((status) => (
                              <Listbox.Option
                                key={status}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                                  }`
                                }
                                value={status}
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`flex items-center ${selected ? "font-medium" : "font-normal"}`}>
                                      {getStatusIcon(status)}
                                      <span className="ml-2 block truncate">{getStatusText(status)}</span>
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                ) : (
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1.5">{getStatusText(order.status)}</span>
                    </span>
                    <div className="mt-6">
                      <OrderTimeline status={order.status} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Sản phẩm trong đơn hàng</h2>
                <p className="mt-1 text-sm text-gray-500">{order.orderItems.length} sản phẩm</p>
              </div>
              <div className="border-t border-gray-200">
                <OrderItemsTable items={order.orderItems} formatCurrency={formatCurrencyVND} />
              </div>
            </div>

          </div>

          {/* Right column - Customer info and summary */}
          <div className="lg:col-span-1">
            {/* Customer Information */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Thông tin khách hàng</h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex items-center gap-x-4 mb-4">
                  <img
                    src={order.user?.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={order.user?.username || "User Avatar"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-md font-medium">{order.user?.username || "Unknown User"}</h4>

                    {order.user?.email && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <EnvelopeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="break-all">{order.user.email}</span>
                      </div>
                    )}

                    {order.user?.phone && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <PhoneIcon className="h-4 w-4 mr-1 flex-shrink-0" />
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
      </div>
    </div>
  );
};

export default DetailOrder;