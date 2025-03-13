import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchUserOrders } from "../../features/order/orderSlice";
import ButtonSecondary from "../../shared/Button/ButtonSecondary";
import { AppDispatch, RootState } from "../../store";
import formatDate from "../../utils/formatDate";
import formatCurrencyVND from "../../utils/formatMoney";
import CommonLayout from "./CommonLayout";

const AccountOrder = () => {
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchUserOrders());
  }
    , [dispatch]);



  if (error) {
    return <div className="px-6 py-4 text-center text-sm text-gray-500">{error}</div>;
  }

  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl font-semibold">Order History</h2>
          <div className="border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID đơn hàng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt hàng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thành tiền
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>

                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                    loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) :
                      orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">Không có đơn hàng nào</div>
                          </td>
                        </tr>
                      ) :

                        orders.map((order, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{order.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrencyVND(order.totalAmount)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{order.orderItems.length}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrencyVND(order.finalAmount)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{order.status}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <ButtonSecondary
                                  type="button"
                                  onClick={() => {
                                    navigate(`/account-my-order/${order.id}`);
                                  }}
                                  sizeClass="py-2.5 px-4 sm:px-6"
                                  fontSize="text-sm font-medium"
                                >
                                  Xem chi tiết
                                </ButtonSecondary>
                              </div>
                            </td>
                          </tr>
                        ))

                  }

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountOrder;
