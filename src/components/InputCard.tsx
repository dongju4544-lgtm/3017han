"use client";

import { PRESETS } from "@/lib/calc";

interface InputCardProps {
  userId: string;
  watt: string;
  hours: string;
  onUserIdChange: (v: string) => void;
  onWattChange: (v: string) => void;
  onHoursChange: (v: string) => void;
  onCalculate: () => void;
  onLoadHistory: () => void;
  loading: boolean;
}

export default function InputCard({
  userId, watt, hours,
  onUserIdChange, onWattChange, onHoursChange,
  onCalculate, onLoadHistory, loading,
}: InputCardProps) {
  return (
    <div className="bg-white/90 rounded-2xl p-5 shadow-lg mb-4 backdrop-blur-sm">
      {/* 학생 정보 */}
      <h2 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-1">👤 학생 이름 / 번호</h2>
      <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-green-50 rounded-xl border border-green-200">
        <span className="text-xs text-gray-500 min-w-[56px]">이름·번호</span>
        <input
          className="flex-1 bg-transparent text-sm outline-none text-gray-800"
          placeholder="예: 홍길동_3반_12번"
          maxLength={30}
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
        />
        <button
          onClick={onLoadHistory}
          disabled={loading}
          className="text-xs px-2.5 py-1 rounded-full bg-green-500 text-white font-semibold disabled:opacity-50 hover:bg-green-600 transition-colors"
        >
          {loading ? "불러오는 중…" : "기록 불러오기"}
        </button>
      </div>

      {/* 전등 종류 */}
      <h2 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-1">🔌 오늘의 전등 사용 입력</h2>
      <p className="text-xs text-gray-400 mb-2">전등 종류 선택</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.watt}
            onClick={() => onWattChange(String(p.watt))}
            className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
              watt === String(p.watt)
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-gray-500 border-green-200 hover:border-green-400"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => onWattChange("")}
          className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
            !PRESETS.some((p) => String(p.watt) === watt)
              ? "bg-green-500 text-white border-green-500"
              : "bg-white text-gray-500 border-green-200 hover:border-green-400"
          }`}
        >
          직접입력
        </button>
      </div>

      {/* 소비 전력 */}
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm text-gray-500 font-medium min-w-[78px]">소비 전력</label>
        <input
          type="number"
          className="flex-1 px-3 py-2.5 border border-green-200 rounded-xl text-sm outline-none focus:border-green-500 transition-colors bg-white"
          placeholder="예: 8"
          min={1}
          max={2000}
          value={watt}
          onChange={(e) => onWattChange(e.target.value)}
        />
        <span className="text-xs text-gray-400 min-w-[20px]">W</span>
      </div>

      {/* 사용 시간 */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-500 font-medium min-w-[78px]">사용 시간</label>
        <input
          type="number"
          className="flex-1 px-3 py-2.5 border border-green-200 rounded-xl text-sm outline-none focus:border-green-500 transition-colors bg-white"
          placeholder="예: 6"
          min={0.1}
          max={24}
          step={0.5}
          value={hours}
          onChange={(e) => onHoursChange(e.target.value)}
        />
        <span className="text-xs text-gray-400 min-w-[20px]">시간</span>
      </div>

      {/* 계산 버튼 */}
      <button
        onClick={onCalculate}
        className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all hover:-translate-y-0.5 active:scale-95"
        style={{ background: "linear-gradient(135deg,#4CAF50,#2E7D32)", boxShadow: "0 4px 12px rgba(76,175,80,0.38)" }}
      >
        🌍 환경 영향 확인하기
      </button>
      <p className="text-xs text-gray-300 text-center mt-2">
        전력량(kWh) = 소비전력(W) × 사용시간(h) ÷ 1000
      </p>
    </div>
  );
}
