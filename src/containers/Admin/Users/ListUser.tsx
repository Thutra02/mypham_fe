import { Dialog, Transition } from '@headlessui/react';
import { LockClosedIcon, LockOpenIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { blockUser, fetchUsers } from '../../../features/users/userSlice';
import { AppDispatch, RootState } from '../../../store';
import PaginationItem from '../PaginationItem';
import "../Brand/ListBrand.css"; // Import CSS

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, error, pagination } = useSelector((state: RootState) => state.users);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(5);

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, search: searchName, size: pageSize }));
  }, [dispatch, pageSize]);

  const openLockModal = (id: number) => {
    setSelectedUserId(id);
    setIsLockModalOpen(true);
  };

  const closeLockModal = () => {
    setSelectedUserId(null);
    setIsLockModalOpen(false);
  };

  const handleLockToggle = async () => {
    if (selectedUserId !== null) {
      const user = users.find(user => user.id === selectedUserId);
      if (user) {
        try {
          await dispatch(blockUser(user.id)).unwrap();
          toast.success(user.locked ? 'Mở khóa người dùng thành công!' : 'Khóa người dùng thành công!');
          closeLockModal();
        } catch (error) {
          console.error(error);
          toast.error(user.locked ? 'Mở khóa người dùng thất bại!' : 'Khóa người dùng thất bại!');
        }
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({ page, search: searchName, size: pageSize }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchUsers({ page: 1, search: searchName, size: newSize }));
  };

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchUsers({ page: 1, search: value, size: pageSize }));
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
        <h1 className="text-2xl font-bold text-gray-900">Danh Sách Người Dùng</h1>

      </div>

      {/* Search by Name */}
      <div className="mb-6">
        <label htmlFor="nameSearch" className="block text-sm font-medium text-gray-700">
          Tìm kiếm theo Tên
        </label>
        <input
          type="text"
          id="nameSearch"
          value={searchName}
          onChange={handleSearchName}
          placeholder="Nhập tên người dùng..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Tên Người Dùng</th>
              <th className="table-header">Email</th>
              <th className="table-header">Vai Trò</th>
              <th className="table-header">Trạng Thái</th>
              <th className="table-header">Ngày Tạo</th>
              <th className="table-header">Ngày Cập Nhật</th>
              <th className="table-header">Hành Động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  {error}
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="table-cell px-6 py-4">{user.id}</td>
                  <td className="table-cell-bold px-6 py-4">{user.username}</td>
                  <td className="table-cell px-6 py-4">{user.email}</td>
                  <td className="table-cell px-6 py-4">{user.role}</td>
                  <td className="table-cell px-6 py-4">
                    <span className={user.locked ? "status-inactive" : "status-active"}>
                      {user.locked ? 'Đã Khóa' : 'Hoạt Động'}
                    </span>
                  </td>
                  <td className="table-cell px-6 py-4">{user.createdDate}</td>
                  <td className="table-cell px-6 py-4">{user.updatedDate}</td>
                  <td className="table-cell px-6 py-4">
                    <button
                      onClick={() => openLockModal(user.id)}
                      className="delete-button p-1 rounded hover:bg-gray-100"
                      title={user.locked ? "Mở Khóa" : "Khóa"}
                    >
                      {!user.locked ? (
                        <LockOpenIcon className="h-5 w-5" />
                      ) : (
                        <LockClosedIcon className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy người dùng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      
      <PaginationItem
        length={users.length}
        pagination={pagination}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        handlePageChange={handlePageChange}
        classNames={classNames}
      />

      {/* Lock/Unlock Confirmation Modal */}
      <Transition show={isLockModalOpen} as="div">
        <Dialog as="div" className="relative z-10" onClose={closeLockModal}>
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
                      onClick={closeLockModal}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title className="modal-title">
                        {users.find(user => user.id === selectedUserId)?.locked ? 'Mở Khóa Người Dùng' : 'Khóa Người Dùng'}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="modal-content">
                          Bạn có chắc chắn muốn {users.find(user => user.id === selectedUserId)?.locked ? 'mở khóa' : 'khóa'} người dùng này không?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="modal-action-button modal-confirm-button"
                      onClick={handleLockToggle}
                    >
                      {users.find(user => user.id === selectedUserId)?.locked ? 'Mở Khóa' : 'Khóa'}
                    </button>
                    <button
                      type="button"
                      className="modal-action-button modal-cancel-button"
                      onClick={closeLockModal}
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

export default ListUser;