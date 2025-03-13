"use client"

import type React from "react"

import { RadioGroup } from "@headlessui/react"
import { StarIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useSearchParams } from "react-router"
import api from "../../api/api"
import { fetchProductById } from "../../features/product/productSlice"
import Button from "../../shared/Button/Button"
import type { AppDispatch, RootState } from "../../store"
import CommonLayout from "./CommonLayout"

// Assuming you have these actions in your Redux store
// If not, you'll need to create them

interface ReviewFormData {
    rating: number
    comment: string
}

const AccountOrderReview = () => {
    const { id } = useParams<{ id: string }>()
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get("orderId")

    const dispatch: AppDispatch = useDispatch()
    const navigate = useNavigate()

    const { product } = useSelector((state: RootState) => state.products)

    const [formData, setFormData] = useState<ReviewFormData>({
        rating: 5,
        comment: "",
    })

    const [submitAttempted, setSubmitAttempted] = useState(false)

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(Number(id)))
        }
    }, [dispatch, id])

    const handleRatingChange = (rating: number) => {
        setFormData((prev) => ({ ...prev, rating }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitAttempted(true)

        if (!formData.comment) {
            return
        }

        try {
            const response = await api.post("/api/reviews/add", {
                productId: Number(id),
                orderId: Number(orderId),
                star: formData.rating,
                review: formData.comment,
            });
            if (response.status === 200) {
                toast.success("Đánh giá của bạn đã được gửi")
                navigate(`/account-my-order/${orderId}`)
            } else {
                toast.error("Đánh giá của bạn chưa được gửi")
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Đánh giá của bạn chưa được gửi")
            console.error("Failed to submit review:", error)
        }
    }



    if (!product) {
        return <div className="px-6 py-4 text-center text-sm text-gray-500">Không tìm thấy sản phẩm</div>
    }

    return (
        <CommonLayout>
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Đánh giá sản phẩm</h2>
                        <p className="mt-1 text-sm text-gray-500">Chia sẻ trải nghiệm của bạn về sản phẩm này</p>
                    </div>

                    <div className="p-4 sm:p-6">
                        {/* Product info */}
                        <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                    src={product.productImages?.[0]?.image || "/placeholder.svg?height=80&width=80"}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {product.brand?.name} • {product.category?.name}
                                </p>
                            </div>
                        </div>

                        {/* Review form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</label>
                                <RadioGroup value={formData.rating} onChange={handleRatingChange} className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <RadioGroup.Option
                                            key={rating}
                                            value={rating}
                                            className={({ checked }) =>
                                                `cursor-pointer focus:outline-none ${checked ? "ring-2 ring-primary-500" : ""}`
                                            }
                                        >
                                            {({ checked }) => (
                                                <div className="flex items-center justify-center">
                                                    <StarIcon
                                                        className={`h-8 w-8 ${checked || formData.rating >= rating ? "text-yellow-400" : "text-gray-300"
                                                            }`}
                                                    />
                                                </div>
                                            )}
                                        </RadioGroup.Option>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Comment */}
                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                                    Chi tiết đánh giá
                                </label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    rows={4}
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    className={`block w-full rounded-md border ${submitAttempted && !formData.comment
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                                        } shadow-sm py-2 px-3 focus:outline-none focus:ring-1 sm:text-sm`}
                                    placeholder="Chia sẻ chi tiết trải nghiệm của bạn với sản phẩm này"
                                />
                                {submitAttempted && !formData.comment && (
                                    <p className="mt-1 text-sm text-red-600">Vui lòng nhập nội dung đánh giá</p>
                                )}
                            </div>

                            {/* Submit buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    onClick={() => navigate(`/account-my-order/${orderId}`)}
                                    className="text-gray-700 hover:text-gray-800"
                                >
                                    Hủy
                                </Button>

                                <Button type="submit" className="bg-primary-500 text-white hover:bg-primary-600">
                                    Gửi đánh giá
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </CommonLayout>
    )
}

export default AccountOrderReview

