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
        liquidation = entry * (1 - 1 / leverage);
      } else {
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
        profit = ((current - entry) / entry) * leverage * 100;
        profitAmount = (current - entry) * qty * leverage;
      } else {
        profit = ((entry - current) / entry) * leverage * 100;
        profitAmount = (entry - current) * qty * leverage;
      }
      
      setCalculatedProfitRate(profit);
      setCalculatedProfitAmount(profitAmount);
    }
  }, [currentPrice, entryPrice, leverage, quantity, positionType]);

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0">
        <div className={`absolute inset-0 transition-all duration-1000 ${
          positionType === "long" 
            ? "bg-gradient-to-br from-emerald-950 via-black to-black"
            : "bg-gradient-to-br from-rose-950 via-black to-black"
        }`}></div>
        <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] transition-all duration-1000 ${
          positionType === "long" ? "bg-emerald-500/20" : "bg-rose-500/20"
        }`}></div>
      </div>

      {/* Main Split Layout */}
      <div className="relative h-screen flex">
        
        {/* LEFT PANEL - Input Controls */}
        <div className="w-full lg:w-1/2 h-full flex flex-col p-8 lg:p-16 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                positionType === "long" ? "bg-emerald-400" : "bg-rose-400"
              }`}></div>
              <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">LEVERAGE CALCULATOR</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-3 leading-none">
              FUTURE<br/>
              <span className={`transition-colors duration-500 ${
                positionType === "long" ? "text-emerald-400" : "text-rose-400"
              }`}>CALC</span>
            </h1>
          </div>

          {/* Position Toggle */}
          <div className="mb-10">
            <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Position</div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPositionType("long")}
                className={`relative p-6 rounded-2xl border-4 transition-all duration-500 group ${
                  positionType === "long"
                    ? "bg-emerald-500/20 border-emerald-400 scale-105"
                    : "bg-white/5 border-white/10 hover:border-white/30 hover:scale-105"
                }`}
              >
                <div className="text-left">
                  <div className={`text-4xl font-black mb-1 transition-colors ${
                    positionType === "long" ? "text-emerald-400" : "text-white/30"
                  }`}>
                    LONG
                  </div>
                  <div className={`text-xs ${
                    positionType === "long" ? "text-emerald-300" : "text-white/30"
                  }`}>
                    상승 베팅 ↗
                  </div>
                </div>
              </button>
              <button
                onClick={() => setPositionType("short")}
                className={`relative p-6 rounded-2xl border-4 transition-all duration-500 group ${
                  positionType === "short"
                    ? "bg-rose-500/20 border-rose-400 scale-105"
                    : "bg-white/5 border-white/10 hover:border-white/30 hover:scale-105"
                }`}
              >
                <div className="text-right">
                  <div className={`text-4xl font-black mb-1 transition-colors ${
                    positionType === "short" ? "text-rose-400" : "text-white/30"
                  }`}>
                    SHORT
                  </div>
                  <div className={`text-xs ${
                    positionType === "short" ? "text-rose-300" : "text-white/30"
                  }`}>
                    하락 베팅 ↘
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Input Sections */}
          <div className="flex-1 space-y-6">
            
            {/* Entry Price */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/10 hover:border-white/30 transition-all">
              <div className="text-white/60 text-xs mb-3 uppercase tracking-wider">진입가 Entry Price</div>
              <input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent border-none text-5xl lg:text-6xl font-black text-white placeholder-white/20 focus:outline-none tabular-nums"
              />
            </div>

            {/* Quantity & Total */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/10 hover:border-white/30 transition-all">
                <div className="text-white/60 text-xs mb-3 uppercase tracking-wider">수량</div>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent border-none text-3xl font-black text-white placeholder-white/20 focus:outline-none tabular-nums"
                />
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/10 hover:border-white/30 transition-all">
                <div className="text-white/60 text-xs mb-3 uppercase tracking-wider">총 금액</div>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => handleTotalAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent border-none text-3xl font-black text-white placeholder-white/20 focus:outline-none tabular-nums"
                />
              </div>
            </div>

            {/* Leverage - Interactive */}
            <div className={`rounded-3xl p-6 border-2 transition-all ${
              positionType === "long"
                ? "bg-emerald-500/10 border-emerald-400/30"
                : "bg-rose-500/10 border-rose-400/30"
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="text-white/60 text-xs uppercase tracking-wider">레버리지</div>
                <div className={`text-5xl font-black tabular-nums ${
                  positionType === "long" ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {leverage}×
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="150"
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-2xl [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-black"
              />
              <div className="flex justify-between mt-3 text-white/30 text-[10px] font-bold">
                <span>1×</span>
                <span>25×</span>
                <span>50×</span>
                <span>75×</span>
                <span>100×</span>
                <span>125×</span>
                <span>150×</span>
              </div>
            </div>

            {/* Current Price */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-white/10 hover:border-white/30 transition-all">
              <div className="text-white/60 text-xs mb-3 uppercase tracking-wider">현재가 Current Price</div>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent border-none text-5xl lg:text-6xl font-black text-white placeholder-white/20 focus:outline-none tabular-nums"
              />
            </div>

          </div>

        </div>

        {/* RIGHT PANEL - Live Results */}
        <div className="hidden lg:flex w-1/2 h-full flex-col p-12 justify-center">
          
          {/* Results Container */}
          <div className="space-y-6">
            
            {/* Liquidation Price */}
            {entryPrice && (
              <div className="relative overflow-hidden rounded-3xl border-4 border-rose-400/40 bg-gradient-to-br from-rose-500/20 to-rose-600/20 backdrop-blur-xl p-8 transform transition-all duration-500 hover:scale-105">
                <div className="absolute -right-16 -top-16 text-[200px] font-black text-rose-400/5 leading-none select-none">
                  ⚠
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-rose-300/60 text-[10px] uppercase tracking-widest mb-1">Liquidation Price</div>
                      <div className="text-rose-300 text-xl font-bold">청산가</div>
                    </div>
                    <div className="px-4 py-1.5 bg-rose-500/30 border-2 border-rose-400/50 rounded-full text-rose-300 text-xs font-bold">
                      {positionType === "long" ? "↓ 하락" : "↑ 상승"}
                    </div>
                  </div>
                  <div className="text-[80px] font-black text-rose-300 leading-none mb-6 tabular-nums">
                    {liquidationPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-rose-500/20 border-2 border-rose-400/30 rounded-2xl p-4">
                      <div className="text-rose-300/60 text-[10px] mb-1">변동폭</div>
                      <div className="text-3xl font-black text-rose-300 tabular-nums">
                        {Math.abs(Number(entryPrice) - liquidationPrice).toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                    <div className="bg-rose-500/20 border-2 border-rose-400/30 rounded-2xl p-4">
                      <div className="text-rose-300/60 text-[10px] mb-1">비율</div>
                      <div className="text-3xl font-black text-rose-300 tabular-nums">
                        {(((liquidationPrice - Number(entryPrice)) / Number(entryPrice)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profit/Loss */}
            {currentPrice && entryPrice && (
              <div className={`relative overflow-hidden rounded-3xl border-4 backdrop-blur-xl p-8 transform transition-all duration-500 hover:scale-105 ${
                calculatedProfitRate >= 0
                  ? "border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20"
                  : "border-rose-400/40 bg-gradient-to-br from-rose-500/20 to-rose-600/20"
              }`}>
                <div className={`absolute -right-16 -top-16 text-[200px] font-black leading-none select-none ${
                  calculatedProfitRate >= 0 ? "text-emerald-400/5" : "text-rose-400/5"
                }`}>
                  {calculatedProfitRate >= 0 ? "↗" : "↘"}
                </div>
                <div className="relative">
                  <div className={`text-[10px] uppercase tracking-widest mb-1 ${
                    calculatedProfitRate >= 0 ? "text-emerald-300/60" : "text-rose-300/60"
                  }`}>
                    Profit & Loss
                  </div>
                  <div className={`text-xl font-bold mb-6 ${
                    calculatedProfitRate >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}>
                    수익률
                  </div>
                  <div className={`text-[90px] font-black leading-none mb-6 tabular-nums ${
                    calculatedProfitRate >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}>
                    {calculatedProfitRate >= 0 ? "+" : ""}{calculatedProfitRate.toFixed(1)}%
                  </div>
                  {quantity && Number(quantity) > 0 && (
                    <div className={`border-2 rounded-2xl p-5 ${
                      calculatedProfitAmount >= 0 
                        ? "bg-emerald-500/20 border-emerald-400/30" 
                        : "bg-rose-500/20 border-rose-400/30"
                    }`}>
                      <div className={`text-[10px] mb-2 ${
                        calculatedProfitAmount >= 0 ? "text-emerald-300/60" : "text-rose-300/60"
                      }`}>
                        예상 수익 금액
                      </div>
                      <div className={`text-4xl font-black tabular-nums ${
                        calculatedProfitAmount >= 0 ? "text-emerald-300" : "text-rose-300"
                      }`}>
                        {calculatedProfitAmount >= 0 ? "+" : ""}{calculatedProfitAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Note */}
            <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4">
              <p className="text-amber-300/70 text-xs font-mono leading-relaxed">
                <span className="text-amber-300 font-bold">! NOTE:</span> 실제 거래 시 수수료 및 자금조달비용이 추가로 발생할 수 있습니다.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;