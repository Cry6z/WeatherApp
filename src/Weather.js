import React, { useState } from "react";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm, WiSunrise, WiSunset } from "react-icons/wi";
import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("");
  const [weathers, setWeathers] = useState([]); // array untuk banyak card
  const apiKey = "8c939d484ba40d0bc0bb5ad018e2723d"; // Ganti API Key OpenWeatherMap

  const addCityWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${apiKey}&units=metric`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod !== 200) {
        console.error(data.message || "Kota tidak ditemukan");
        return;
      }
      setWeathers((prev) => [...prev, data]); // tambah data ke array
      setCity(""); // reset input
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addCityWeather();
  };

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny size={80} color="#fde047" />;
      case "Clouds":
        return <WiCloud size={80} color="#cbd5f5" />;
      case "Rain":
        return <WiRain size={80} color="#38bdf8" />;
      case "Snow":
        return <WiSnow size={80} color="#e0f2fe" />;
      case "Thunderstorm":
        return <WiThunderstorm size={80} color="#facc15" />;
      default:
        return <WiDaySunny size={80} color="#fde047" />;
    }
  };

  return (
    <div className="weather-container">
      <p className="eyebrow">Realtime Forecast</p>
      <h1 className="app-title">Weather App</h1>
      <p className="app-subtitle">
        Dapatkan pembaruan cuaca terbaru dan pantau beberapa kota favoritmu secara
        bersamaan.
      </p>

      <form className="input-group" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Masukkan kota..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="Masukkan nama kota"
        />
        <button type="submit">Tambah Kota</button>
      </form>

      {weathers.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada kota yang ditambahkan. Mulai dengan mencari kota favoritmu.</p>
        </div>
      ) : (
        <div className="cards-container">
          {weathers.map((w, index) => {
            if (!w || !w.weather?.length || !w.main || !w.sys) {
              return null;
            }

            const condition = w.weather[0];

            return (
              <div key={w.id ?? index} className="weather-card">
                <div className="card-header">
                  <div>
                    <p className="card-label">Cuaca saat ini</p>
                    <h2>{w.name}</h2>
                  </div>
                  {getWeatherIcon(condition.main)}
                </div>
                <p className="temp">{Math.round(w.main.temp)}°C</p>
                <p className="desc">{condition.description}</p>

                <div className="weather-metrics">
                  <div>
                    <span>Kelembaban</span>
                    <strong>{w.main.humidity}%</strong>
                  </div>
                  <div>
                    <span>Angin</span>
                    <strong>{w.wind.speed} m/s</strong>
                  </div>
                  <div>
                    <span>Tekanan</span>
                    <strong>{w.main.pressure} hPa</strong>
                  </div>
                  {w.main.feels_like && (
                    <div>
                      <span>Feels like</span>
                      <strong>{Math.round(w.main.feels_like)}°C</strong>
                    </div>
                  )}
                </div>

                <div className="sun-times">
                  <p>
                    <WiSunrise /> Sunrise: {formatTime(w.sys.sunrise)}
                  </p>
                  <p>
                    <WiSunset /> Sunset: {formatTime(w.sys.sunset)}
                  </p>
                </div>

                {condition.main === "Rain" && <div className="rain"></div>}
                {condition.main === "Snow" && <div className="snow"></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Weather;
