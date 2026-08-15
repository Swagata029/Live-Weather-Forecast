import WeatherIcon from "./WeatherIcon";

const WeatherCard = ({ weather }) => {
  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 text-center mt-8 shadow-lg">
      <h2 className="text-3xl font-bold">{weather.location.name}</h2>

      <p className="text-lg text-gray-200">{weather.location.country}</p>

      <div className="flex justify-center">
        <WeatherIcon condition={weather.current.condition.text} />
      </div>

      <h1 className="text-6xl font-bold">{weather.current.temp_c}°</h1>

      <p className="text-xl">{weather.current.condition.text}</p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="font-semibold">Humidity</p>
          <p>{weather.current.humidity}%</p>
        </div>

        <div>
          <p className="font-semibold">Wind</p>
          <p>{weather.current.wind_kph} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
