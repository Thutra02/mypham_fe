import type React from "react"
import formatCurrencyVND from "../utils/formatMoney"
import { CurrencyDollarIcon, ShoppingCartIcon, TrendingDownIcon } from "./Icons"

interface SummaryProps {
  summary: {
    totalRevenue: number
    totalDiscountedRevenue: number
    totalOrders: number
  }
}

interface StatCardProps {
  title: string
  value: React.ReactNode
  icon: React.ReactNode
  iconBgColor: string
  iconTextColor: string
  subtitle?: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBgColor, iconTextColor, subtitle }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center w-full">
      <div className="flex items-center flex-wrap gap-2">
        <div className={`p-3 rounded-full ${iconBgColor} ${iconTextColor}`}>{icon}</div>
        <div className="ml-4 flex-1">
          <p className="text-base font-semibold overflow-hidden text-ellipsis whitespace-nowrap w-full" title={title}>
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap w-full ProductCard__title">
            {value}
            {subtitle && <span className="text-sm text-gray-500 ml-1">{subtitle}</span>}
          </p>
        </div>
      </div>
    </div>


  )
}

const SummaryCards = ({ summary }: SummaryProps) => {
  const discountAmount = summary.totalRevenue - summary.totalDiscountedRevenue
  const discountPercentage = summary.totalRevenue > 0 ? ((discountAmount / summary.totalRevenue) * 100).toFixed(1) : "0"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        title="Tổng doanh thu"
        value={formatCurrencyVND(summary.totalRevenue)}
        icon={<CurrencyDollarIcon className="h-6 w-6" />}
        iconBgColor="bg-blue-100"
        iconTextColor="text-blue-600"
      />

      <StatCard
        title="Số tiền giảm"
        value={formatCurrencyVND(discountAmount)}
        subtitle={`(${discountPercentage}%)`}
        icon={<TrendingDownIcon className="h-6 w-6" />}
        iconBgColor="bg-green-100"
        iconTextColor="text-green-600"
      />

      <StatCard
        title="Tổng số đơn hàng"
        value={summary.totalOrders.toLocaleString()}
        icon={<ShoppingCartIcon className="h-6 w-6" />}
        iconBgColor="bg-purple-100"
        iconTextColor="text-purple-600"
      />
    </div>
  )
}

export default SummaryCards

