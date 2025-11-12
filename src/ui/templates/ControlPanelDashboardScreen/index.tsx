"use client";

import React from "react";
import { Tab } from "@/ui/atoms/Tab";
import LineChart from "@/ui/molecules/LineChart";
import PieChart from "@/ui/molecules/PieChart";
import { TransactionsList } from "@/ui/organisms/TransactionList";
import {
  BarChartIcon,
  ChartDataIcon,
  DonutChartIcon,
} from "@/constants/icons";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import HeaderSection from "@/ui/organisms/HeaderSection";
import { GreetingHeader } from "@/ui/molecules";
import SidebarRight from "@/ui/molecules/SideBarRight";
import { StatsSection } from "@/ui/molecules";
import { BottomNavigation } from "@/ui/organisms";
import {
  tabRanges,
} from "@/constants/mockData";
import { useControlPanelDashboard } from "@/hooks/dashboard/useControlPanelDashboard";

const ControlPanelDashboardScreen: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    timeRange,
    setTimeRange,
    isCredit,
    isSidebarOpen,
    toggleSidebar,
    isSidebarRightOpen,
    toggleSidebarRight,
    transactions,
    chartData,
    headerAmount,
    headerText,
    totalExpenses,
  } = useControlPanelDashboard();

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gray-200 p-2 font-sans">
        {/* <div className="py-4">
          <NavigationBack />
        </div> */}
        <div className="mx-auto bg-gray-100 rounded-3xl shadow-xl overflow-hidden pb-15">
          {/* Top Bar */}
          <div
            className={`flex items-center p-4 ${
              viewMode === "pie" ? "justify-between" : "justify-end"
            }`}
          >
            <div>
              <div
                className={`flex bg-blue-950 text-white space-x-2 p-1 rounded-2xl ${
                  viewMode === "pie" ? "" : "hidden"
                }`}
              >
                <button className="flex items-center">
                  <ChevronLeft />
                </button>
                <span className="font-semibold text-lg">
                  {isCredit ? "IMG" : "Todos"}
                </span>
                <button className="flex items-center">
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="flex space-x-2 bg-gray-300 p-1 rounded-full">
              <button
                onClick={() => setViewMode("line")}
                className={`p-1 text-slate-950 rounded-full ${
                  viewMode === "line" ? "bg-gray-900 text-white" : ""
                }`}
              >
                <ChartDataIcon />
              </button>
              <button
                onClick={() => setViewMode("pie")}
                className={`p-1 text-slate-950 rounded-full ${
                  viewMode === "pie" ? "bg-gray-900 text-white" : ""
                }`}
              >
                <DonutChartIcon />
              </button>
              <button
                onClick={() => setViewMode("bar")}
                className={`p-1 text-slate-900 rounded-full ${
                  viewMode === "bar" ? "bg-gray-900 text-white" : ""
                }`}
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
              {viewMode === "pie"
                ? "Distribuição por Categoria"
                : `Despesas ${
                    timeRange === "1D"
                      ? "Diárias"
                      : timeRange === "1S"
                      ? "Semanais"
                      : "Mensais"
                  }`}
            </h2>
            <div className="w-full h-[300px]">
              {viewMode === "line" ? (
                <LineChart
                  className="w-full h-full"
                  data={chartData}
                  lineColor={isCredit ? "#10B981" : "#E05445"}
                  dotColor={isCredit ? "#10B981" : "#E05445"}
                />
              ) : (
                <PieChart
                  className="w-full h-full"
                  transactions={transactions}
                  totalAmount={totalExpenses}
                  timeRangeText={headerText}
                />
              )}
            </div>
          </div>

          {/* Time Range Tabs */}
          <div className="flex justify-center p-2 bg-gray-200 rounded-full mx-4">
            {tabRanges.map((range) => (
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
        <BottomNavigation />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-gray-100 relative overflow-hidden font-sans antialiased text-gray-800">
        {/* Main content with conditional margin for sidebar */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
            isSidebarOpen ? "" : "md:ml-0"
          }`}
        >
          <GreetingHeader onToggleSidebar={toggleSidebarRight} />

          <main className="p-6 space-y-6 flex-1 flex flex-col overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
              <HeaderSection
                isCredit={isCredit}
                headerText={headerText}
                headerAmount={headerAmount}
                viewMode={viewMode}
              />
              <div className="flex col-span-2">
                <StatsSection
                  totalFiles={transactions.length}
                  totalProofs={0}
                  totalImages={0}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-row gap-4 items-start">
              {/* Categories Section */}
              <div className="bg-white basis-2/5 flex-shrink-0 rounded-2xl p-6 shadow-sm overflow-y-auto max-h-full">
                <div className="flex items-center justify-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Categorias ({headerText.toLowerCase()})
                  </h3>
                  <ChevronDown />
                </div>
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 ${transaction.icon.bgColor} rounded-full flex items-center justify-center`}
                          >
                            <span
                              className={`text-sm font-semibold ${
                                transaction.icon.color === "white"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            >
                              {transaction.icon.initials}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {transaction.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.transactions} transações
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            KZ {transaction.amount > 0 ? "+" : ""}
                            {Math.abs(transaction.amount).toLocaleString(
                              "pt-AO"
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.percentage}%
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Nenhuma transação encontrada para este período
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Chart and Controls */}
              <div className="flex-1 h-full">
                {/* Chart Section */}
                <div className="bg-white flex flex-col h-full rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-end">
                    <div className="flex space-x-2 bg-gray-300 p-1 rounded-full">
                      <button
                        onClick={() => setViewMode("line")}
                        className={`p-2 text-slate-950 rounded-full ${
                          viewMode === "line" ? "bg-gray-900 text-white" : ""
                        }`}
                      >
                        <ChartDataIcon />
                      </button>
                      <button
                        onClick={() => setViewMode("pie")}
                        className={`p-2 text-slate-950 rounded-full ${
                          viewMode === "pie" ? "bg-gray-900 text-white" : ""
                        }`}
                      >
                        <DonutChartIcon />
                      </button>
                      <button
                        onClick={() => setViewMode("bar")}
                        className={`p-2 text-slate-900 rounded-full ${
                          viewMode === "bar" ? "bg-gray-900 text-white" : ""
                        }`}
                      >
                        <BarChartIcon />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {viewMode === "pie"
                        ? "Distribuição por Categoria"
                        : `Despesas ${
                            timeRange === "1D"
                              ? "Diárias"
                              : timeRange === "1S"
                              ? "Semanais"
                              : "Mensais"
                          }`}
                    </h3>
                    <div className="flex-1 w-full h-full">
                      {viewMode === "line" ? (
                        <LineChart
                          className="w-full h-full"
                          data={chartData}
                          lineColor={isCredit ? "#10B981" : "#E05445"}
                          dotColor={isCredit ? "#10B981" : "#E05445"}
                        />
                      ) : (
                        <PieChart
                          className="w-full h-full"
                          transactions={transactions}
                          totalAmount={totalExpenses}
                          timeRangeText={headerText}
                        />
                      )}
                    </div>
                  </div>

                  {/* Time Range Tabs */}
                  <div className="flex justify-center">
                    <div className="flex bg-gray-100 p-1 rounded-full">
                      {tabRanges.map((range) => (
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
        <SidebarRight
          isOpen={isSidebarRightOpen}
          onClose={toggleSidebarRight}
        />
      </div>
    </>
  );
};

export default ControlPanelDashboardScreen;
