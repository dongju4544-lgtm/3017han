"use client";

import { ANIMALS, TOTAL_ANIMALS, getFeedback } from "@/lib/calc";

interface ResultCardProps {
  kwh: number;
  co2: number;
  lost: number;
  dayCount: number;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
  complete: boolean;
}

const feedbackStyle = {
  good: "bg-green-50 text-green-800 border border-green-300",
  warn: "bg-yellow-50 text-yellow-800 border border-yellow-300",
  bad:  "bg-red-50  text-red-800   border border-red-300",
  dead: "bg-gray-900 text-gray-100 border border-gray-600",
};

export default function ResultCard({
  kwh, co2, lost, dayCount,
  onSave, onReset, saving, complete,
}: ResultCardProps) {
  const remaining = TOTAL_ANIMALS - lost;
  const fb = getFeedback(remaining);

  return (
    <div className="bg-white/90 rounded-2xl p-5 shadow-lg mb-4 backdrop-blur-sm animate-slide-up">
      <h2 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-1">📊 오늘의 환경 영향</h2>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <StatBox label="사용 전력량" value={kwh.toFixed(3)} unit="kWh" color="text-yellow-500" />
        <StatBox label="CO₂ 배출량" value={co2.toLocaleString()} unit="g" color="text-gray-500" />
        <StatBox label="사라진 동물" value={String(lost)} unit="마리" color="text-red-500" />
        <StatBox label="기록일" value={`${dayCount} / 5`} unit="일" color="text-green-600" />
      </div>

      {/* 동물 현황 */}
      <div className="bg-white rounded-xl p-3.5 mb-3 border border-gray-100">
        <p className="text-xs text-gray-400 mb-2">현재 남아있는 동물들</p>
        <div className="flex flex-wrap gap-1 min-h-[32px]">
          {ANIMALS.map((a, i) => (
            <span
              key={i}
              className="text-xl transition-opacity duration-300"
              style={{ opacity: i >= remaining ? 0.15 : 1, filter: i >= remaining ? "grayscale(1)" : "none" }}
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* 피드백 */}
      <div className={`rounded-xl px-4 py-3 text-sm font-semibold text-center leading-relaxed mb-3 ${feedbackStyle[fb.level]}`}>
        {fb.text}
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={onSave}
        disabled={saving || complete}
        className="w-full py-3 rounded-xl border-2 border-dashed border-green-500 text-green-600 font-bold text-sm mb-2 transition-all hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {complete ? "✅ 5일 기록 완료!" : saving ? "저장 중…" : "💾 오늘 기록 저장하기"}
      </button>

      {/* 초기화 버튼 */}
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-400 text-sm transition-all hover:bg-red-50 hover:text-red-400 hover:border-red-300"
      >
        🔄 처음부터 다시하기
      </button>
    </div>
  );
}

function StatBox({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400">{unit}</p>
    </div>
  );
}
