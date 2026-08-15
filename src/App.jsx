import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TbActivityHeartbeat,
  TbAlertTriangle,
  TbCalendarStats,
  TbCloud,
  TbCloudRain,
  TbDroplet,
  TbDroplets,
  TbEye,
  TbGauge,
  TbLoader2,
  TbLocation,
  TbMapPin,
  TbMist,
  TbMoon,
  TbMoonStars,
  TbNavigation,
  TbRefresh,
  TbSearch,
  TbSun,
  TbSunHigh,
  TbSunrise,
  TbSunset,
  TbTemperature,
  TbTemperatureMinus,
  TbTemperaturePlus,
  TbWind,
} from "react-icons/tb";
import Forecast from "./components/Forecast";
import HourlyChart from "./components/HourlyChart";
import RainEffect from "./components/RainEffect";
import SnowEffect from "./components/SnowEffect";
import SunlightEffect from "./components/SunlightEffect";
import WeatherIcon from "./components/WeatherIcon";
import { getWeather } from "./services/weatherApi";

const DEFAULT_LOCATION = "Goa";

const safeNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);

const round = (value, digits = 0) => {
  if (!safeNumber(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const formatValue = (value, suffix = "", digits = 0) => {
  if (!safeNumber(value)) return "--";
  return `${round(value, digits)}${suffix}`;
};

const calculateDewPoint = (tempC, humidity) => {
  if (!safeNumber(tempC) || !safeNumber(humidity) || humidity <= 0) return null;

  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100);

  return (b * alpha) / (a - alpha);
};

const calculateWindChill = (tempC, windKph) => {
  if (!safeNumber(tempC) || !safeNumber(windKph) || tempC > 10 || windKph <= 4.8) {
    return null;
  }

  return (
    13.12 +
    0.6215 * tempC -
    11.37 * windKph ** 0.16 +
    0.3965 * tempC * windKph ** 0.16
  );
};

const calculateHumidex = (tempC, dewPointC) => {
  if (!safeNumber(tempC) || !safeNumber(dewPointC) || tempC < 20) return null;

  const vaporPressure =
    6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (273.15 + dewPointC)));

  return tempC + 0.5555 * (vaporPressure - 10);
};

const aqiLabel = (index) => {
  const labels = {
    1: "Good",
    2: "Moderate",
    3: "Sensitive",
    4: "Unhealthy",
    5: "Very unhealthy",
    6: "Hazardous",
  };

  return labels[index] || "Unavailable";
};

const uvLabel = (uv) => {
  if (!safeNumber(uv)) return "Unavailable";
  if (uv < 3) return "Low";
  if (uv < 6) return "Moderate";
  if (uv < 8) return "High";
  if (uv < 11) return "Very high";
  return "Extreme";
};

const getBackground = (weather, darkMode) => {
  if (darkMode) {
    return "from-[#111827] via-[#172033] to-[#04111f]";
  }

  const condition = weather?.current?.condition?.text?.toLowerCase() || "";

  if (condition.includes("rain") || condition.includes("drizzle")) {
    return "from-[#49667a] via-[#33495c] to-[#17212c]";
  }

  if (condition.includes("snow") || condition.includes("sleet")) {
    return "from-[#dbeafe] via-[#f8fafc] to-[#bae6fd]";
  }

  if (condition.includes("cloud") || condition.includes("overcast")) {
    return "from-[#e5e7eb] via-[#cbd5e1] to-[#94a3b8]";
  }

  if (condition.includes("sun") || condition.includes("clear")) {
    return "from-[#fef3c7] via-[#fbbf24] to-[#38bdf8]";
  }

  return "from-[#dbeafe] via-[#a7f3d0] to-[#7dd3fc]";
};

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [titleLocation, setTitleLocation] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  const current = weather?.current;
  const forecastToday = weather?.forecast?.forecastday?.[0];
  const astro = forecastToday?.astro;
  const day = forecastToday?.day;
  const alerts = weather?.alerts?.alert || [];
  const cardStyle = darkMode
    ? "border-white/10 bg-white/10 text-white shadow-black/20"
    : "border-white/60 bg-white/45 text-slate-950 shadow-sky-900/10";
  const mutedText = darkMode ? "text-slate-300" : "text-slate-600";
  const panelRing = darkMode ? "ring-white/10" : "ring-white/60";

  const derived = useMemo(() => {
    if (!current) return {};

    const dewPoint =
      current.dewpoint_c ?? calculateDewPoint(current.temp_c, current.humidity);
    const windChill =
      current.windchill_c ?? calculateWindChill(current.temp_c, current.wind_kph);
    const humidex = calculateHumidex(current.temp_c, dewPoint);
    const comfort = current.feelslike_c ?? windChill ?? humidex;
    const airIndex = current.air_quality?.["us-epa-index"];

    return {
      airIndex,
      airLabel: aqiLabel(airIndex),
      comfort,
      dewPoint,
      windChill,
      humidex,
    };
  }, [current]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.title = titleLocation ? `Weatherly | ${titleLocation}` : "Weatherly";
  }, [titleLocation]);

  const loadWeather = useCallback(async (location, options = {}) => {
    const query = location?.trim?.() || location;
    if (!query) return false;

    setLoading(true);
    setError("");

    try {
      const data = await getWeather(query);
      setWeather(data);

      if (options.updateTitle) {
        setTitleLocation(data.location?.name || query);
      }

      return true;
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          "Could not load weather for that location.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        loadWeather(`${coords.latitude},${coords.longitude}`);
      },
      () => {
        loadWeather(DEFAULT_LOCATION);
      },
      { timeout: 7000 },
    );
  }, [loadWeather]);

  const handleSearch = async (event) => {
    event.preventDefault();

    const searched = await loadWeather(city, { updateTitle: true });
    if (searched) setCity("");
  };

  const metrics = [
    {
      icon: TbDroplet,
      label: "Humidity",
      value: formatValue(current?.humidity, "%"),
      hint: safeNumber(derived.dewPoint)
        ? `Dew point ${round(derived.dewPoint)} C`
        : "Dew point unavailable",
    },
    {
      icon: TbWind,
      label: "Wind",
      value: formatValue(current?.wind_kph, " km/h"),
      hint: `${current?.wind_dir || "--"} ${formatValue(current?.wind_degree, "")}`,
    },
    {
      icon: TbNavigation,
      label: "Gusts",
      value: formatValue(current?.gust_kph, " km/h"),
      hint: "Peak wind speed",
    },
    {
      icon: TbGauge,
      label: "Pressure",
      value: formatValue(current?.pressure_mb, " mb"),
      hint: "Sea-level pressure",
    },
    {
      icon: TbEye,
      label: "Visibility",
      value: formatValue(current?.vis_km, " km"),
      hint: safeNumber(current?.cloud) ? `${current.cloud}% cloud cover` : "Cloud data missing",
    },
    {
      icon: TbActivityHeartbeat,
      label: "AQI",
      value: safeNumber(derived.airIndex) ? derived.airIndex : "--",
      hint: derived.airLabel,
    },
    {
      icon: TbSunHigh,
      label: "UV Index",
      value: formatValue(current?.uv, ""),
      hint: uvLabel(current?.uv),
    },
    {
      icon: TbCloudRain,
      label: "Rain Chance",
      value: formatValue(day?.daily_chance_of_rain, "%"),
      hint: `${formatValue(day?.totalprecip_mm, " mm", 1)} expected`,
    },
    {
      icon: TbTemperature,
      label: "Feels Like",
      value: formatValue(derived.comfort, " C"),
      hint: derived.windChill
        ? "Calculated wind chill"
        : derived.humidex
          ? "Calculated humidex"
          : "API apparent temp",
    },
    {
      icon: TbDroplets,
      label: "Dew Point",
      value: formatValue(derived.dewPoint, " C"),
      hint: current?.dewpoint_c == null ? "Calculated from temp and humidity" : "Reported by API",
    },
    {
      icon: TbSunrise,
      label: "Sunrise",
      value: astro?.sunrise || "--",
      hint: `Sunset ${astro?.sunset || "--"}`,
    },
    {
      icon: TbMoonStars,
      label: "Moon",
      value: astro?.moon_phase || "--",
      hint: `Illumination ${astro?.moon_illumination || "--"}%`,
    },
  ];

  const bg = getBackground(weather, darkMode);
  const conditionText = current?.condition?.text?.toLowerCase() || "";
  const showSunlight =
    current?.is_day === 1 &&
    (conditionText.includes("sun") || conditionText.includes("clear"));

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${bg} px-4 py-5 text-slate-950 transition-colors duration-500 sm:px-6 lg:px-8`}
    >
      {(conditionText.includes("rain") || conditionText.includes("drizzle")) && (
        <RainEffect />
      )}

      {(conditionText.includes("snow") || conditionText.includes("sleet")) && (
        <SnowEffect />
      )}

      {showSunlight && <SunlightEffect />}

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/40 bg-white/30 p-4 shadow-2xl shadow-sky-950/10 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}>
              <TbMapPin className="text-lg" />
              Live Weather Forecast
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
              Weatherly
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => weather && loadWeather(weather.location.name)}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/50 bg-white/40 text-slate-900 shadow-lg shadow-sky-900/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/60"
              aria-label="Refresh weather"
              title="Refresh weather"
            >
              <TbRefresh className={loading ? "animate-spin text-xl" : "text-xl"} />
            </button>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/50 bg-white/40 text-slate-900 shadow-lg shadow-sky-900/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/60"
              aria-label="Toggle color mode"
              title="Toggle color mode"
            >
              {darkMode ? <TbMoon className="text-2xl" /> : <TbSun className="text-2xl" />}
            </button>
          </div>
        </header>

        <form
          onSubmit={handleSearch}
          className={`flex flex-col gap-3 rounded-[1.5rem] border p-3 shadow-2xl backdrop-blur-2xl sm:flex-row ${cardStyle}`}
        >
          <label className="relative flex-1">
            <TbLocation className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-500" />
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Search by city, state or country"
              className="h-14 w-full rounded-2xl border border-white/50 bg-white/75 pl-12 pr-4 text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-300/40"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <TbLoader2 className="animate-spin text-xl" /> : <TbSearch className="text-xl" />}
            Search
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 font-semibold text-red-700 shadow-lg">
            <TbAlertTriangle className="text-2xl" />
            {error}
          </div>
        )}

        {loading && !weather && (
          <section className={`grid min-h-[360px] place-items-center rounded-[2rem] border p-8 ${cardStyle}`}>
            <div className="text-center">
              <TbLoader2 className="mx-auto mb-4 animate-spin text-5xl" />
              <p className="text-xl font-bold">Fetching your forecast...</p>
            </div>
          </section>
        )}

        {weather && (
          <>
            <section
              className={`grid gap-6 rounded-[2rem] border p-5 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.05fr_1.4fr] ${cardStyle}`}
            >
              <div className="flex min-h-[360px] flex-col justify-between rounded-[1.5rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-sky-200">
                      <TbMapPin className="text-lg" />
                      {weather.location.region || weather.location.country}
                    </p>
                    <h2 className="mt-2 text-4xl font-black tracking-normal">
                      {weather.location.name}
                    </h2>
                    <p className="mt-1 text-slate-300">
                      Updated {current.last_updated}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-3">
                    <WeatherIcon
                      condition={current.condition.text}
                      isDay={current.is_day}
                      size={96}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-end gap-3">
                    <p className="text-7xl font-black leading-none sm:text-8xl">
                      {round(current.temp_c)}
                      <span className="text-4xl">&deg;C</span>
                    </p>
                    <p className="pb-3 text-lg font-semibold text-sky-200">
                      {current.condition.text}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <TbTemperatureMinus className="mb-2 text-2xl text-sky-200" />
                      <p className="text-sm text-slate-300">Low</p>
                      <p className="text-2xl font-black">{formatValue(day?.mintemp_c, " C")}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <TbTemperaturePlus className="mb-2 text-2xl text-amber-200" />
                      <p className="text-sm text-slate-300">High</p>
                      <p className="text-2xl font-black">{formatValue(day?.maxtemp_c, " C")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {metrics.map(({ icon: Icon, label, value, hint }) => (
                  <article
                    key={label}
                    className={`rounded-3xl border border-white/40 bg-white/35 p-4 shadow-lg backdrop-blur-xl ring-1 ${panelRing}`}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className={`text-sm font-semibold ${mutedText}`}>{label}</p>
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white">
                        <Icon className="text-xl" />
                      </span>
                    </div>
                    <p className="text-2xl font-black">{value}</p>
                    <p className={`mt-1 text-sm ${mutedText}`}>{hint}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <HourlyChart
                hourlyData={forecastToday.hour}
                darkMode={darkMode}
              />

              <aside className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur-2xl ${cardStyle}`}>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-black">Today</h2>
                  <TbCalendarStats className="text-3xl" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl bg-white/30 p-4">
                    <span className="flex items-center gap-2 font-semibold">
                      <TbSunrise className="text-xl" />
                      Sunrise
                    </span>
                    <strong>{astro?.sunrise || "--"}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/30 p-4">
                    <span className="flex items-center gap-2 font-semibold">
                      <TbSunset className="text-xl" />
                      Sunset
                    </span>
                    <strong>{astro?.sunset || "--"}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/30 p-4">
                    <span className="flex items-center gap-2 font-semibold">
                      <TbCloud className="text-xl" />
                      Avg humidity
                    </span>
                    <strong>{formatValue(day?.avghumidity, "%")}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/30 p-4">
                    <span className="flex items-center gap-2 font-semibold">
                      <TbMist className="text-xl" />
                      Snow
                    </span>
                    <strong>{formatValue(day?.totalsnow_cm, " cm", 1)}</strong>
                  </div>
                </div>

                {alerts.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
                    <p className="flex items-center gap-2 font-black">
                      <TbAlertTriangle className="text-xl" />
                      Weather alert
                    </p>
                    <p className="mt-1 text-sm font-semibold">{alerts[0].headline}</p>
                  </div>
                )}
              </aside>
            </section>

            <Forecast
              forecast={weather.forecast.forecastday}
              darkMode={darkMode}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default App;
