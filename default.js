const container = document.getElementById("container")
const apiKeyWeather = "";
const apiKeyImage = "";


const city = prompt("City?");

async function coordinates(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyWeather}`;
  const request = new Request(url);

  try {
    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const coordinate = await response.json();
    const lat = coordinate["coord"]["lat"];
    const lon = coordinate["coord"]["lon"];

    return [lat, lon];
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function weatherFetch() {
  const coordinate = await coordinates(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinate[0]}&lon=${coordinate[1]}&appid=${apiKeyWeather}`;
  const request = new Request(url);

  try {
    const response = await fetch(request);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const weather = await response.json();

    return weather;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


async function weatherImageFetch() {
    try {
        const weatherInformations = await weatherFetch();
        const weatherMain = weatherInformations.weather[0].main;

        const urlImage = `https://api.giphy.com/v1/gifs/search?q=${weatherMain}&api_key=${apiKeyImage}&limit=1`;

        const response = await fetch(urlImage);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const imageData = await response.json();

        if (!imageData.data || imageData.data.length === 0) {
            throw new Error("No image data found");
        }

        const imageUrl = imageData.data[0].images.original.url;

        return imageUrl;
    } catch (error) {
        console.error("Error fetching image data:", error);
        throw error; 
    }
}


async function displayInformations() {
    try {
        const weatherInformations = await weatherFetch();
        const weatherImage = await weatherImageFetch();

        container.innerHTML = '';

        const loadingMessage = document.createElement("p");
        loadingMessage.textContent = "Loading weather information...";
        container.appendChild(loadingMessage);

        const divCity = document.createElement("div");
        const cityName = document.createElement("p");
        const countryCode = document.createElement("p");

        cityName.textContent = `City: ${weatherInformations.name}`;
        countryCode.textContent = `Country Code: ${weatherInformations.sys.country}`;
        divCity.appendChild(cityName);
        divCity.appendChild(countryCode);

        const divConditions = document.createElement("div");
        const weatherGroup = document.createElement("p");
        const weatherDescription = document.createElement("p");
        const temperature = document.createElement("p");
        const image = document.createElement("img");
        image.src = weatherImage;
        image.alt = "Weather Image";

        weatherGroup.textContent = `Weather Group: ${weatherInformations.weather[0].main}`;
        weatherDescription.textContent = `Description: ${weatherInformations.weather[0].description}`;
        temperature.textContent = `Temperature: ${Math.round(weatherInformations.main.temp - 273.15)}°C`; // Convert Kelvin to Celsius

        divConditions.appendChild(weatherGroup);
        divConditions.appendChild(weatherDescription);
        divConditions.appendChild(temperature);
        divConditions.appendChild(image);

        container.innerHTML = '';
        container.appendChild(divCity);
        container.appendChild(divConditions);
    } catch (error) {
        console.error("Error displaying information:", error);
        const errorContainer = document.createElement("div");
        errorContainer.textContent = "Error fetching weather information. Please try again later.";
        container.appendChild(errorContainer);
    }
}

displayInformations();
