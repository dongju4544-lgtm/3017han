"use client";

import { ANIMALS, TOTAL_ANIMALS } from "@/lib/calc";

interface SceneProps {
  co2: number;
  lostCount: number;
  lightOn: boolean;
  dying: boolean[]; // 각 동물이 죽어가는 중인지
}

export default function Scene({ co2, lostCount, lightOn, dying }: SceneProps) {
  const polluted = co2 > 200;

  return (
    <div
      className="relative w-full overflow-hidden transition-all duration-[1500ms]"
      style={{
        height: 300,
        background: polluted
          ? "linear-gradient(180deg,#8C8C8C 0%,#B8B8B8 50%,#9E9E72 78%,#7A8A4A 100%)"
          : "linear-gradient(180deg,#C8E8F8 0%,#E8F4FD 55%,#B5DFA6 78%,#5A9E4A 100%)",
      }}
    >
      {/* CO2 HUD */}
      <div
        className={`absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-xs font-bold text-white transition-colors duration-500 ${
          polluted ? "bg-red-600/80" : "bg-black/50"
        }`}
      >
        CO₂: {co2.toLocaleString()}g
      </div>

      {/* 태양 */}
      <div
        className={`absolute rounded-full transition-all duration-[1500ms] ${polluted ? "opacity-25 grayscale" : "opacity-100"}`}
        style={{
          top: 18, right: 55,
          width: 64, height: 64,
          background: "#F5C842",
          boxShadow: "0 0 36px rgba(245,200,66,0.55)",
        }}
      />

      {/* 구름 */}
      {[
        { w: 78, h: 27, top: 26, left: 85 },
        { w: 48, h: 18, top: 20, left: 150 },
        { w: 58, h: 20, top: 48, right: 155 },
      ].map((c, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-white transition-all duration-[1500ms] ${polluted ? "opacity-15 grayscale" : "opacity-80"}`}
          style={{ width: c.w, height: c.h, top: c.top, left: c.left, right: (c as any).right }}
        />
      ))}

      {/* 발전소 */}
      <PowerPlant smoking={lostCount > 0} />

      {/* 집 */}
      <House lightOn={lightOn} />

      {/* 동물들 */}
      <div
        className="absolute flex flex-wrap items-end gap-1"
        style={{ bottom: 58, left: 120, right: 150 }}
      >
        {ANIMALS.map((a, i) => (
          <span
            key={i}
            className={`text-2xl leading-none select-none drop-shadow-sm ${
              dying[i] ? "animate-fade-out" : "animate-breathe"
            }`}
            style={{ animationDelay: `${i * 0.28}s` }}
          >
            {a}
          </span>
        ))}
      </div>

      {/* 잔디 */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-[1500ms] ${polluted ? "brightness-75 saturate-[0.3]" : ""}`}
        style={{
          height: 60,
          background: "linear-gradient(180deg,#7EC76B 0%,#5A9E4A 50%,#8B6240 100%)",
        }}
      />
    </div>
  );
}

/* ─── 발전소 ─── */
function PowerPlant({ smoking }: { smoking: boolean }) {
  return (
    <div className="absolute" style={{ bottom: 56, left: 28, width: 70, height: 90 }}>
      {/* 본체 */}
      <div className="absolute rounded-t bg-gray-500" style={{ bottom: 0, left: 10, width: 50, height: 68 }} />
      {/* 굴뚝 1 */}
      <div className="absolute overflow-visible rounded-t bg-gray-600" style={{ bottom: 58, left: 13, width: 14, height: 38 }}>
        {!smoking ? null : (
          <div
            className="absolute rounded-full animate-rise bg-gray-600/50"
            style={{ width: 12, height: 12, bottom: 36, left: 1 }}
          />
        )}
      </div>
      {/* 굴뚝 2 */}
      <div className="absolute overflow-visible rounded-t bg-gray-600" style={{ bottom: 58, left: 38, width: 14, height: 30 }}>
        {!smoking ? null : (
          <div
            className="absolute rounded-full animate-rise bg-gray-600/50"
            style={{ width: 10, height: 10, bottom: 28, left: 1, animationDelay: "1.1s" }}
          />
        )}
      </div>
    </div>
  );
}

/* ─── 집 ─── */
function House({ lightOn }: { lightOn: boolean }) {
  return (
    <div className="absolute" style={{ bottom: 56, right: 55, width: 80, height: 80 }}>
      {/* 지붕 */}
      <div
        className="absolute"
        style={{
          bottom: 48, left: 0,
          width: 0, height: 0,
          borderLeft: "40px solid transparent",
          borderRight: "40px solid transparent",
          borderBottom: "34px solid #C0392B",
        }}
      />
      {/* 벽 */}
      <div className="absolute rounded-sm" style={{ bottom: 0, left: 8, width: 64, height: 50, background: "#E8D5B0" }}>
        {/* 왼쪽 창문 */}
        <div
          className={`absolute border-2 border-yellow-600/60 rounded-sm transition-all duration-500 ${
            lightOn ? "animate-glow" : ""
          }`}
          style={{
            bottom: 20, left: 8, width: 16, height: 14,
            background: lightOn ? "#FFEE44" : "#C8C8C8",
            boxShadow: lightOn ? "0 0 10px 3px rgba(255,230,50,0.7)" : "none",
          }}
        />
        {/* 오른쪽 창문 */}
        <div
          className={`absolute border-2 border-yellow-600/60 rounded-sm transition-all duration-500 ${
            lightOn ? "animate-glow" : ""
          }`}
          style={{
            bottom: 20, right: 8, width: 16, height: 14,
            background: lightOn ? "#FFEE44" : "#C8C8C8",
            boxShadow: lightOn ? "0 0 10px 3px rgba(255,230,50,0.7)" : "none",
          }}
        />
        {/* 문 */}
        <div
          className="absolute rounded-t-full"
          style={{ bottom: 0, left: "50%", transform: "translateX(-50%)", width: 18, height: 28, background: "#8B6240" }}
        />
      </div>
    </div>
  );
}
