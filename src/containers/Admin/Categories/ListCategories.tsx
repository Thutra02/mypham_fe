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
  deleteCategory,
  fetchCategories,
} from "../../../features/category/categorySlice";
import { AppDispatch, RootState } from "../../../store";
import PaginationItem from "../PaginationItem";
import "../Brand/ListBrand.css"; // Import CSS

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ListCategories = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories, error, pagination } = useSelector(
    (state: RootState) => state.categories
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [searchName, setSearchName] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, search: searchName, size: pageSize }));
  }, [dispatch, pageSize]);

  const openDeleteModal = (id: number) => {
    setSelectedCategoryId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCategoryId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedCategoryId !== null) {
      try {
        await dispatch(deleteCategory(selectedCategoryId)).unwrap();
        toast.success("Xóa danh mục thành công!");
        closeDeleteModal();
        dispatch(
          fetchCategories({ page: 1, search: searchName, size: pageSize })
        ); // Cập nhật lại danh sách với pageSize hiện tại
      } catch (error: any) {
        console.error(error);
        toast.error(error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchCategories({ page, search: searchName, size: pageSize })); // Thêm size vào đây
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchCategories({ page: 1, search: searchName, size: newSize })); // Gọi ngay với size mới
  };

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchCategories({ page: 1, search: value, size: pageSize })); // Thêm size vào đây
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
        <h1 className="text-2xl font-bold text-gray-900">Danh sách danh mục</h1>
        <NavLink
          to="/admin/categories/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Thêm danh mục mới
        </NavLink>
      </div>

      {/* Search by Name */}
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
          placeholder="Nhập tên danh mục..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Tên</th>
              {/* <th className="table-header">Mô tả</th>
              <th className="table-header">Ảnh</th> */}
              <th className="table-header">Trạng thái</th>
              <th className="table-header">Ngày tạo</th>
              <th className="table-header">Ngày cập nhật</th>
              <th className="table-header">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  {error}
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="table-cell px-6 py-4">{category.id}</td>
                  <td className="table-cell-bold px-6 py-4">{category.name}</td>
                  {/* <td className="table-cell px-6 py-4 max-w-[200px] truncate">
                    {category.description}
                  </td>
                  <td className="table-cell px-6 py-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td> */}
                  <td className="table-cell px-6 py-4">
                    <span className={category.active ? "status-active" : "status-inactive"}>
                      {category.active ? "Hiển thị" : "Ẩn"}
                    </span>
                  </td>
                  <td className="table-cell px-6 py-4">{category.createdDate}</td>
                  <td className="table-cell px-6 py-4">{category.updatedDate}</td>
                  <td className="table-cell px-6 py-4">
                    <div className="flex space-x-2">
                      <NavLink
                        to={`/admin/categories/edit/${category.id}`}
                        className="action-button p-1 rounded hover:bg-gray-100"
                        title="Chỉnh sửa"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </NavLink>
                      <button
                        onClick={() => openDeleteModal(category.id)}
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
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <PaginationItem
        length={categories.length}
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
                        Xóa danh mục
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="modal-content">
                          Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.
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

export default ListCategories;
