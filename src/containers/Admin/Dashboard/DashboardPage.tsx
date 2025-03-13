import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Cell, Pie, PieChart } from "recharts"
import OrdersChart from '../../../components/OrdersChart'
import RevenueChart from '../../../components/RevenueChart'
import SummaryCards from '../../../components/SummaryCards'
import { fetchOrderStatusCounts, fetchReports } from '../../../features/report/reportSlice'
import { AppDispatch, RootState } from '../../../store'

const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ 
  cx, 
  cy, 
  midAngle, 
  innerRadius, 
  outerRadius, 
  percent 
}: {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  percent: number,
  index: number
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-bold pointer-events-none"
      style={{
        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DashboardPage = () => {
  const dispatch: AppDispatch = useDispatch()
  const { reports, orderStatusCounts } = useSelector((state: RootState) => state.report)
  const [selectedYear, setSelectedYear] = useState(availableYears[0])

  useEffect(() => {
    dispatch(fetchReports(new Date().getFullYear()))
    dispatch(fetchOrderStatusCounts())
  }, [dispatch])

  const processedData = useMemo(() => {
    const filteredData = reports.filter((item) => item.year === selectedYear)
    return Array.from({ length: 12 }, (_, i) => {
      const monthData = filteredData.find((item) => item.month === i + 1)
      return monthData || {
        month: i + 1,
        year: selectedYear,
        totalRevenue: 0,
        totalDiscountedRevenue: 0,
        totalOrders: 0,
      }
    })
  }, [reports, selectedYear])

  const yearSummary = useMemo(() => {
    return processedData.reduce(
      (acc, curr) => ({
        totalRevenue: acc.totalRevenue + curr.totalRevenue,
        totalDiscountedRevenue: acc.totalDiscountedRevenue + curr.totalDiscountedRevenue,
        totalOrders: acc.totalOrders + curr.totalOrders,
      }),
      { totalRevenue: 0, totalDiscountedRevenue: 0, totalOrders: 0 },
    )
  }, [processedData])

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>

        <div className="w-full sm:w-64">
          <Listbox value={selectedYear} onChange={setSelectedYear}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-indigo-600 py-3 pl-4 pr-10 text-left text-white shadow-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-all duration-200">
                <span className="block truncate font-medium">Year: {selectedYear}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon className="h-5 w-5 text-indigo-100 transition-transform" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-2 w-full overflow-auto rounded-lg bg-white py-2 shadow-xl ring-1 ring-black/5 focus:outline-none z-10">
                  {availableYears.map((year) => (
                    <Listbox.Option
                      key={year}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors ${
                          active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                        }`
                      }
                      value={year}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                            {year}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Grid chính */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hàng 1 - Dashboard Analytics & Order Status */}
        <div className="space-y-6">
          <SummaryCards summary={yearSummary} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all hover:shadow-xl group">
  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
    <span className="mr-2">📦</span>
    Order Status Distribution
  </h2>
  
  <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
    <div className="relative">
      <PieChart width={320} height={320}>
      <Pie
  data={orderStatusCounts}
  cx="50%"
  cy="50%"
  startAngle={90}
  endAngle={-270}
  outerRadius={140}
  innerRadius={0}
  paddingAngle={0} // Loại bỏ khoảng cách giữa các phần
  dataKey="orderCount"
  animationDuration={500}
>
  {orderStatusCounts.map((status, index) => (
    <Cell 
      key={`cell-${status.status}`}
      fill={COLORS[index % COLORS.length]}
      stroke="none" // Bỏ đường viền
    />
  ))}
</Pie>
        
        {/* Center text */}
        <text 
          x="50%" 
          y="50%" 
          textAnchor="middle" 
          dominantBaseline="middle"
          className="text-3xl font-bold text-gray-800"
        >
          {orderStatusCounts.reduce((sum, item) => sum + item.orderCount, 0)}
          <tspan className="block text-sm font-medium text-gray-500 mt-1">Total Orders</tspan>
        </text>
      </PieChart>
    </div>

    <div className="w-full max-w-[280px] space-y-3">
      {orderStatusCounts.map((status, index) => {
        const total = orderStatusCounts.reduce((sum, item) => sum + item.orderCount, 0)
        const percent = ((status.orderCount / total) * 100 || 0).toFixed(1)
        
        return (
          <div 
            key={status.status} 
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
            onMouseEnter={() => document.querySelectorAll(`.recharts-pie-sector`)[index]?.classList.add('opacity-90')}
            onMouseLeave={() => document.querySelectorAll(`.recharts-pie-sector`)[index]?.classList.remove('opacity-90')}
          >
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3 shadow-md border-2 border-white"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium text-gray-700 capitalize">
                {status.status.replace(/_/g, ' ')}
              </span>
            </div>
            
            <div className="text-right">
              <span className="block text-sm font-semibold text-gray-900">
                {status.orderCount}
              </span>
              <span className="block text-xs font-medium text-gray-500">
                {percent}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  </div>
</div>

        {/* Hàng 2 - Revenue Trend & Monthly Orders */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <RevenueChart data={processedData} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Orders</h2>
          <OrdersChart data={processedData} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage