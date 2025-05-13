
document.getElementById('weatherForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const city = document.getElementById('city').value.trim();
  const weatherResult = document.getElementById('weatherResult');

  if (!city) return;

  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Nie znaleziono miasta');
    const data = await response.json();

    const current = data.current_condition[0];
    const icon = getIcon(current.weatherDesc[0].value);

    weatherResult.innerHTML = `
      <div class="weather-card">
        <h2>${city}</h2>
        <div style="font-size: 48px;">${icon}</div>
        <p>Temperatura: ${current.temp_C}°C</p>
        <p>Warunki: ${current.weatherDesc[0].value}</p>
        <p>Wilgotność: ${current.humidity}%</p>
      </div>
    `;

  } catch (err) {
    weatherResult.innerHTML = '<p style="color: red;">Błąd: ' + err.message + '</p>';
  }
});


function getIcon(desc) {
  const map = {
    'Sunny': '☀️',
    'Clear': '☀️',
    'Partly cloudy': '⛅',
    'Cloudy': '☁️',
    'Overcast': '☁️',
    'Mist': '🌫️',
    'Rain': '🌧️',
    'Light rain': '🌦️',
    'Snow': '❄️',
    'Thunderstorm': '⛈️'
  };
  return map[desc] || '🌍';
}
