import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from "@heroicons/react/24/solid"
import type React from "react"
import { OrderStatus } from "../types/order.types"

interface OrderTimelineProps {
  status: OrderStatus
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const steps = [
    { id: "PENDING", name: "Đã đặt hàng", icon: ClockIcon, description: "Đơn hàng đã được tiếp nhận" },
    { id: "PROCESSING", name: "Đang xử lý", icon: ClockIcon, description: "Đơn hàng đang được chuẩn bị" },
    { id: "SHIPPED", name: "Đang giao hàng", icon: TruckIcon, description: "Đơn hàng đang được vận chuyển" },
    { id: "DELIVERED", name: "Đã giao hàng", icon: CheckCircleIcon, description: "Đơn hàng đã được giao thành công" },
  ]

  const getStepStatus = (stepId: string) => {
    if (status === OrderStatus.CANCELLED) {
      return "cancelled"
    }

    const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]
    const currentIndex = statusOrder.indexOf(status)
    const stepIndex = statusOrder.indexOf(stepId)

    if (stepIndex < currentIndex) {
      return "complete"
    } else if (stepIndex === currentIndex) {
      return "current"
    } else {
      return "upcoming"
    }
  }

  if (status === OrderStatus.CANCELLED) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="flex flex-col items-center text-center">
          <XCircleIcon className="h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Đơn hàng đã bị hủy</h3>
          <p className="mt-1 text-sm text-gray-500">Đơn hàng này đã bị hủy và không thể tiếp tục xử lý.</p>
        </div>
      </div>
    )
  }

  return (
    <nav aria-label="Order Progress">
      <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step) => {
          const stepStatus = getStepStatus(step.id)

          return (
            <li key={step.id} className="md:flex-1">
              <div
                className={`flex flex-col py-2 pl-4 border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 ${
                  stepStatus === "complete"
                    ? "border-blue-600"
                    : stepStatus === "current"
                      ? "border-blue-600"
                      : "border-gray-200"
                }`}
              >
                <span
                  className={`text-xs font-semibold tracking-wide uppercase ${
                    stepStatus === "complete"
                      ? "text-blue-600"
                      : stepStatus === "current"
                        ? "text-blue-600"
                        : "text-gray-500"
                  }`}
                >
                  {step.name}
                </span>
                <span className="text-sm font-medium">{step.description}</span>

                <div className="mt-1">
                  {stepStatus === "complete" && <CheckCircleIcon className="w-5 h-5 text-blue-600" />}
                  {stepStatus === "current" && <step.icon className="w-5 h-5 text-blue-600" />}
                  {stepStatus === "upcoming" && <step.icon className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default OrderTimeline

