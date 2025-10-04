"use client";

import React, { useState, useEffect } from "react";

const Home = () => {
  const [positionType, setPositionType] = useState<"long" | "short">("long");
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [leverage, setLeverage] = useState<number>(1);
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [calculatedProfitRate, setCalculatedProfitRate] = useState<number>(0);
  const [calculatedProfitAmount, setCalculatedProfitAmount] = useState<number>(0);

  // 구매가 * 수량 = 총 금액 자동 계산
  useEffect(() => {
    if (entryPrice && quantity && !isNaN(Number(entryPrice)) && !isNaN(Number(quantity))) {
      const entry = Number(entryPrice);
      const qty = Number(quantity);
      const total = entry * qty;
      setTotalAmount(total.toString());
    }
  }, [entryPrice, quantity]);

  // 총 금액 입력 시 수량 자동 계산
  const handleTotalAmountChange = (value: string) => {
    setTotalAmount(value);
    if (entryPrice && value && !isNaN(Number(entryPrice)) && !isNaN(Number(value))) {
      const entry = Number(entryPrice);
      const total = Number(value);
      const qty = total / entry;
      setQuantity(qty.toString());
    }
  };

  // 청산가 계산
  useEffect(() => {
    if (entryPrice && !isNaN(Number(entryPrice))) {
      const entry = Number(entryPrice);
      let liquidation;
      
      if (positionType === "long") {
        // 롱 포지션 청산가 = 진입가 * (1 - 1/레버리지)
        liquidation = entry * (1 - 1 / leverage);
      } else {
        // 숏 포지션 청산가 = 진입가 * (1 + 1/레버리지)
        liquidation = entry * (1 + 1 / leverage);
      }
      
      setLiquidationPrice(liquidation);
    }
  }, [entryPrice, leverage, positionType]);

  // 현재가 입력 시 수익률 계산
  useEffect(() => {
    if (currentPrice && entryPrice && !isNaN(Number(currentPrice)) && !isNaN(Number(entryPrice))) {
      const current = Number(currentPrice);
      const entry = Number(entryPrice);
      const qty = Number(quantity) || 0;
      
      let profit, profitAmount;
      
      if (positionType === "long") {
        // 롱: 가격 상승 시 수익
        // 수익률 = (현재가 - 진입가) / 진입가 * 레버리지 * 100
        profit = ((current - entry) / entry) * leverage * 100;
        // 수익 금액 = (현재가 - 진입가) * 수량 * 레버리지
        profitAmount = (current - entry) * qty * leverage;
      } else {
        // 숏: 가격 하락 시 수익
        // 수익률 = (진입가 - 현재가) / 진입가 * 레버리지 * 100
        profit = ((entry - current) / entry) * leverage * 100;
        // 수익 금액 = (진입가 - 현재가) * 수량 * 레버리지
        profitAmount = (entry - current) * qty * leverage;
      }
      
      setCalculatedProfitRate(profit);
      setCalculatedProfitAmount(profitAmount);
    }
  }, [currentPrice, entryPrice, leverage, quantity, positionType]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      {/* Main Container */}
      <div className="flex flex-col w-full max-w-7xl mx-auto p-6 gap-6">
        {/* Header */}
        <div className="flex items-center justify-center py-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            레버리지 계산기
          </h1>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/* Left Panel - Input Section */}
          <div className="flex flex-col flex-1 gap-6">
            {/* Position Type Card */}
            <div className="flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <label className="flex text-white/90 font-semibold text-sm mb-4 tracking-wide uppercase">
                포지션 타입
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setPositionType("long")}
                  className={`flex flex-1 items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                    positionType === "long"
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50 scale-[1.02]"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                  }`}
                >
                  <span className="text-2xl">📈</span>
                  <span>롱 (Long)</span>
                </button>
                <button
                  onClick={() => setPositionType("short")}
                  className={`flex flex-1 items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                    positionType === "short"
                      ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50 scale-[1.02]"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                  }`}
                >
                  <span className="text-2xl">📉</span>
                  <span>숏 (Short)</span>
                </button>
              </div>
            </div>

            {/* Price & Quantity Card */}
            <div className="flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl gap-6">
              <h2 className="flex text-white/90 font-semibold text-sm tracking-wide uppercase">
                진입 정보
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="flex text-white/70 text-xs font-medium mb-2 uppercase tracking-wider">
                    구매가 (진입가)
                  </label>
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    placeholder="0.00"
                    className="flex px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white text-lg font-semibold placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col flex-1">
                    <label className="flex text-white/70 text-xs font-medium mb-2 uppercase tracking-wider">
                      구매 개수
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0.00"
                      className="flex px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white text-lg font-semibold placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="flex text-white/70 text-xs font-medium mb-2 uppercase tracking-wider">
                      총 금액
                    </label>
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => handleTotalAmountChange(e.target.value)}
                      placeholder="0.00"
                      className="flex px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white text-lg font-semibold placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Leverage Card */}
            <div className="flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl gap-4">
              <div className="flex items-center justify-between gap-4">
                <label className="flex text-white/90 font-semibold text-sm tracking-wide uppercase">
                  레버리지
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={leverage}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= 150) {
                        setLeverage(val);
                      } else if (val > 150) {
                        setLeverage(150);
                      } else if (val < 1) {
                        setLeverage(1);
                      }
                    }}
                    className="flex w-20 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <span className="text-purple-300 font-bold text-lg">x</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="150"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="flex w-full h-2.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50"
              />
              <div className="flex justify-between text-white/40 text-xs font-medium">
                <span>1x</span>
                <span>50x</span>
                <span>100x</span>
                <span>150x</span>
              </div>
            </div>

            {/* Current Price Input Card */}
            <div className="flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl gap-4">
              <label className="flex text-white/90 font-semibold text-sm tracking-wide uppercase">
                현재가
              </label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="0.00"
                className="flex px-4 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white text-lg font-semibold placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Panel - Results Section */}
          <div className="flex flex-col flex-1 gap-6">
            {/* Liquidation Price Card */}
            {entryPrice && (
              <div className="flex flex-col bg-gradient-to-br from-red-500/10 to-rose-600/10 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30 shadow-2xl shadow-red-500/10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⚠️</span>
                  <h3 className="text-red-300 font-bold text-sm uppercase tracking-wider">청산가</h3>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-red-400">
                      {liquidationPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-lg">
                    <span className="text-white/60 text-sm">
                      {positionType === "long" ? "하락 포인트" : "상승 포인트"}:
                    </span>
                    <span className="font-bold text-red-300">
                      {Math.abs(Number(entryPrice) - liquidationPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-white/50 text-sm">
                      ({(((liquidationPrice - Number(entryPrice)) / Number(entryPrice)) * 100).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Profit/Loss Card */}
            {currentPrice && entryPrice && (
              <div className={`flex flex-col backdrop-blur-xl rounded-2xl p-6 border shadow-2xl ${
                calculatedProfitRate >= 0
                  ? "bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/30 shadow-green-500/10"
                  : "bg-gradient-to-br from-red-500/10 to-rose-600/10 border-red-500/30 shadow-red-500/10"
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{calculatedProfitRate >= 0 ? "📈" : "📉"}</span>
                  <h3 className={`font-bold text-sm uppercase tracking-wider ${
                    calculatedProfitRate >= 0 ? "text-green-300" : "text-red-300"
                  }`}>
                    수익률
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${
                      calculatedProfitRate >= 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      {calculatedProfitRate >= 0 ? "+" : ""}{calculatedProfitRate.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}%
                    </span>
                  </div>
                  {quantity && Number(quantity) > 0 && (
                    <div className={`flex flex-col gap-2 p-4 rounded-xl ${
                      calculatedProfitAmount >= 0 ? "bg-green-500/10" : "bg-red-500/10"
                    }`}>
                      <span className="text-white/60 text-xs uppercase tracking-wider">예상 수익 금액</span>
                      <span className={`text-2xl font-bold ${
                        calculatedProfitAmount >= 0 ? "text-green-300" : "text-red-300"
                      }`}>
                        {calculatedProfitAmount >= 0 ? "+" : ""}{calculatedProfitAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="flex flex-col bg-amber-500/5 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/20 shadow-xl">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p className="text-amber-200/80 text-sm leading-relaxed">
                  이 계산기는 참고용입니다. 실제 거래 시 거래소 수수료와 자금조달비용이 추가로 발생할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;