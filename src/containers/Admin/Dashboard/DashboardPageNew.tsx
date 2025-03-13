"use client"

import { Menu } from "@headlessui/react"
import { ArrowDownIcon, ArrowUpIcon, DocumentTextIcon } from "@heroicons/react/24/outline"
import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import OrdersChart from "../../../components/OrdersChart"
import RevenueChart from "../../../components/RevenueChart"
import SummaryCards from "../../../components/SummaryCards"
import { fetchOrderStatusCounts, fetchReports } from '../../../features/report/reportSlice'
import { AppDispatch, RootState } from '../../../store'

const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  percent: number,
  index: number
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Types
interface StatCardProps {
  title: string
  value: string | number
  change: number
  icon?: React.ReactNode
  iconBgColor?: string
}



interface BrowserUsageProps {
  name: string
  company: string
  logo: string
  value: number
  change: number
  changeType: "increase" | "decrease"
}





const browsers: BrowserUsageProps[] = [
  {
    name: "Chrome",
    company: "Google, Inc.",
    logo: "/placeholder.svg?height=30&width=30",
    value: 35502,
    change: 12.75,
    changeType: "increase",
  },
  {
    name: "Edge",
    company: "Microsoft Corporation, Inc.",
    logo: "/placeholder.svg?height=30&width=30",
    value: 25364,
    change: 24.37,
    changeType: "decrease",
  },
  {
    name: "Firefox",
    company: "Mozilla Foundation, Inc.",
    logo: "/placeholder.svg?height=30&width=30",
    value: 14635,
    change: 15.63,
    changeType: "increase",
  },
]

// Chart data
const chartData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "sep", "oct", "nov", "dec"],
  orders: [42, 40, 55, 85, 58, 55, 65, 42, 22, 55, 75, 35],
  sales: [30, 25, 35, 55, 40, 35, 45, 30, 20, 45, 55, 25],
}



const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, iconBgColor }) => {
  const isPositive = change >= 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500">Last week</span>
            <span className={`ml-2 flex items-center text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
              {isPositive ? `+${change}` : change}
            </span>
          </div>
        </div>
        {icon && <div className={`p-3 rounded-full ${iconBgColor}`}>{icon}</div>}
      </div>
    </div>
  )
}

const BarChart: React.FC = () => {
  const maxValue = Math.max(...chartData.orders, ...chartData.sales)

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold border-l-4 border-emerald-500 pl-3">PROJECT BUDGET</h2>
        <Menu as="div" className="relative">
          <Menu.Button>
            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-1 z-10">
            <Menu.Item>
              {({ active }) => (
                <button className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm rounded-md`}>
                  Export as PDF
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button className={`${active ? "bg-gray-100" : ""} w-full text-left px-4 py-2 text-sm rounded-md`}>
                  Export as CSV
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      <div className="flex items-center mb-4">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-2"></div>
          <span className="text-sm">Total Orders</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 rounded-sm mr-2"></div>
          <span className="text-sm">Total Sales</span>
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute left-0 bottom-0 right-0 top-0">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>

          {/* Bars */}
          <div className="absolute left-8 right-0 bottom-6 top-0 flex">
            {chartData.months.map((month, index) => (
              <div key={month} className="flex-1 flex flex-col justify-end items-center">
                <div
                  className="w-5 bg-emerald-500 rounded-sm"
                  style={{ height: `${(chartData.orders[index] / maxValue) * 100}%` }}
                ></div>
                <div
                  className="w-5 bg-gray-200 rounded-sm mt-1"
                  style={{ height: `${(chartData.sales[index] / maxValue) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
const BrowserUsage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold border-l-4 border-emerald-500 pl-3 mb-6">BROWSER USAGE</h2>
      <div className="space-y-6">
        {browsers.map((browser, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={browser.logo || "/placeholder.svg"} alt={browser.name} className="w-8 h-8 mr-3" />
              <div>
                <p className="font-medium">{browser.name}</p>
                <p className="text-xs text-gray-500">{browser.company}</p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-semibold mr-3">{browser.value.toLocaleString()}</p>
              <span
                className={`flex items-center text-xs ${browser.changeType === "increase" ? "text-green-500" : "text-red-500"
                  }`}
              >
                {browser.changeType === "increase" ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {browser.change}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const DashboardPageNew: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()
  const { reports, orderStatusCounts } = useSelector((state: RootState) => state.report)
  // Extract available years from data
  useEffect(() => {
    dispatch(fetchReports(
      new Date().getFullYear()
    ))
  }, [dispatch])
  useEffect(() => {
    dispatch(fetchOrderStatusCounts())
  }, [dispatch])


  // Default to the most recent year
  const [selectedYear, setSelectedYear] = useState(
    availableYears.length > 0 ? availableYears[0] : new Date().getFullYear(),
  )

  // Filter data for the selected year and ensure all 12 months are represented
  const processedData = useMemo(() => {
    const filteredData = reports.filter((item) => item.year === selectedYear)

    // Create an array with all 12 months
    const allMonthsData = Array.from({ length: 12 }, (_, i) => {
      // Find data for this month if it exists
      const monthData = filteredData.find((item) => item.month === i + 1)

      // Return existing data or create empty data for the month
      return (
        monthData || {
          month: i + 1,
          year: selectedYear,
          totalRevenue: 0,
          totalDiscountedRevenue: 0,
          totalOrders: 0,
        }
      )
    })

    return allMonthsData
  }, [reports, selectedYear])

  // Calculate summary metrics for the selected year
  const yearSummary = useMemo(() => {
    return processedData.reduce(
      (acc, curr) => {
        return {
          totalRevenue: acc.totalRevenue + curr.totalRevenue,
          totalDiscountedRevenue: acc.totalDiscountedRevenue + curr.totalDiscountedRevenue,
          totalOrders: acc.totalOrders + curr.totalOrders,
        }
      },
      { totalRevenue: 0, totalDiscountedRevenue: 0, totalOrders: 0 },
    )
  }, [processedData])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Welcome Banner and Summary Cards */}
          <div className="space-y-6">
            {/* Welcome Banner */}

            {/* Stat Cards - 2x2 Grid */}
            <SummaryCards summary={yearSummary} />

            {/* Browser Usage Section */}
            <BrowserUsage />
          </div>

          {/* Right Column - Charts */}
          <div className="space-y-6">
            {/* Project Budget Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Xu hướng doanh thu</h2>
              <RevenueChart data={processedData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Đơn hàng hàng tháng</h2>
              <OrdersChart data={processedData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPageNew

