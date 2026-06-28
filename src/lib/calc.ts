export const TOTAL_ANIMALS = 10;
export const CO2_PER_KWH = 415; // g/kWh — 한국 전력 배출계수
export const MAX_DAYS = 5;

export const ANIMALS = ["🐻", "🦊", "🐰", "🦁", "🐨", "🐧", "🦋", "🐸", "🦅", "🐺"];

export const PRESETS = [
  { label: "LED 8W",     watt: 8  },
  { label: "형광등 14W", watt: 14 },
  { label: "백열등 60W", watt: 60 },
];

/** 전력량(kWh) 계산 */
export function calcKwh(watt: number, hours: number) {
  return (watt * hours) / 1000;
}

/** CO₂ 배출량(g) 계산 */
export function calcCo2(kwh: number) {
  return Math.round(kwh * CO2_PER_KWH);
}

/** 사라질 동물 수 (최대 10) */
export function calcLost(kwh: number) {
  return Math.min(TOTAL_ANIMALS, Math.floor(kwh / 0.05));
}

/** 남은 동물 수에 따른 피드백 */
export function getFeedback(remaining: number): { text: string; level: "good" | "warn" | "bad" | "dead" } {
  if (remaining === 0) return { text: "💀 당신의 전자기기 과사용으로 인해 동물들이 멸종해버렸습니다.", level: "dead" };
  if (remaining <= 3)  return { text: '😢 "친구들이 발전소의 이산화탄소 때문에 사라져버렸어…"',        level: "bad"  };
  if (remaining <= 7)  return { text: '😟 "조금 더 사용시간을 줄여줘!"',                               level: "warn" };
  return                      { text: '😊 "환경을 잘 지키고 있어! 고마워!"',                           level: "good" };
}
