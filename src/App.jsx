import { useState, useEffect } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { 
  Search, Sun, Moon, Cloud, CloudSun, CloudMoon, 
  CloudRain, CloudLightning, CloudSnow, CloudFog, Droplets
} from 'lucide-react';
import './App.css';

const WeatherIcon = ({ code, size = 24, className = "" }) => {
  const props = { size, className, strokeWidth: 1.5 };
  switch (code) {
    case '01d': return <Sun {...props} />;
    case '01n': return <Moon {...props} />;
    case '02d': return <CloudSun {...props} />;
    case '02n': return <CloudMoon {...props} />;
    case '03d': case '03n': case '04d': case '04n': return <Cloud {...props} />;
    case '09d': case '09n': case '10d': case '10n': return <CloudRain {...props} />;
    case '11d': case '11n': return <CloudLightning {...props} />;
    case '13d': case '13n': return <CloudSnow {...props} />;
    case '50d': case '50n': return <CloudFog {...props} />;
    default: return <Sun {...props} />;
  }
};

function App() {
  const [city, setCity] = useState('Naogaon');
  const [searchQuery, setSearchQuery] = useState('Naogaon');
  const [weatherData, setWeatherData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [activeTab, setActiveTab] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 

  useEffect(() => {
    const fetchWeatherAndForecast = async () => {
      if (!searchQuery) return;
      setLoading(true);
      setError(null);

      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=${API_KEY}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&units=metric&appid=${API_KEY}`)
        ]);

        if (!weatherRes.ok || !forecastRes.ok) throw new Error('City not found.');

        const currentData = await weatherRes.json();
        const forecastRawData = await forecastRes.json();

        const dailyGroups = {};
        
        forecastRawData.list.forEach(item => {
          const date = new Date(item.dt * 1000);
          const dayString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          // SAFE FALLBACK: If pop doesn't exist, default to 0
          const popPct = item.pop ? Math.round(item.pop * 100) : 0; 
          
          if (!dailyGroups[dayString]) {
            dailyGroups[dayString] = {
              tabLabel: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
              fullDate: dayString,
              min: item.main.temp_min,
              max: item.main.temp_max,
              icon: item.weather[0].icon,
              hourly: [] 
            };
          } else {
            dailyGroups[dayString].min = Math.min(dailyGroups[dayString].min, item.main.temp_min);
            dailyGroups[dayString].max = Math.max(dailyGroups[dayString].max, item.main.temp_max);
            if (date.getHours() === 12) dailyGroups[dayString].icon = item.weather[0].icon;
          }

          dailyGroups[dayString].hourly.push({
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(item.main.temp),
            icon: item.weather[0].icon,
            pop: popPct
          });
        });

        const dailyArray = Object.values(dailyGroups).slice(0, 6);

        setWeatherData(currentData);
        setDailyForecast(dailyArray);
        setActiveTab(0); 

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndForecast();
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(city);
  };

  // Format date exactly like the Google widget (e.g., "Thursday 4:00 AM")
  const currentDate = new Date().toLocaleTimeString('en-US', { 
    weekday: 'long', 
    hour: 'numeric', 
    minute: '2-digit' 
  });

  return (
    <div className="md3-app">
      
      <div className="hero-section">
        <header className="md3-top-bar">
          <form onSubmit={handleSearch} className="md3-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search by city..."
            />
          </form>
        </header>

        {loading && <p className="status-indicator">Fetching data...</p>}
        {error && <p className="status-indicator error">{error}</p>}

        {weatherData && dailyForecast.length > 0 && !loading && !error && (
          <div className="hero-content">
            
            {/* GOOGLE STYLE HEADER REPLACEMENT */}
            <div className="google-style-header">
              
              <div className="google-header-left">
                <WeatherIcon code={weatherData.weather[0].icon} size={84} className="google-main-icon" />
                <div className="google-temp-block">
                  <span className="google-huge-temp">{Math.round(weatherData.main.temp)}</span>
                  <div className="google-temp-units">
                    <span className="active-unit">°C</span> <span className="inactive-unit">| °F</span>
                  </div>
                </div>
                <div className="google-quick-stats">
                  <p>Precipitation: {dailyForecast[0]?.hourly[0]?.pop || 0}%</p>
                  <p>Humidity: {weatherData.main.humidity}%</p>
                  <p>Wind: {Math.round(weatherData.wind.speed * 3.6)} km/h</p>
                </div>
              </div>

             <div className="google-header-right">
                <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                <p>{currentDate}</p>
                <p className="google-condition">{weatherData.weather[0].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {weatherData && dailyForecast.length > 0 && !loading && !error && (
        <div className="md3-bottom-sheet">
          <div className="sheet-handle"></div>
          
          <div className="md3-tabs-container">
            {dailyForecast.map((day, index) => (
              <button 
                key={index}
                className={`md3-tab ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <span className="tab-day">{index === 0 ? 'Today' : day.tabLabel}</span>
                <div className="tab-info">
                  <WeatherIcon code={day.icon} size={20} />
                  <span className="tab-temps">{Math.round(day.max)}° <span className="low-temp">{Math.round(day.min)}°</span></span>
                </div>
                {activeTab === index && <div className="tab-indicator"></div>}
              </button>
            ))}
          </div>

          <div className="md3-hourly-scroll">
            {dailyForecast[activeTab].hourly.map((hour, index) => (
              <div key={index} className="hourly-item">
                <span className="time">{index === 0 && activeTab === 0 ? 'Now' : hour.time}</span>
                <WeatherIcon code={hour.icon} size={28} className="hour-icon" />
                <span className="temp">{hour.temp}°</span>
                {hour.pop > 0 && (
                  <span className="pop"><Droplets size={10} /> {hour.pop}%</span>
                )}
              </div>
            ))}
          </div>

         <div className="md3-chart-container">
             <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={dailyForecast[activeTab].hourly} margin={{ top: 30, right: 20, left: 20, bottom: 10 }}>
                <defs>
                  <linearGradient id="md3Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--md-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--md-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                {/* NEW: Adds the Time to the bottom of the graph */}
                <XAxis 
                  dataKey="time" 
                  stroke="var(--md-outline-variant)" 
                  tick={{ fill: 'var(--md-on-surface-variant)', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10} 
                />
                
                <Tooltip 
                  cursor={{ stroke: 'var(--md-outline)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: 'var(--md-surface-container-high)', border: 'none', borderRadius: '12px', color: 'var(--md-on-surface)' }}
                  itemStyle={{ color: 'var(--md-primary)', fontWeight: 600 }}
                  labelStyle={{ display: 'none' }}
                />
                
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="var(--md-primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#md3Gradient)" 
                  /* NEW: Puts the temperature numbers directly on top of the line! */
                  label={{ fill: 'var(--md-on-surface)', fontSize: 14, fontWeight: 500, position: 'top', dy: -10 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;