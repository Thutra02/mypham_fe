import { Dialog, Transition } from "@headlessui/react";
import { MapPinIcon, PencilSquareIcon, StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteAddress, fetchAddresses, setDefaultAddress } from "../../features/address/addressSlice";
import { AppDispatch, RootState } from "../../store";
import { Address } from "../../types";
import AddShippingAddress from "./AddShippingAddress";
import CommonLayout from "./CommonLayout";

const AccountBilling = () => {
  const dispatch: AppDispatch = useDispatch()
  const { addresses } = useSelector((state: RootState) => state.address)
  useEffect(() => {
    dispatch(fetchAddresses())
  }, [dispatch])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null)
  const [isAddressFormActive, setIsAddressFormActive] = useState(true)

  const openAddressDialog = (address?: Address) => {
    if (address) {
      setCurrentAddress(address)
    } else {
      setCurrentAddress(null)
    }
    setIsDialogOpen(true)
    setIsAddressFormActive(true)
  }

  const closeAddressDialog = () => {
    setIsDialogOpen(false)
    setIsAddressFormActive(false)
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      // await axios.delete(`/addresses/${id}`)
      await dispatch(deleteAddress(id)).unwrap()
      toast.success("Address deleted")
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete address")

    }
  }

  const handleSetDefaultAddress =async (id: number) => {
    try {
      await dispatch(setDefaultAddress(id)).unwrap()
      toast.success("Default address set")

    } catch (error) {
      console.log(error)
      toast.error("Failed to set default address")
    }
  }
  return (
    <div>
      <CommonLayout>
        <div className="space-y-10 sm:space-y-12">
          <h2 className="text-2xl sm:text-3xl font-semibold">Address</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-lg border border-gray-200 p-6 hover:border-gray-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                      onClick={() => openAddressDialog(address)}
                    >
                      <PencilSquareIcon className="mr-1 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="flex items-center text-sm text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <TrashIcon className="mr-1 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-900">{address.firstName + address.lastName}</p>
                  <p className="text-sm text-gray-500">{address.phone}</p>
                  <p className="text-sm text-gray-500">{address.streetAddress + ", " + address.city + ", " + address.state + " " + address.zipCode}</p>
                </div>

                <div className="mt-4">
                  {address.default ? (
                    <div className="flex items-center text-sm text-green-500">
                      <StarIcon className="mr-1 h-4 w-4" />
                      Default Address
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center text-sm text-gray-500 hover:text-green-500"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      <StarIcon className="mr-1 h-4 w-4" />
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
              <button className="flex flex-col items-center text-center" type="button" onClick={() => openAddressDialog()}>
                <MapPinIcon className="h-10 w-10 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">Add New Address</span>
              </button>
            </div>
          </div>

          {/* Address Dialog */}
          <Transition appear show={isDialogOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeAddressDialog}>
              <Transition.Child
                as={Fragment}
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
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {currentAddress ? "Edit Address" : "Add New Address"}
                      </Dialog.Title>

                      <div className="mt-4">
                        <AddShippingAddress
                          isActive={isAddressFormActive}
                          id={currentAddress?.id}
                          onCloseActive={closeAddressDialog}
                          onOpenActive={() => setIsAddressFormActive(true)}
                        />
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </CommonLayout>
    </div>
  );
};

export default AccountBilling;
