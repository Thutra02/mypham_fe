"use client"

import { useMemo } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { RevenueReport } from "../types/report.types"
import formatCurrencyVND from "../utils/formatMoney"

interface RevenueChartProps {
  data: RevenueReport[]
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const chartData = useMemo(() => {
    return data
      .map((item) => ({
        name: monthNames[item.month - 1],
        totalRevenue: item.totalRevenue,
        discountedRevenue: item.totalDiscountedRevenue,
        month: item.month,
      }))
      .sort((a, b) => a.month - b.month)
  }, [data])


  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) =>
            // nếu số tiền lớn thì chuyển sang dạng K, M, B
            value > 999999999
              ? `${(value / 1000000000).toFixed(1)}B`
              : value > 999999
                ? `${(value / 1000000).toFixed(1)}M`
                : value > 999
                  ? `${(value / 1000).toFixed(1)}K`
                  : value

          } />
          <Tooltip formatter={(value) => formatCurrencyVND(value as number)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            name="Total Revenue"
            stroke="#4f46e5"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line type="monotone" dataKey="discountedRevenue" name="After Discounts" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart

