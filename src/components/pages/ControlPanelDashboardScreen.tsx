'use client';

import React, { useState } from 'react';
import { Tab } from '../atoms/Tab';
import LineChart from '../molecules/LineChart';
import PieChart from '../molecules/PieChart';
import Head from 'next/head';
import { TimeRange, TransactionProps, ViewMode } from '@/src/types/panel';
import { TransactionsList } from '../organisms/TransactionList';
import NavigationBack from '../atoms/NavigationBack';
import { BarChartIcon, ChartDataIcon, DonutChartIcon } from '@/src/constants/icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeaderSection from '../organisms/HeaderSection';
import GreetingHeader from '../molecules/GreetingHeader';
import Sidebar from '../molecules/Sidebar';
import SidebarRight from '../molecules/SideBarRight';
import { ArrowsLeftIcon } from '@/src/constants/icons';
import StatsSection from '../molecules/StatsSection';

// Dados simulados
const mockDataByTimeRange = {
  '1D': [
    { month: 'Seg', value: 15 },
    { month: 'Ter', value: 25 },
    { month: 'Qua', value: 20 },
    { month: 'Qui', value: 30 },
    { month: 'Sex', value: 22 },
  ],
  '1S': [
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
  '1M': [
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
  '6M': [
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

const mockTransactions: TransactionProps[] = [
  {
    icon: { initials: 'T', color: 'white', bgColor: 'bg-blue-700' },
    title: 'Tranporte',
    transactions: 5,
    amount: -11000,
    percentage: 55,
  },
  {
    icon: { initials: 'S', color: 'black', bgColor: 'bg-yellow-500' },
    title: 'Saúde',
    transactions: 2,
    amount: -5000,
    percentage: 25,
  },
  {
    icon: { initials: 'L', color: 'white', bgColor: 'bg-green-500' },
    title: 'Laser',
    transactions: 4,
    amount: -4000,
    percentage: 20,
  },
];

const mockCreditTransactions: TransactionProps[] = [
  {
    icon: { initials: 'T', color: 'white', bgColor: 'bg-blue-700' },
    title: 'Tranporte',
    transactions: 5,
    amount: -11000,
    percentage: 55,
  },
  {
    icon: { initials: 'S', color: 'black', bgColor: 'bg-yellow-500' },
    title: 'Saúde',
    transactions: 2,
    amount: -5000,
    percentage: 25,
  },
  {
    icon: { initials: 'R', color: 'white', bgColor: 'bg-green-500' },
    title: 'Recebido',
    transactions: 1,
    amount: +30000,
    percentage: 20,
  },
];

const tabRanges = ['1D', '1S', '1M', '6M', '1A'] as TimeRange[];

const ControlPanelDashboardScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [isCredit, setIsCredit] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarRightOpen, setIsSidebarRightOpen] = useState(false);

  const data = mockDataByTimeRange[timeRange];
  const transactions = isCredit ? mockCreditTransactions : mockTransactions;
  const headerAmount = isCredit ? 30000 : 100000;
  const headerText = isCredit ? 'Créditos nesta semana' : `Gastos neste mês`;
  const totalExpenses = transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? 0 : Math.abs(tx.amount)), 0);

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
            <h2 className="text-xl font-bold text-gray-800">Despesas Mensais</h2>
            {viewMode === 'line' ? (
              <LineChart
                data={data}
                lineColor={isCredit ? '#10B981' : '#E05445'}
                dotColor={isCredit ? '#10B981' : '#E05445'}
                selectedMonth={isCredit ? 'Jun' : 'Mar'}
              />
            ) : (
              <PieChart transactions={transactions} totalAmount={totalExpenses} />
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
                <StatsSection totalFiles={0} totalProofs={0} totalImages={0} />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {/* Categories Section */}
              <div className="bg-white col-span-2 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Categorias</h3>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
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
                  ))}
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
                    {viewMode === 'pie' ? 'Distribuição por Categoria' : 'Despesas Mensais'}
                  </h3>
                  {viewMode === 'line' ? (
                    <LineChart
                      data={data}
                      lineColor={isCredit ? '#10B981' : '#E05445'}
                      dotColor={isCredit ? '#10B981' : '#E05445'}
                      selectedMonth={isCredit ? 'Jun' : 'Mar'}
                    />
                  ) : (
                    <PieChart transactions={transactions} totalAmount={totalExpenses} />
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