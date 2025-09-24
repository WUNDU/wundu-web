'use client'
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

  const data = mockDataByTimeRange[timeRange];
  const transactions = isCredit ? mockCreditTransactions : mockTransactions;
  const headerAmount = isCredit ? 30000 : 100000;
  const headerText = isCredit ? 'Créditos nesta semana' : `Gastos neste mês`;
  const totalExpenses = transactions.reduce((sum, tx) => sum + (tx.amount > 0 ? 0 : Math.abs(tx.amount)), 0);

  return (
    <div className="min-h-screen bg-gray-200 p-4 font-sans">
      <Head>
        <title>Dashboard Financeiro</title>
      </Head>
      <div className='py-4'>
        <NavigationBack />
      </div>
      <div className=" mx-auto bg-gray-100 rounded-3xl shadow-xl overflow-hidden">
        {/* Top Bar */}
        <div className={`flex items-center p-4 ${viewMode === 'pie' ? 'justify-between' : 'justify-end '}`}>
          <div>
            <div className={`flex bg-blue-950 text-white space-x-2 p-1 rounded-2xl ${viewMode === 'pie' ? '' : 'hidden'} `}>
              <button className="flex items-center">
                <ChevronLeft />
              </button>
              <span className="font-semibold text-lg">{isCredit ? 'IMG' : 'Todos'}</span>
              <button className="flex items-center">
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="flex space-x-2  bg-gray-300 p-1 rounded-full">
            <button onClick={() => setViewMode('line')} className={`p-1 text-slate-950 rounded-full ${viewMode === 'line' ? 'bg-gray-900 text-white' : ''}`}>
              <ChartDataIcon />
            </button>
            <button onClick={() => setViewMode('pie')} className={`p-1 text-slate-950 rounded-full ${viewMode === 'pie' ? 'bg-gray-900 text-white' : ''}`}>
              <DonutChartIcon />
            </button>
            <button onClick={() => setViewMode('bar')} className={`p-1 text-slate-900 rounded-full ${viewMode === 'bar' ? 'bg-gray-900 text-white' : ''}`}>
              <BarChartIcon />
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className={`mx-4 p-6 bg-blue-950 text-white rounded-3xl shadow-lg ${viewMode === 'pie' ? 'hidden' : ''}`}>
          <div className="flex justify-center items-center mb-4">
            <div className='flex bg-gray-500 space-x-4 rounded-2xl'>
              <button className="flex items-center">
                <ChevronLeft />
              </button>
              <span className="font-semibold text-lg">{isCredit ? 'IMG' : 'Todos'}</span>
              <button className="flex items-center">
                <ChevronRight />
              </button>
            </div>
          </div>
          <p className="text-sm text-center">{headerText}</p>
          <h1 className="text-3xl font-bold text-center">{headerAmount.toLocaleString('pt-AO')},00KZ</h1>
        </div>

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
  );
};

export default ControlPanelDashboardScreen;
