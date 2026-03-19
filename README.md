# 🌦️ Material Weather Dashboard (MD3)

A high-performance, production-ready weather application that fuses the data-dense layout of **Google Search's Weather Widget** with the modern, tactile design language of **Material Design 3 (MD3)**.

<img width="1272" height="913" alt="Screenshot 2026-03-19 124948" src="https://github.com/user-attachments/assets/bd3a44b6-fad9-40c9-84a5-c1673817ee32" />



##  Live Demo
**View the live project here:** https://md3-weather-dashboard.vercel.app/

---

##  Tech Stack
* **Framework:** [React.js](https://reactjs.org/) (Vite)
* **Data Visualization:** [Recharts](https://recharts.org/) (Custom Area Charts)
* **Icons:** [Lucide-React](https://lucide.dev/) (SVG-based system icons)
* **Styling:** Pure CSS3 (Custom Properties/Variables, Flexbox, CSS Grid)
* **API:** [OpenWeatherMap API](https://openweathermap.org/api)

---

##  Key Features
* **Iterative Design Evolution:** Developed through multiple design sprints, pivoting from Glassmorphism to a hybrid MD3 layout for superior legibility.
* **Dynamic Data Engine:** Custom logic to parse 3-hour interval forecast data into accurate daily high/low aggregates and precipitation probabilities.
* **Interactive Analytics:** A responsive temperature trend chart that mirrors Google's "values-on-line" visualization for instant data recognition.
* **Material 3 Bottom Sheet:** A mobile-optimized tabbed interface that allows users to toggle between 5-day forecasts with zero layout shift.
* **Symmetrical Mobile UI:** Specifically engineered CSS breakpoints to ensure brand elements and weather data remain balanced on small viewports.

---

##  Engineering Challenges & Solutions

### 1. The "Blank Screen" Data Safety
OpenWeatherMap API occasionally omits the `pop` (Probability of Precipitation) field if the sky is clear. I implemented a robust fallback system using logical OR operators and safety checks to ensure the `Math.round()` functions never receive `undefined` values, preventing application crashes.

### 2. Chart Precision
To replicate the Google Weather experience, I configured `recharts` to render data labels directly on the `Area` curve. This required precise coordinate management to ensure labels remained visible across various screen sizes without overlapping the X-Axis.

### 3. Layout Symmetries
On mobile, standard left-aligned data felt visually "heavy" on one side. I utilized `flex-direction: column-reverse` within media queries to flip the header hierarchy, placing the location name as a centered anchor above the weather data for a more "native app" feel.

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/md3-weather-dashboard.git](https://github.com/YOUR_USERNAME/md3-weather-dashboard.git)
