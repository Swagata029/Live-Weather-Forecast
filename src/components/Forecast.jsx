import {
  TbCloudRain,
  TbDroplet,
  TbTemperatureMinus,
  TbTemperaturePlus,
  TbWind,
} from "react-icons/tb";
import WeatherIcon from "./WeatherIcon";

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const Forecast = ({ forecast, darkMode }) => {
  const cardStyle = darkMode
    ? "border-white/10 bg-white/10 text-white"
    : "border-white/60 bg-white/45 text-slate-950";
  const mutedText = darkMode ? "text-slate-300" : "text-slate-600";

  return (
    <section className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur-2xl ${cardStyle}`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black">3-Day Forecast</h2>
        <span className={`text-sm font-semibold ${mutedText}`}>Daily outlook</span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {forecast.map((day) => (
          <article
            key={day.date}
            className="rounded-3xl border border-white/40 bg-white/35 p-4 shadow-lg backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-black">{formatDate(day.date)}</p>
                <p className={`text-sm font-semibold ${mutedText}`}>
                  {day.day.condition.text}
                </p>
              </div>
              <WeatherIcon
                condition={day.day.condition.text}
                size={64}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/30 p-3">
                <TbTemperaturePlus className="mb-1 text-xl" />
                <p className={`text-xs font-semibold ${mutedText}`}>High</p>
                <p className="text-lg font-black">{Math.round(day.day.maxtemp_c)}&deg;C</p>
              </div>
              <div className="rounded-2xl bg-white/30 p-3">
                <TbTemperatureMinus className="mb-1 text-xl" />
                <p className={`text-xs font-semibold ${mutedText}`}>Low</p>
                <p className="text-lg font-black">{Math.round(day.day.mintemp_c)}&deg;C</p>
              </div>
              <div className="rounded-2xl bg-white/30 p-3">
                <TbCloudRain className="mb-1 text-xl" />
                <p className={`text-xs font-semibold ${mutedText}`}>Rain</p>
                <p className="text-lg font-black">{day.day.daily_chance_of_rain ?? "--"}%</p>
              </div>
              <div className="rounded-2xl bg-white/30 p-3">
                <TbDroplet className="mb-1 text-xl" />
                <p className={`text-xs font-semibold ${mutedText}`}>Humidity</p>
                <p className="text-lg font-black">{day.day.avghumidity ?? "--"}%</p>
              </div>
            </div>

            <div className={`mt-4 flex items-center gap-2 text-sm font-semibold ${mutedText}`}>
              <TbWind className="text-lg" />
              Max wind {Math.round(day.day.maxwind_kph)} km/h
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Forecast;
