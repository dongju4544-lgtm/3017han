"use client";

import { DayRecord } from "@/lib/firestore";
import { TOTAL_ANIMALS } from "@/lib/calc";

interface HistoryCardProps {
  records: DayRecord[];
}

export default function HistoryCard({ records }: HistoryCardProps) {
  if (records.length === 0) return null;

  const maxKwh    = Math.max(...records.map((r) => r.kwh), 0.001);
  const totalKwh  = records.reduce((s, r) => s + r.kwh,  0);
  const totalCo2  = records.reduce((s, r) => s + r.co2,  0);
  const totalLost = Math.min(TOTAL_ANIMALS, records.reduce((s, r) => s + r.lost, 0));
  const remaining = TOTAL_ANIMALS - totalLost;

  let summaryMsg = "";
  if      (remaining <= 0) summaryMsg = "💀 생태계가 완전히 파괴되었습니다.";
  else if (remaining <= 3) summaryMsg = "⚠️ 생태계가 심각하게 위협받고 있습니다.";
  else if (remaining <= 7) summaryMsg = "😟 생태계가 점점 무너지고 있어요.";
  else                     summaryMsg = "😊 생태계가 비교적 잘 유지되고 있어요!";

  return (
    <div className="bg-white/90 rounded-2xl p-5 shadow-lg mb-4 backdrop-blur-sm">
      <h2 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-1">📅 5일 누적 기록</h2>

      {/* 일별 막대 */}
      <div className="space-y-2 mb-4">
        {records.map((r) => {
          const pct = Math.round((r.kwh / maxKwh) * 100);
          return (
            <div key={r.day} className="flex items-center gap-2.5 text-sm">
              <span className="font-bold text-green-700 min-w-[30px]">{r.day}일</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg,#4CAF50,#F44336)" }}
                />
              </div>
              <span className="text-xs text-gray-400 min-w-[90px] text-right leading-tight">
                {r.kwh.toFixed(3)}kWh<br />{r.co2.toLocaleString()}g CO₂
              </span>
            </div>
          );
        })}
      </div>

      {/* 요약 */}
      <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 text-sm text-orange-900 leading-relaxed">
        <p className="font-bold mb-1">📋 {records.length}일 누적 결과</p>
        <p>총 전력량: <strong className="text-orange-700">{totalKwh.toFixed(3)} kWh</strong></p>
        <p>총 CO₂ 배출: <strong className="text-orange-700">{totalCo2.toLocaleString()} g</strong></p>
        <p>처음 동물 수: <strong>10마리</strong></p>
        <p>사라진 동물: <strong className="text-red-600">{totalLost}마리</strong></p>
        <p>남은 동물: <strong className="text-green-700">{remaining}마리</strong></p>
        <p className="mt-2 font-semibold">{summaryMsg}</p>
      </div>
    </div>
  );
}
