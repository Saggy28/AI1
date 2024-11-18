document.getElementById("get-weather").addEventListener("click", function () {
    const city = document.getElementById("city-input").value.trim();
    if (!city) {
        alert("Proszę wpisać nazwę miasta.");
        return;
    }

    const apiKey = "078f66d26e8691c2393129a52d5e2bda";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    // Pobranie aktualnej pogody za pomocą XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", currentWeatherUrl, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            
            const data = JSON.parse(xhr.responseText);
            displayCurrentWeather(data);
        } else {
            alert("Nie znaleziono miasta lub wystąpił błąd.");
        }
    };

    xhr.onerror = function () {
        alert("Wystąpił błąd podczas komunikacji z API.");
    };

    xhr.send();

    // Pobranie prognozy na 5 dni za pomocą fetch
    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Nie udało się pobrać prognozy.");
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            alert(error.message);
        });
});

function displayCurrentWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById("city-name").textContent = cityName;
    document.getElementById("temperature").textContent = `Temperatura: ${temperature}°C`;
    document.getElementById("description").textContent = `Opis: ${description}`;
    document.getElementById("weather-icon").src = iconUrl;

    document.getElementById("weather-result").style.display = "block";
}

function displayForecast(data) {
    const forecastList = document.getElementById("forecast-list");
    forecastList.innerHTML = ""; // Czyszczenie poprzednich wyników

    const dailyData = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0]; // Data w formacie YYYY-MM-DD
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });

    const days = Object.keys(dailyData).slice(0, 5); // Pobieramy tylko 5 dni

    days.forEach(day => {
        const dayData = dailyData[day];
        const middayData = dayData[Math.floor(dayData.length / 2)];
        const temperature = middayData.main.temp;
        const description = middayData.weather[0].description;
        const iconCode = middayData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <span>${day}</span>
            <span>Temperatura: ${temperature}°C</span>
            <span>${description}</span>
            <img src="${iconUrl}" alt="Ikona pogody">
        `;
        forecastList.appendChild(listItem);
    });

    document.getElementById("forecast-result").style.display = "block";
}
