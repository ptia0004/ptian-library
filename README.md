# NoMash-Library

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Weather API setup (Lab 10.2)

The **Get Weather** navigation link opens `/WeatherCheck`. Enter a city name, such as
`Melbourne,AU`, and click **Search** (or press Enter) to display its current weather.

Add your OpenWeather API key directly to `src/views/WeatherView.vue`:

```js
const apikey = "your_api_key_here";
```

The key is intentionally blank initially. This page uses the `apikey` constant rather
than `.env.local`. After a key is added, opening the page requests browser location
permission so it can display the current weather at your location. You can also enter
a city name and search manually.

The page requests the [Current Weather API](https://openweathermap.org/api/current)
and follows the course example to convert the returned temperature from Kelvin to
Celsius. It shows the city, country, weather icon, temperature and description.

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
