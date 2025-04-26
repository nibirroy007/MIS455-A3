let allCountries = [];

window.onload = function () {
    fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(data => {
            allCountries = data;
        });
};

function connect() {
    const searchTerm = document.getElementById("searchBox").value.toLowerCase();
    const filteredCountries = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm)
    );
    showInBrowser(filteredCountries);
}

function showInBrowser(countries) {
    const displayArea = document.getElementById("displayArea");
    displayArea.textContent = "";

    countries.forEach(country => {
        const div = document.createElement("div");
        div.classList.add("innerStyle");

        div.innerHTML = `
            <strong>Country:</strong> ${country.name.common}<br>
            <button onclick='showMoreDetails(${JSON.stringify(country)})'>More Details</button><br><br>
        `;

        displayArea.appendChild(div);
    });
}

function showMoreDetails(country) {
    const displayArea = document.getElementById("displayArea");

    // Clear existing details
    const existingDiv = document.getElementById(`country-${country.cca3}`);
    if (existingDiv) {
        existingDiv.remove();
    }

    const div = document.createElement("div");
    div.id = `country-${country.cca3}`;
    div.classList.add("innerStyle");

    const languages = country.languages ? Object.values(country.languages).join(", ") : "N/A";
    const currencies = country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "N/A";
    const states = country.subregion ? country.subregion : "N/A"; // Some countries have states/regions

    div.innerHTML = `
        <strong>Country:</strong> ${country.name.common}<br>
        <strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}<br>
        <strong>Region:</strong> ${country.region}<br>
        <strong>Subregion (States/Provinces):</strong> ${states}<br>
        <strong>Population:</strong> ${country.population.toLocaleString()}<br>
        <strong>Languages:</strong> ${languages}<br>
        <strong>Currencies:</strong> ${currencies}<br>
        <img src="${country.flags.svg}" width="150"><br><br>
        <button onclick='showWeather(${country.latlng[0]}, ${country.latlng[1]}, "${country.name.common}")'>Show Weather</button><br><br>
    `;

    displayArea.appendChild(div);
}

function showWeather(lat, lon, countryName) {
    const apiKey = "a0a56ab6f557696bfe18e783765f5b5e";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            alert(`Weather in ${countryName}:
🌡️ Temp: ${data.main.temp}°C
☁️ Condition: ${data.weather[0].description}
💧 Humidity: ${data.main.humidity}%
🌬️ Wind: ${data.wind.speed} m/s`);
        })
        .catch(err => alert("Weather data not available."));
}
