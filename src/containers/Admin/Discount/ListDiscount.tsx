import { Dialog, Transition } from "@headlessui/react";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import {
  deleteDiscount,
  fetchDiscounts,
} from "../../../features/discount/discountSlice";
import { AppDispatch, RootState } from "../../../store";
import PaginationItem from "../PaginationItem";
import "../Brand/ListBrand.css"; // Import CSS
import formatCurrencyVND from "../../../utils/formatMoney";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ListDiscount = () => {
  const dispatch: AppDispatch = useDispatch();
  const { discounts, error, pagination } = useSelector(
    (state: RootState) => state.discounts
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscountId, setSelectedDiscountId] = useState<number | null>(
    null
  );
  const [searchName, setSearchName] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    dispatch(fetchDiscounts({ page: 1, search: searchName, size: pageSize }));
  }, [dispatch, pageSize]);

  const openDeleteModal = (id: number) => {
    setSelectedDiscountId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedDiscountId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedDiscountId !== null) {
      try {
        await dispatch(deleteDiscount(selectedDiscountId)).unwrap();
        toast.success("Xóa giảm giá thành công!");
        closeDeleteModal();
        dispatch(
          fetchDiscounts({ page: 1, search: searchName, size: pageSize })
        );
      } catch (error:any) {
        
        toast.error(error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchDiscounts({ page, search: searchName, size: pageSize }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchDiscounts({ page: 1, search: searchName, size: newSize }));
  };

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchDiscounts({ page: 1, search: value, size: pageSize }));
  }, 300);

  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    debouncedSearch(value);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách giảm giá</h1>
        <NavLink
          to="/admin/discounts/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Thêm giảm giá mới
        </NavLink>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label
          htmlFor="nameSearch"
          className="block text-sm font-medium text-gray-700"
        >
          Tìm kiếm theo tên
        </label>
        <input
          type="text"
          id="nameSearch"
          value={searchName}
          onChange={handleSearchName}
          placeholder="Nhập tên giảm giá..."
          className="form-input" // Sử dụng class từ ListBrand.css
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Tên</th>
              <th className="table-header">Mã</th>
              <th className="table-header">Loại</th>
              <th className="table-header">Giá trị</th>
              <th className="table-header">Tối thiểu</th>
              <th className="table-header">Tối đa</th>
              <th className="table-header">Trạng thái</th>
              <th className="table-header">Hành động</th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  {error}
                </td>
              </tr>
            ) : discounts.length > 0 ? (
              discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50">
                  <td className="table-cell px-6 py-4">{discount.id}</td>
                  <td className="table-cell-bold px-6 py-4 truncate max-w-[200px]">
                    {discount.name}
                  </td>
                  <td className="table-cell px-6 py-4 font-mono">{discount.discountCode}</td>
                  <td className="table-cell px-6 py-4">{discount.discountType}</td>
                  <td className="table-cell px-6 py-4">{discount.discountValue}%</td>
                  <td className="table-cell px-6 py-4">
                    {formatCurrencyVND(discount.minOrderValue)}
                  </td>
                  <td className="table-cell px-6 py-4">
                    {formatCurrencyVND(discount.maxDiscountAmount)}
                  </td>
                  <td className="table-cell px-6 py-4">
                    <span className={discount.active ? "status-active" : "status-inactive"}>
                      {discount.active ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="table-cell px-6 py-4">
                    <div className="flex space-x-2">
                      <NavLink
                        to={`/admin/discounts/edit/${discount.id}`}
                        className="action-button p-1 rounded hover:bg-gray-100"
                        title="Chỉnh sửa"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </NavLink>
                      <button
                        onClick={() => discount.id && openDeleteModal(discount.id)}
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
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy giảm giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Giữ nguyên */}
      <PaginationItem
        length={discounts.length}
        pagination={pagination}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        handlePageChange={handlePageChange}
        classNames={classNames}
      />

      {/* Modal - Sử dụng class chuẩn */}
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
            <div className="modal-overlay" />
          </Transition.Child>

          <div className="modal-container">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as="div"
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="modal-panel">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="modal-close-button"
                      onClick={closeDeleteModal}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title className="modal-title">
                        Xóa giảm giá
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="modal-content">
                          Bạn có chắc chắn muốn xóa giảm giá này không?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="modal-action-button modal-confirm-button"
                      onClick={handleDelete}
                    >
                      Xóa
                    </button>
                    <button
                      type="button"
                      className="modal-action-button modal-cancel-button"
                      onClick={closeDeleteModal}
                    >
                      Hủy
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

export default ListDiscount;
