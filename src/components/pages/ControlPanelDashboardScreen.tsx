'use client';

import React, { useState, useMemo } from 'react';
import { Tab } from '../atoms/Tab';
import LineChart from '../molecules/LineChart';
import PieChart from '../molecules/PieChart';
import Head from 'next/head';
import { TimeRange, TransactionProps, ViewMode } from '@/src/types/panel';
import { TransactionsList } from '../organisms/TransactionList';
import NavigationBack from '../atoms/NavigationBack';
import { BarChartIcon, ChartDataIcon, DonutChartIcon } from '@/src/constants/icons';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import HeaderSection from '../organisms/HeaderSection';
import GreetingHeader from '../molecules/GreetingHeader';
import Sidebar from '../molecules/Sidebar';
import SidebarRight from '../molecules/SideBarRight';
import { ArrowsLeftIcon } from '@/src/constants/icons';
import StatsSection from '../molecules/StatsSection';

// Fallback mock data for when no transactions are available
const mockDataByTimeRange = {
  '1D': [
    { month: '09:00', value: 15 },
    { month: '12:00', value: 25 },
    { month: '15:00', value: 20 },
    { month: '18:00', value: 30 },
    { month: '21:00', value: 22 },
  ],
  '1S': [
    { month: 'Seg', value: 30 },
    { month: 'Ter', value: 45 },
    { month: 'Qua', value: 60 },
    { month: 'Qui', value: 55 },
    { month: 'Sex', value: 70 },
    { month: 'Sáb', value: 35 },
    { month: 'Dom', value: 25 },
  ],
  '1M': [
    { month: 'S1', value: 120 },
    { month: 'S2', value: 145 },
    { month: 'S3', value: 160 },
    { month: 'S4', value: 155 },
  ],
  '6M': [
    { month: 'Jul', value: 75 },
    { month: 'Ago', value: 90 },
    { month: 'Set', value: 85 },
    { month: 'Out', value: 120 },
    { month: 'Nov', value: 110 },
    { month: 'Dez', value: 100 },
  ],
  '1A': [
    { month: 'Jan', value: 30 },
    { month: 'Fev', value: 45 },
    { month: 'Mar', value: 60 },
    { month: 'Abr', value: 55 },
    { month: 'Mai', value: 70 },
    { month: 'Jun', value: 80 },
    { month: 'Jul', value: 75 },
    { month: 'Ago', value: 90 },
    { month: 'Set', value: 85 },
    { month: 'Out', value: 120 },
    { month: 'Nov', value: 110 },
    { month: 'Dez', value: 100 },
  ],
};

// Base transactions with current timestamps for filtering
const baseTransactions: (TransactionProps & { timestamp: Date })[] = [
  {
    icon: { initials: 'T', color: 'white', bgColor: 'bg-blue-950' },
    title: 'Transporte',
    transactions: 5,
    amount: -11000,
    percentage: 55,
    timestamp: new Date(), // Today
  },
  {
    icon: { initials: 'S', color: 'black', bgColor: 'bg-yellow-400' },
    title: 'Saúde',
    transactions: 2,
    amount: -5000,
    percentage: 25,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  },
  {
    icon: { initials: 'L', color: 'white', bgColor: 'bg-green-400' },
    title: 'Lazer',
    transactions: 4,
    amount: -4000,
    percentage: 20,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    icon: { initials: 'A', color: 'white', bgColor: 'bg-red-500' },
    title: 'Alimentação',
    transactions: 8,
    amount: -8000,
    percentage: 40,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    icon: { initials: 'C', color: 'white', bgColor: 'bg-purple-500' },
    title: 'Compras',
    transactions: 3,
    amount: -6000,
    percentage: 30,
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    icon: { initials: 'E', color: 'white', bgColor: 'bg-indigo-500' },
    title: 'Educação',
    transactions: 2,
    amount: -3000,
    percentage: 15,
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    icon: { initials: 'U', color: 'white', bgColor: 'bg-orange-500' },
    title: 'Utilidades',
    transactions: 6,
    amount: -7000,
    percentage: 35,
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  },
  {
    icon: { initials: 'R', color: 'white', bgColor: 'bg-pink-500' },
    title: 'Restaurante',
    transactions: 3,
    amount: -2500,
    percentage: 12,
    timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  },
  {
    icon: { initials: 'G', color: 'white', bgColor: 'bg-teal-500' },
    title: 'Gasolina',
    transactions: 4,
    amount: -5500,
    percentage: 28,
    timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
  },
];

const baseCreditTransactions: (TransactionProps & { timestamp: Date })[] = [
  {
    icon: { initials: 'T', color: 'white', bgColor: 'bg-slate-950' },
    title: 'Transporte',
    transactions: 5,
    amount: -11000,
    percentage: 55,
    timestamp: new Date(),
  },
  {
    icon: { initials: 'S', color: 'black', bgColor: 'bg-yellow-400' },
    title: 'Saúde',
    transactions: 2,
    amount: -5000,
    percentage: 25,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    icon: { initials: 'R', color: 'white', bgColor: 'bg-green-500' },
    title: 'Recebido',
    transactions: 1,
    amount: +30000,
    percentage: 20,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const tabRanges = ['1D', '1S', '1M', '6M', '1A'] as TimeRange[];

const ControlPanelDashboardScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [isCredit, setIsCredit] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);

  // Filter transactions based on time range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const sourceTransactions = isCredit ? baseCreditTransactions : baseTransactions;

    let cutoffDate: Date;

    switch (timeRange) {
      case '1D':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '1S':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case '6M':
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '1A':
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filtered = sourceTransactions.filter(tx => tx.timestamp >= cutoffDate);

    // Recalculate percentages based on filtered data
    const totalFiltered = filtered.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return filtered.map(tx => ({
      ...tx,
      percentage: totalFiltered > 0 ? Math.round((Math.abs(tx.amount) / totalFiltered) * 100) : 0
    }));
  }, [timeRange, isCredit]);

  // Generate chart data based on filtered transactions - showing the same categories as PieChart
  const chartData = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return mockDataByTimeRange[timeRange];
    }

    // Create line chart data based on the transaction categories (same as PieChart)
    switch (timeRange) {
      case '1D': {
        // Show transactions by category for today with time distribution
        const hours = ['09:00', '12:00', '15:00', '18:00', '21:00'];
        return filteredTransactions.slice(0, Math.min(5, filteredTransactions.length)).map((tx, index) => ({
          month: hours[index] || `${9 + index * 3}:00`,
          value: Math.abs(tx.amount) / 1000 // Convert to K format
        }));
      }

      case '1S': {
        // Show transactions by category for this week
        const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        return filteredTransactions.slice(0, Math.min(7, filteredTransactions.length)).map((tx, index) => ({
          month: days[index] || days[index % days.length],
          value: Math.abs(tx.amount) / 1000
        }));
      }

      case '1M': {
        // Show transactions by category for this month (group into weeks if needed)
        if (filteredTransactions.length <= 4) {
          const weeks = ['S1', 'S2', 'S3', 'S4'];
          return filteredTransactions.map((tx, index) => ({
            month: weeks[index] || `S${index + 1}`,
            value: Math.abs(tx.amount) / 1000
          }));
        } else {
          // If more than 4 transactions, group by weeks
          const weeks = ['S1', 'S2', 'S3', 'S4'];
          return weeks.map((week, weekIndex) => {
            const weekTransactions = filteredTransactions.filter((_, txIndex) =>
              Math.floor(txIndex / (filteredTransactions.length / 4)) === weekIndex
            );
            const weekTotal = weekTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
            return {
              month: week,
              value: weekTotal / 1000
            };
          });
        }
      }

      case '6M': {
        // Show transactions by category for 6 months
        const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        if (filteredTransactions.length <= 6) {
          return filteredTransactions.map((tx, index) => ({
            month: months[index] || months[index % months.length],
            value: Math.abs(tx.amount) / 1000
          }));
        } else {
          // Group transactions by month
          return months.map((month, monthIndex) => {
            const monthTransactions = filteredTransactions.filter((_, txIndex) =>
              Math.floor(txIndex / (filteredTransactions.length / 6)) === monthIndex
            );
            const monthTotal = monthTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
            return {
              month,
              value: monthTotal / 1000
            };
          });
        }
      }

      case '1A': {
        // Show transactions by category for the year
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        if (filteredTransactions.length <= 12) {
          return filteredTransactions.map((tx, index) => ({
            month: months[index] || months[index % months.length],
            value: Math.abs(tx.amount) / 1000
          }));
        } else {
          // Group transactions by month
          return months.map((month, monthIndex) => {
            const monthTransactions = filteredTransactions.filter((_, txIndex) =>
              Math.floor(txIndex / (filteredTransactions.length / 12)) === monthIndex
            );
            const monthTotal = monthTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
            return {
              month,
              value: monthTotal / 1000
            };
          });
        }
      }

      default:
        return mockDataByTimeRange[timeRange];
    }
  }, [filteredTransactions, timeRange]);

  const data = chartData;
  const transactions = filteredTransactions;

  // Calculate totals based on filtered transactions
  const totalExpenses = transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? 0 : Math.abs(tx.amount)), 0);
  const totalIncome = transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);

  const headerAmount = isCredit ? totalIncome : totalExpenses;

  // Dynamic header text based on time range
  const getHeaderText = () => {
    const prefix = isCredit ? 'Créditos' : 'Gastos';
    switch (timeRange) {
      case '1D':
        return `${prefix} hoje`;
      case '1S':
        return `${prefix} nesta semana`;
      case '1M':
        return `${prefix} neste mês`;
      case '6M':
        return `${prefix} nos últimos 6 meses`;
      case '1A':
        return `${prefix} neste ano`;
      default:
        return `${prefix} neste período`;
    }
  };

  const headerText = getHeaderText();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarRight = () => {
    setIsSidebarRightOpen(!isSidebarRightOpen);
  };

  return (
    <>
      <Head>
        <title>Dashboard Financeiro</title>
      </Head>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gray-200 p-4 font-sans">
        <div className="py-4">
          <NavigationBack />
        </div>
        <div className="mx-auto bg-gray-100 rounded-3xl shadow-xl overflow-hidden">
          {/* Top Bar */}
          <div className={`flex items-center p-4 ${viewMode === 'pie' ? 'justify-between' : 'justify-end'}`}>
            <div>
              <div className={`flex bg-blue-950 text-white space-x-2 p-1 rounded-2xl ${viewMode === 'pie' ? '' : 'hidden'}`}>
                <button className="flex items-center">
                  <ChevronLeft />
                </button>
                <span className="font-semibold text-lg">{isCredit ? 'IMG' : 'Todos'}</span>
                <button className="flex items-center">
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="flex space-x-2 bg-gray-300 p-1 rounded-full">
              <button
                onClick={() => setViewMode('line')}
                className={`p-1 text-slate-950 rounded-full ${viewMode === 'line' ? 'bg-gray-900 text-white' : ''}`}
              >
                <ChartDataIcon />
              </button>
              <button
                onClick={() => setViewMode('pie')}
                className={`p-1 text-slate-950 rounded-full ${viewMode === 'pie' ? 'bg-gray-900 text-white' : ''}`}
              >
                <DonutChartIcon />
              </button>
              <button
                onClick={() => setViewMode('bar')}
                className={`p-1 text-slate-900 rounded-full ${viewMode === 'bar' ? 'bg-gray-900 text-white' : ''}`}
              >
                <BarChartIcon />
              </button>
            </div>
          </div>

          {/* Header Section */}
          <HeaderSection
            isCredit={isCredit}
            headerText={headerText}
            headerAmount={headerAmount}
            viewMode={viewMode}
          />

          {/* Chart Section */}
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">
              {viewMode === 'pie' ? 'Distribuição por Categoria' : `Despesas ${timeRange === '1D' ? 'Diárias' : timeRange === '1S' ? 'Semanais' : 'Mensais'}`}
            </h2>
            {viewMode === 'line' ? (
              <LineChart
                data={data}
                lineColor={isCredit ? '#10B981' : '#E05445'}
                dotColor={isCredit ? '#10B981' : '#E05445'}
              />
            ) : (
              <PieChart
                transactions={transactions}
                totalAmount={totalExpenses}
                timeRangeText={headerText}
              />
            )}
          </div>

          {/* Time Range Tabs */}
          <div className="flex justify-center p-2 bg-gray-200 rounded-full mx-4">
            {tabRanges.map(range => (
              <Tab
                key={range}
                label={range}
                value={range}
                isActive={timeRange === range}
                onClick={() => setTimeRange(range)}
              />
            ))}
          </div>

          {/* Transactions List */}
          <TransactionsList transactions={transactions} />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-gray-100 relative overflow-hidden font-sans antialiased text-gray-800">
        {/* Sidebar positioned absolutely */}
        <div
          className={`absolute left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <Sidebar />
        </div>

        {/* Main content with conditional margin for sidebar */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
            }`}
        >
          <GreetingHeader onToggleSidebar={toggleSidebarRight} />

          {/* Sidebar toggle button */}
          <button
            onClick={toggleSidebar}
            className={`fixed my-12 -translate-y-1/2 cursor-pointer z-40 transition-all duration-300 ${isSidebarOpen ? 'left-58' : 'left-0'
              }`}
          >
            <ArrowsLeftIcon
              className={`w-8 h-8 bg-blue-950 ml-2 p-2 rounded-full border border-blue-950 transform transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'
                }`}
            />
          </button>

          <main className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Stats Section */}
            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-3 gap-4">
              <HeaderSection
                isCredit={isCredit}
                headerText={headerText}
                headerAmount={headerAmount}
                viewMode={viewMode}
              />
              <div className='flex col-span-2'>
                <StatsSection totalFiles={transactions.length} totalProofs={0} totalImages={0} />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {/* Categories Section */}
              <div className="bg-white col-span-2 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Categorias ({headerText.toLowerCase()})</h3>
                  <ChevronDown />
                </div>
                <div className="space-y-4">
                  {transactions.length > 0 ? transactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${transaction.icon.bgColor} rounded-full flex items-center justify-center`}>
                          <span className={`text-sm font-semibold ${transaction.icon.color === 'white' ? 'text-white' : 'text-black'}`}>
                            {transaction.icon.initials}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.title}</p>
                          <p className="text-sm text-gray-500">{transaction.transactions} transações</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          KZ {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString('pt-AO')}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.percentage}%</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-8">Nenhuma transação encontrada para este período</p>
                  )}
                </div>
              </div>

              {/* Right Column - Chart and Controls */}
              <div className="col-span-3 space-y-1">
                {/* Chart Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-end">
                    <div className="flex space-x-2 bg-gray-300 p-1 rounded-full">
                      <button
                        onClick={() => setViewMode('line')}
                        className={`p-2 text-slate-950 rounded-full ${viewMode === 'line' ? 'bg-gray-900 text-white' : ''}`}
                      >
                        <ChartDataIcon />
                      </button>
                      <button
                        onClick={() => setViewMode('pie')}
                        className={`p-2 text-slate-950 rounded-full ${viewMode === 'pie' ? 'bg-gray-900 text-white' : ''}`}
                      >
                        <DonutChartIcon />
                      </button>
                      <button
                        onClick={() => setViewMode('bar')}
                        className={`p-2 text-slate-900 rounded-full ${viewMode === 'bar' ? 'bg-gray-900 text-white' : ''}`}
                      >
                        <BarChartIcon />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {viewMode === 'pie' ? 'Distribuição por Categoria' : `Despesas ${timeRange === '1D' ? 'Diárias' : timeRange === '1S' ? 'Semanais' : 'Mensais'}`}
                  </h3>
                  {viewMode === 'line' ? (
                    <LineChart
                      data={data}
                      lineColor={isCredit ? '#10B981' : '#E05445'}
                      dotColor={isCredit ? '#10B981' : '#E05445'}
                    />
                  ) : (
                    <PieChart
                      transactions={transactions}
                      totalAmount={totalExpenses}
                      timeRangeText={headerText}
                    />
                  )}

                  {/* Time Range Tabs */}
                  <div className="flex justify-center mt-6">
                    <div className="flex bg-gray-100 p-1 rounded-full">
                      {tabRanges.map(range => (
                        <Tab
                          key={range}
                          label={range}
                          value={range}
                          isActive={timeRange === range}
                          onClick={() => setTimeRange(range)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <SidebarRight isOpen={isSidebarRightOpen} onClose={toggleSidebarRight} />
      </div>
    </>
  );
};

export default ControlPanelDashboardScreen;