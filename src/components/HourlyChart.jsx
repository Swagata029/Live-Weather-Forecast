import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const HourlyChart = ({ hourlyData, darkMode }) => {
  const data = hourlyData.map((hour) => ({
    cloud: hour.cloud,
    feelsLike: Math.round(hour.feelslike_c),
    rain: hour.chance_of_rain,
    temp: Math.round(hour.temp_c),
    time: hour.time.split(" ")[1],
  }));

  const axisColor = darkMode ? "#cbd5e1" : "#475569";
  const gridColor = darkMode ? "rgba(255,255,255,.14)" : "rgba(15,23,42,.12)";
  const cardStyle = darkMode
    ? "border-white/10 bg-white/10 text-white"
    : "border-white/60 bg-white/45 text-slate-950";

  return (
    <section className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur-2xl ${cardStyle}`}>
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black">Hourly Outlook</h2>
          <p className={darkMode ? "text-sm font-semibold text-slate-300" : "text-sm font-semibold text-slate-600"}>
            Temperature, feels-like, and rain probability
          </p>
        </div>
        <div className="flex gap-3 text-xs font-bold">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Temp
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Rain
          </span>
        </div>
      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            minTickGap={20}
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 12, fontWeight: 700 }}
          />
          <YAxis
            yAxisId="temp"
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 12, fontWeight: 700 }}
            unit="C"
          />
          <YAxis
            yAxisId="rain"
            orientation="right"
            stroke={axisColor}
            tick={{ fill: axisColor, fontSize: 12, fontWeight: 700 }}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              background: darkMode ? "#0f172a" : "rgba(255,255,255,.95)",
              border: "1px solid rgba(148,163,184,.35)",
              borderRadius: "18px",
              boxShadow: "0 20px 45px rgba(15,23,42,.18)",
              color: darkMode ? "#fff" : "#0f172a",
            }}
            formatter={(value, name) => {
              if (name === "rain") return [`${value}%`, "Rain"];
              if (name === "feelsLike") return [`${value} C`, "Feels like"];
              if (name === "cloud") return [`${value}%`, "Cloud"];
              return [`${value} C`, "Temp"];
            }}
          />
          <Bar
            yAxisId="rain"
            dataKey="rain"
            fill="#38bdf8"
            opacity={0.35}
            radius={[8, 8, 0, 0]}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temp"
            stroke="#f59e0b"
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="feelsLike"
            stroke="#14b8a6"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
};

export default HourlyChart;
