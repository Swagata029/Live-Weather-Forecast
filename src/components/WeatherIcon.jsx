import {
  WiCloudy,
  WiDayCloudy,
  WiDaySunny,
  WiFog,
  WiNightAltCloudy,
  WiNightClear,
  WiRain,
  WiRainMix,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

const WeatherIcon = ({ condition = "", isDay = 1, size = 160 }) => {
  const text = condition.toLowerCase();
  const iconClass = "drop-shadow-lg";

  if (text.includes("thunder")) {
    return <WiThunderstorm className={iconClass} size={size} />;
  }

  if (text.includes("snow") || text.includes("sleet") || text.includes("ice")) {
    return <WiSnow className={iconClass} size={size} />;
  }

  if (text.includes("rain") || text.includes("drizzle")) {
    return <WiRain className={iconClass} size={size} />;
  }

  if (text.includes("mist") || text.includes("fog") || text.includes("haze")) {
    return <WiFog className={iconClass} size={size} />;
  }

  if (text.includes("partly")) {
    return isDay ? (
      <WiDayCloudy className={iconClass} size={size} />
    ) : (
      <WiNightAltCloudy className={iconClass} size={size} />
    );
  }

  if (text.includes("cloud") || text.includes("overcast")) {
    return <WiCloudy className={iconClass} size={size} />;
  }

  if (text.includes("mix")) {
    return <WiRainMix className={iconClass} size={size} />;
  }

  return isDay ? (
    <WiDaySunny className={iconClass} size={size} />
  ) : (
    <WiNightClear className={iconClass} size={size} />
  );
};

export default WeatherIcon;
