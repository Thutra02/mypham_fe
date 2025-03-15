import { Dialog, Transition } from '@headlessui/react';
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { AuthContext, AuthContextType } from '../../../context/AuthContext';
import { deleteOrder, fetchOrders, updateOrderStatus } from '../../../features/order/orderSlice';
import { AppDispatch, RootState } from '../../../store';
import { OrderStatus } from '../../../types/order.types';
import formatDate from '../../../utils/formatDate';
import formatCurrencyVND from '../../../utils/formatMoney';
import "../Brand/ListBrand.css";
import PaginationItem from '../PaginationItem';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListOrder = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, error, pagination } = useSelector((state: RootState) => state.orders);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(5);
  const {   userRole } = useContext<AuthContextType>(AuthContext as any);



  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(fetchOrders({ page: 1, search: value, size: pageSize }));
    }, 500),
    [dispatch, pageSize]
  );


  const handleSearchOrderId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchOrderId(value);
    debouncedSearch(value);
  };


  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);


  useEffect(() => {
    dispatch(fetchOrders({ page: 1, search: searchOrderId, size: pageSize }));
  }, [dispatch, pageSize, searchOrderId]);

  const openDeleteModal = (id: number) => {
    setSelectedOrderId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedOrderId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedOrderId !== null) {
      try {
        await dispatch(deleteOrder(selectedOrderId)).unwrap();
        toast.success('Xóa đơn hàng thành công!');
        closeDeleteModal();
      } catch (error) {
        console.error(error);
        toast.error('Xóa đơn hàng thất bại!');
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchOrders({ page, search: searchOrderId, size: pageSize }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchOrders({ page: 1, search: searchOrderId, size: newSize }));
  };


  const handleStatusChange = async (id: number, newStatus: OrderStatus) => {
    try {
      if (userRole !== 'ADMIN' && newStatus === OrderStatus.CANCELLED) {
        toast.error('Bạn không có quyền hủy đơn hàng!');
        return;
      }
      await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh Sách Đơn Hàng</h1>

      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="orderIdSearch" className="block text-sm font-medium text-gray-700">
          Tìm kiếm theo Mã Đơn Hàng
        </label>
        <input
          type="text"
          id="orderIdSearch"
          value={searchOrderId}
          onChange={handleSearchOrderId}
          placeholder="Nhập mã đơn hàng..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header px-6 py-3">ID</th>
              <th className="table-header px-6 py-3">Mã Đơn Hàng</th>
              <th className="table-header px-6 py-3">Người Dùng</th>
              <th className="table-header px-6 py-3">Tổng Tiền</th>
              <th className="table-header px-6 py-3">Ngày Đặt</th>
              <th className="table-header px-6 py-3">Trạng Thái</th>
              <th className="table-header px-6 py-3">Hành Động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  {error}
                </td>
              </tr>
            ) : orders?.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="table-cell px-6 py-4">{order.id}</td>
                  <td className="table-cell-bold px-6 py-4">{order.orderId}</td>
                  <td className="table-cell px-6 py-4">{order.user.username}</td>
                  <td className="table-cell px-6 py-4">
                    {formatCurrencyVND(order.finalAmount)}
                  </td>
                  <td className="table-cell px-6 py-4">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="table-cell px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="mt-1  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {Object.values(OrderStatus).map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="table-cell px-6 py-4">
                    <div className="flex space-x-2">

                      <NavLink
                        to={`/admin/orders/edit/${order.id}`}
                        className="action-button p-1 rounded hover:bg-gray-100"
                        title="Chỉnh sửa"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </NavLink>
                      <button
                        onClick={() => openDeleteModal(order.id)}
                        className="delete-button p-1 rounded hover:bg-gray-100"
                        title="Xóa"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy đơn hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <PaginationItem
        length={orders.length}
        pagination={pagination}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        handlePageChange={handlePageChange}
        classNames={classNames}
      />

      {/* Delete Confirmation Modal */}
      <Transition show={isDeleteModalOpen} as="div">
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Xóa Đơn Hàng
                    </Dialog.Title>
                    <button

                      onClick={closeDeleteModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                    >
                      <XMarkIcon className="h-6 w-6 text-current" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
                      onClick={closeDeleteModal}
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                      onClick={handleDelete}
                    >
                      Xác Nhận Xóa
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ListOrder;