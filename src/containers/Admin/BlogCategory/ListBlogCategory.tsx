import { Dialog, Transition } from '@headlessui/react';
import { PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { deleteBlogCategory, fetchBlogCategories } from '../../../features/blogCategory/blogCategorySlice';
import { AppDispatch, RootState } from '../../../store';
import PaginationItem from '../PaginationItem';


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListBlogCategory = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories, error, pagination } = useSelector((state: RootState) => state.blogCategories);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    dispatch(fetchBlogCategories({ page: 1, search: searchName, size: pageSize }));
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
        await dispatch(deleteBlogCategory(selectedCategoryId)).unwrap();
        toast.success('Xóa danh mục blog thành công!');
        closeDeleteModal();
        dispatch(fetchBlogCategories({ page: 1, search: searchName, size: pageSize })); // Cập nhật lại danh sách với pageSize hiện tại
      } catch (error:any) {
        console.error(error);
        toast.error(error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchBlogCategories({ page, search: searchName, size: pageSize })); // Thêm size vào đây
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchBlogCategories({ page: 1, search: searchName, size: newSize })); // Gọi ngay với size mới
  };

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchBlogCategories({ page: 1, search: value, size: pageSize })); // Thêm size vào đây
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
        <h1 className="text-2xl font-bold text-gray-900">Danh sách danh mục blog</h1>
        <NavLink
          to="/admin/blog-categories/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Thêm danh mục blog mới
        </NavLink>
      </div>

      {/* Search by Name */}
      <div className="mb-6">
        <label htmlFor="nameSearch" className="block text-sm font-medium text-gray-700">
          Tìm kiếm theo tên
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            id="nameSearch"
            value={searchName}
            onChange={handleSearchName}
            placeholder="Nhập tên danh mục..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2"
          />
          <div className="absolute left-3 top-2.5">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header px-6 py-3">ID</th>
              <th className="table-header px-6 py-3">Tên</th>
              <th className="table-header px-6 py-3">Mô tả</th>
              <th className="table-header px-6 py-3">Ngày tạo</th>
              <th className="table-header px-6 py-3">Ngày cập nhật</th>
              <th className="table-header px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  {error}
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="table-cell px-6 py-4">{category.id}</td>
                  <td className="table-cell-bold px-6 py-4">{category.name}</td>
                  <td className="table-cell px-6 py-4 max-w-[200px] truncate">
                    {category.description}
                  </td>
                  <td className="table-cell px-6 py-4">{category.createdDate}</td>
                  <td className="table-cell px-6 py-4">{category.updatedDate}</td>
                  <td className="table-cell px-6 py-4">
                    <div className="flex space-x-2">
                      
                      <NavLink
                         to={`/admin/blog-categories/edit/${category.id}`}
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
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No category found.
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
                    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                      Xóa danh mục blog
                    </Dialog.Title>
                    <button
                      onClick={closeDeleteModal}
                      className="text-gray-400 hover:text-gray-500 transition-colors" 
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa danh mục blog này không? Hành động này không thể hoàn tác.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
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

export default ListBlogCategory;