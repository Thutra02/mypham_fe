"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { RevenueReport } from "../types/report.types"
 
interface OrdersChartProps {
  data: RevenueReport[]
}

const OrdersChart = ({ data }: OrdersChartProps) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const chartData = useMemo(() => {
    return data
      .map((item) => ({
        name: monthNames[item.month - 1],
        orders: item.totalOrders,
        month: item.month,
      }))
      .sort((a, b) => a.month - b.month)
  }, [data])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" name="Orders" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OrdersChart

