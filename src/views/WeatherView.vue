<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// Fill in your OpenWeather API key here when ready.
const apikey = "b065d6656ec29cceeae106c2c756cec2";

// Reactive state (replacing `data()`)
const city = ref("");
const weatherData = ref(null);
const hourlyForecast = ref([]);
const dailyForecast = ref([]);

// Computed properties (replacing `computed:`)
const temperature = computed(() => {
  return weatherData.value
    ? Math.floor(weatherData.value.main.temp - 273)
    : null;
});

const iconUrl = computed(() => {
  return weatherData.value
    ? `https://openweathermap.org/payload/api/media/file/${weatherData.value.weather[0].icon}.png`
    : null;
});

// Methods (defined as standard JavaScript functions)
const fetchWeatherData = async (url) => {
  if (!apikey) return;

  try {
    const response = await axios.get(url);
    // Use .value to update ref variables
    weatherData.value = response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const searchByCity = async () => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.value.trim())}&appid=${apikey}`;
  await fetchWeatherData(url);
};

const fetchCurrentLocationWeather = () => {
  if (!apikey) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
      await fetchWeatherData(url);
    });
  }
};

// Lifecycle hook (replacing `mounted()`)
onMounted(() => {
  fetchCurrentLocationWeather();
});
</script>

<template>
  <section class="weather-page" aria-labelledby="weather-title">
    <header class="text-center mb-4">
      <h1 id="weather-title">WEATHER APP</h1>
      <p class="text-secondary">Search for a city to see its current weather.</p>
    </header>

    <div class="search-bar">
      <label class="visually-hidden" for="weather-city">City name</label>
      <input id="weather-city" v-model="city" type="text" placeholder="Enter city name"
        class="form-control search-input" @keyup.enter="searchByCity" />
      <button type="button" class="btn btn-primary search-button" @click="searchByCity">
        Search
      </button>
    </div>

    <div class="mt-4" aria-live="polite">
      <div v-if="weatherData" class="weather-result text-center">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <img v-if="iconUrl" :src="iconUrl" alt="Weather Icon" width="100" height="100" />
        <p class="temperature">{{ temperature }} °C</p>
        <p class="weather-description">{{ weatherData.weather[0].description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.weather-page {
  max-width: 42rem;
  margin: 2rem auto;
}

.search-bar {
  display: flex;
  gap: 0.75rem;
}

.search-input {
  min-width: 0;
}

.weather-result {
  padding: 2rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
  background-color: #f8f9fa;
}

.temperature {
  margin-bottom: 1rem;
  font-size: 2rem;
}

.weather-description {
  margin-bottom: 0;
  font-size: 1.125rem;
}
</style>
