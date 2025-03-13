import { Dialog, Transition } from '@headlessui/react';
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContact, fetchContacts } from '../../../features/contact/contactSlice';
import { AppDispatch, RootState } from '../../../store';
import PaginationItem from '../PaginationItem';
import './ListContact.css'
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListContact = () => {
  const dispatch: AppDispatch = useDispatch();
  const { contacts, error, pagination } = useSelector((state: RootState) => state.contact);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(5);
  console.log("contact")
  useEffect(() => {
    dispatch(fetchContacts({ page: 1, search: searchName, size: pageSize }));
  }, [dispatch, pageSize]);

  const openDeleteModal = (id: number) => {
    setSelectedContactId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedContactId(null);
    setIsDeleteModalOpen(false);
  };

  const openDetailModal = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedContact(null);
    setIsDetailModalOpen(false);
  };

  const handleDeleteContact = async () => {
    if (selectedContactId !== null) {
      try {
        await dispatch(deleteContact(selectedContactId)).unwrap();
        toast.success('Xóa liên hệ thành công!');
        closeDeleteModal();
      } catch (error) {
        console.error(error);
        toast.error('Xóa liên hệ thất bại!');
      }
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchContacts({ page, search: searchName, size: pageSize }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    dispatch(fetchContacts({ page: 1, search: searchName, size: newSize }));
  };

  const debouncedSearch = debounce((value: string) => {
    dispatch(fetchContacts({ page: 1, search: value, size: pageSize }));
  }, 300);

  const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchName(value);
    debouncedSearch(value);
  };

  return (
    <div className="contact-list-container">
      {/* Header */}
      <div className="contact-header">
        <h1 className="contact-title">Danh Sách Liên Hệ</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          value={searchName}
          onChange={handleSearchName}
          placeholder="Tìm kiếm theo tên..."
          className="search-input"
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Tên</th>
              <th className="table-header">Email</th>
              <th className="table-header">Tin nhắn</th>
              <th className="table-header">Hành động</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {error ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  {error}
                </td>
              </tr>
            ) : contacts.length > 0 ? (
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell">{contact.id}</td>
                  <td className="table-cell-bold">{contact.name}</td>
                  <td className="table-cell">{contact.email}</td>
                  <td className="table-cell">
                    <span className="message-preview">
                      {contact.message}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openDetailModal(contact)}
                        className="action-button p-1 rounded hover:bg-gray-100"
                        title="Xem"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(contact.id)}
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
                <td colSpan={5} className="empty-state">
                  Không tìm thấy liên hệ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationItem
        length={contacts.length}
        pagination={pagination}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        handlePageChange={handlePageChange}
        classNames={classNames}
      />

    {/* Delete Modal */}
<Transition show={isDeleteModalOpen}>
  <Dialog onClose={closeDeleteModal} className="relative z-50">
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
      <div className="flex min-h-full items-center justify-center p-4 text-center">
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
            <button onClick={closeDeleteModal} className="modal-close-button">
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="modal-content-container">
              <h3 className="modal-title">Xác nhận xóa</h3>
              <p className="text-gray-600 text-sm mb-6">
                Bạn có chắc chắn muốn xóa liên hệ này? Hành động này không thể hoàn tác.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button onClick={closeDeleteModal} className="cancel-button">
                  Hủy
                </button>
                <button onClick={handleDeleteContact} className="confirm-button">
                  Xóa
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
</Transition>

{/* Detail Modal */}
<Transition show={isDetailModalOpen}>
        <Dialog onClose={closeDetailModal} className="relative z-50">
          <div className="modal-overlay" />
          <div className="modal-container">
            <div className="modal-panel">
              <button onClick={closeDetailModal} className="modal-close-button">
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              <div className="modal-content-container">
                <h3 className="modal-title">Chi tiết liên hệ</h3>
                
                {selectedContact && (
                  <div className="space-y-4">
                    <div className="modal-content-item">
                      <label className="modal-content-label">Tên</label>
                      <p className="modal-content-value">{selectedContact.name}</p>
                    </div>
                    
                    <div className="modal-content-item">
                      <label className="modal-content-label">Email</label>
                      <p className="modal-content-value">{selectedContact.email}</p>
                    </div>
                    
                    <div className="modal-content-item">
                      <label className="modal-content-label">Tin nhắn</label>
                      <p className="modal-content-value">{selectedContact.message}</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <button onClick={closeDetailModal} className="cancel-button">
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ListContact;