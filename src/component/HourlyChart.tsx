import type { HourlyItem, WeatherResponse } from "../types/weather";

type HourlyChartProps = {
  data: WeatherResponse | null;
  unit?: "C" | "F";
};
export default function HourlyChart({ data, unit = "C" }: HourlyChartProps) {

  const hourly: HourlyItem[] = (data?.hourly as HourlyItem[]) ?? [];
  if (!hourly || hourly.length === 0) return null;

  const points = hourly.slice(0, 24).map((h: HourlyItem, i: number) => {
    const t = h.temperature ?? h.temperature ?? 0;
    const temp = unit === "C" ? t : t * 1.8 + 32;
    return { x: i, y: temp };
  });

  const temps = points.map((p) => p.y);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = Math.max(1, max - min);

  const width = Math.min(700, Math.max(420, points.length * 28));
  const height = 200;

  const path = points
    .map((p, i) => {
      const x = (p.x / (points.length - 1)) * width;
      const y = height - ((p.y - min) / range) * (height - 20) - 10;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Hourly</h3>
      <div>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="160" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#g)" stroke="none" />
          <path d={path} fill="none" stroke="#60a5fa" strokeWidth={2} />

          {points.map((p, i) => {
            const x = (p.x / (points.length - 1)) * width;
            const y = height - ((p.y - min) / range) * (height - 20) - 10;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={2.5} fill="#fff" />
                <text x={x} y={height - 2} fontSize={10} fill="#cbd5e1" textAnchor="middle">
                  {i % 3 === 0 ? `${i}h` : ''}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
