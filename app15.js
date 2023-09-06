let selectedTimezone1;

document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById("submitButton");
    const placeOfBirthInput = document.getElementById("placeOfBirth");
    const suggestionsDiv = document.getElementById("suggestions");
    let selectedPlace = null;
    const tagSelect = document.getElementById("tag");
    const monatSelect = document.getElementById("monat");
    const jahrSelect = document.getElementById("jahr");
    const stundeSelect = document.getElementById("stunde");
    const minuteSelect = document.getElementById("minute");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");
    const timezoneInput = document.getElementById("timezone");
    const vornameNameInput = document.getElementById("vornameName");
    const formContainer = document.getElementById("form-container");
    const tableContainer = document.getElementById("table-container");
    const loadingSpinner = document.getElementById("loading-spinner");

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    for (let day = 1; day <= 31; day++) {
    const option = document.createElement("option");
    option.value = day;
    option.text = day;
    tagSelect.appendChild(option);
}

    const months = [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez",
    ];
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement("option");
        option.value = month;
        option.text = months[month - 1];
        monatSelect.appendChild(option);
    }

    const startYear = currentYear - 100;
    const endYear = currentYear;
        for (let year = startYear; year <= endYear; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.text = year;
            jahrSelect.appendChild(option);
    }

    for (let hour = 0; hour < 24; hour++) {
        const option = document.createElement("option");
        option.value = hour;
        option.text = hour;
        stundeSelect.appendChild(option);
    }

    for (let minute = 0; minute < 60; minute++) {
        const option = document.createElement("option");
        option.value = minute;
        option.text = minute;
        minuteSelect.appendChild(option);
    }

    tagSelect.value = currentDay;
    monatSelect.value = currentMonth;
    jahrSelect.value = currentYear;
    stundeSelect.value = currentHour;
    minuteSelect.value = currentMinute;

    placeOfBirthInput.addEventListener("input", async function () {
        const place = placeOfBirthInput.value;

        if (place) {
            const suggestions = await getLocationSuggestions(place);
            displaySuggestions(suggestions);
        } else {
            clearSuggestions();
        }
    });

    suggestionsDiv.addEventListener("click", function (event) {
    if (event.target.classList.contains("suggestion")) {
        selectedPlace = {
            name: event.target.getAttribute("data-name"),
            countryCode: event.target.getAttribute("data-countryCode"),
            latitude: event.target.getAttribute("data-latitude"),
            longitude: event.target.getAttribute("data-longitude"),
            timezone: event.target.getAttribute("data-timezone"), // Add timezone
        };
        placeOfBirthInput.value = selectedPlace.name;
        latitudeInput.value = selectedPlace.latitude; // Update latitude value
        longitudeInput.value = selectedPlace.longitude; // Update longitude value
        timezoneInput.value = selectedPlace.timezone; // Update timezone value
        clearSuggestions();
    }
});

    async function getLocationSuggestions(place) {
        try {
            const response = await fetch(
                "https://api.horoskop-paradies.ch/astrology/geoname.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: "search=" + encodeURIComponent(place),
                }
            );

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function fetchTimezone(place) {
    try {
        const response = await fetch('https://api.horoskop-paradies.ch/astrology/timezone.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `date=${jahrSelect.value}-${monatSelect.value}-${tagSelect.value}&latitude=${place.latitude}&longitude=${place.longitude}`,
        });

        const data = await response.json();
        return data.timezone; // Return the timezone information
    } catch (error) {
        console.error(error);
        return null; // Return null on error
    }
}

    function displaySuggestions(suggestions) {
        suggestionsDiv.innerHTML = "";

        if (suggestions.length === 0) {
            return;
        }

        suggestions.forEach((suggestion) => {
            const suggestionButton = document.createElement("button");
            suggestionButton.textContent = `${suggestion.place}, ${
                suggestion.country_code
            }\n${formatGeolocation(
                suggestion.latitude,
                suggestion.longitude
            )}`;
            suggestionButton.classList.add("suggestion");
            suggestionButton.setAttribute("data-name", suggestion.place);
            suggestionButton.setAttribute(
                "data-countryCode",
                suggestion.country_code
            );
            suggestionButton.setAttribute("data-latitude", suggestion.latitude);
            suggestionButton.setAttribute("data-longitude", suggestion.longitude);
            suggestionButton.setAttribute("data-timezone", suggestion.timezone);
            suggestionsDiv.appendChild(suggestionButton);
        });
    }

    function clearSuggestions() {
        suggestionsDiv.innerHTML = "";
    }

    function formatGeolocation(latitude, longitude) {
        const latDirection = latitude < 0 ? "S" : "N";
        const lonDirection = longitude < 0 ? "W" : "E";
        const formattedLatitude = formatCoordinate(latitude, latDirection);
        const formattedLongitude = formatCoordinate(longitude, lonDirection);
        return `${formattedLatitude}, ${formattedLongitude}`;
    }

    function formatCoordinate(coordinate, direction) {
        const absoluteCoordinate = Math.abs(coordinate);
        const degrees = Math.floor(absoluteCoordinate);
        const minutes = Math.floor((absoluteCoordinate - degrees) * 60);
        return `${degrees}°${minutes}' ${direction}`;
    }

    submitButton.addEventListener("click", async function (event) {
        event.preventDefault();

        formContainer.style.display = "none";
        loadingSpinner.style.display = "block";

        console.log(latitudeInput);
        console.log(longitudeInput);
        console.log(timezoneInput);

        if (selectedPlace) {
            const selectedVornameName = vornameNameInput.value;
            const selectedTag = tagSelect.value;
            const selectedMonat = monatSelect.value;
            const selectedJahr = jahrSelect.value;
            const selectedStunde = stundeSelect.value;
            const selectedMinute = minuteSelect.value;

            const formattedGeolocation = formatGeolocation(
                selectedPlace.latitude,
                selectedPlace.longitude
            );

            selectedTimezone1 = await fetchTimezone(selectedPlace);

            const resultText = `
                Vorname, Name: ${selectedVornameName}
                Datum: ${selectedTag}.${selectedMonat}.${selectedJahr}
                Uhrzeit: ${selectedStunde}:${selectedMinute}
                Geburtsort: ${selectedPlace.name}, ${selectedPlace.countryCode}
                Geolocation: ${formattedGeolocation}
                Latitude: ${selectedPlace.latitude}
                Longitude: ${selectedPlace.longitude}
                Timezone: ${selectedTimezone1}
            `;
            
        }

        const apiKey = 'NjAyMDIyOmRkZDUxYWYyZTE4YmUzNWM3M2MxYTZkMGVhNzczNjRk';

        const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Authorization", `Basic ${apiKey}`);
myHeaders.append("Accept-Language", "de");

        const selectedTag = tagSelect.value;
    const selectedMonat = monatSelect.value;
    const selectedJahr = jahrSelect.value;
    const selectedStunde = stundeSelect.value;
    const selectedMinute = minuteSelect.value;
    const selectedLatitude = parseFloat(latitudeInput.value);
    const selectedLongitude = parseFloat(longitudeInput.value);
    const selectedTimezone = parseFloat(timezoneInput.value); // Parse the value as a float

        const urlencoded = new URLSearchParams();
        urlencoded.append("day", selectedTag);
    urlencoded.append("month", selectedMonat);
    urlencoded.append("year", selectedJahr);
    urlencoded.append("hour", selectedStunde);
    urlencoded.append("min", selectedMinute);
    urlencoded.append("lon", selectedLongitude);
    urlencoded.append("lat", selectedLatitude);
    urlencoded.append("tzone", selectedTimezone1);

    console.log(selectedTag);
    console.log(selectedMonat);
    console.log(selectedJahr);
    console.log(selectedLatitude);
    console.log(selectedLongitude);
    console.log(selectedTimezone1);
    console.log(typeof selectedLatitude);
    console.log(typeof selectedLongitude);
    console.log(typeof selectedTimezone1);
    
        const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      function calculateNormalizedDegree(degree) {
    const normalizedDegree = (degree % 30).toFixed(6);
    const degrees = Math.floor(normalizedDegree);
    const minutes = Math.floor((normalizedDegree - degrees) * 60);
    const seconds = Math.round(((normalizedDegree - degrees) * 60 - minutes) * 60);
    return `${degrees.toString().padStart(2, '0')}°${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}"`;
}

fetch("https://json.astrologyapi.com/v1/western_horoscope", requestOptions)
    .then(response => response.json())
    .then(result => {
        const planetsOfInterest = [
            "Sonne", "Mond", "Merkur", "Venus", "Mars", "Jupiter", "Saturn", 
            "Uranus", "Neptun", "Pluto", "Mondknoten", "Chiron"
        ];

        const sunPlanet = result.planets.find(p => p.name === "Sonne");
        const mondPlanet = result.planets.find(p => p.name === "Mond");
        const aszendentHouse = result.houses.find(h => h.house === 1);
        const planetTableBody = document.getElementById("planet-table-body");
        
        

        if (sunPlanet) {
            displaySunSign(sunPlanet.sign);
        }

        if (mondPlanet) {
            displayMondSign(mondPlanet.sign);
        }

        if (aszendentHouse) {
            displayAszendentSign(aszendentHouse.sign);
        } else{
            console.log("No results found");
        }

        planetsOfInterest.forEach(planetName => {
            const planet = result.planets.find(p => p.name === planetName);
            if (planet) {
                const formattedDegree = calculateNormalizedDegree(planet.full_degree);
                addRowToTable(planetTableBody, planetName, planet, formattedDegree);
            }
        });

        const lilith = result.lilith;
        if (lilith) {
            const formattedDegree = calculateNormalizedDegree(lilith.full_degree);
            addRowToTable(planetTableBody, "Lilith", lilith, formattedDegree);
        }


        const houseNames = [
            "Aszendent", "Deszendent", "Medium Coeli", "Imum Coeli"
        ];

        const housesOfInterest = [
            1, 7, 10, 4
        ];

        housesOfInterest.forEach((houseNumber, index) => {
            const house = result.houses.find(h => h.house === houseNumber);
            if (house) {
                const formattedDegree = calculateNormalizedDegree(house.degree);
                addRowToTable(planetTableBody, houseNames[index], house, formattedDegree);
            }
        });
    })
    .catch(error => console.log('error', error));

    const signIcons = {
        "Wassermann": "icon-Wassermann",
    "Fische": "icon-Fische",
    "Widder": "icon-Widder",
    "Stier": "icon-Stier",
    "Zwillinge": "icon-Zwillinge",
    "Krebs": "icon-Krebs",
    "Löwe": "icon-Löwe",
    "Jungfrau": "icon-Jungfrau",
    "Waage": "icon-Waage",
    "Skorpion": "icon-Skorpion",
    "Schütze": "icon-Schütze",
    "Steinbock": "icon-Steinbock",
    };

    function displaySunSign(sign) {
    const signIconDiv = document.getElementById("sign-icon");
    const signButtonsDiv = document.getElementById("sign-buttons");
    
    const starSignIconClass = signIcons[sign]; // Get the icon class for the sign

    if (starSignIconClass) {
        const iconElement = document.createElement("i"); // Create an <i> element for the icon
        iconElement.classList.add("icon", starSignIconClass); // Add the icon class to the <i> element
        signIconDiv.innerHTML = ''; // Clear any previous content
        signIconDiv.appendChild(iconElement); // Append the <i> element to the icon div
        
        const signParagraph = document.createElement("p");
        signParagraph.textContent = `${sign}`;
        signButtonsDiv.innerHTML = ''; // Clear any previous content
        signButtonsDiv.appendChild(signParagraph);
    } else {
        signButtonsDiv.innerHTML = `${sign}`;
    }
}

function displayMondSign(sign) {
    const signIconDiv = document.getElementById("sign-icon-mond");
    const signButtonsDiv = document.getElementById("sign-buttons-mond");
    
    const starSignIconClass = signIcons[sign]; // Get the icon class for the sign

    if (starSignIconClass) {
        const iconElement = document.createElement("i"); // Create an <i> element for the icon
        iconElement.classList.add("icon", starSignIconClass); // Add the icon class to the <i> element
        signIconDiv.innerHTML = ''; // Clear any previous content
        signIconDiv.appendChild(iconElement); // Append the <i> element to the icon div
        
        const signParagraph = document.createElement("p");
        signParagraph.textContent = `${sign}`;
        signButtonsDiv.innerHTML = ''; // Clear any previous content
        signButtonsDiv.appendChild(signParagraph);
    } else {
        signButtonsDiv.innerHTML = `${sign}`;
    }
}

function displayAszendentSign(sign) {
    const signIconDiv = document.getElementById("sign-icon-aszendent");
    const signButtonsDiv = document.getElementById("sign-buttons-aszendent");
    
    const starSignIconClass = signIcons[sign]; // Get the icon class for the sign

    if (starSignIconClass) {
        const iconElement = document.createElement("i"); // Create an <i> element for the icon
        iconElement.classList.add("icon", starSignIconClass); // Add the icon class to the <i> element
        signIconDiv.innerHTML = ''; // Clear any previous content
        signIconDiv.appendChild(iconElement); // Append the <i> element to the icon div
        
        const signParagraph = document.createElement("p");
        signParagraph.textContent = `${sign}`;
        signButtonsDiv.innerHTML = ''; // Clear any previous content
        signButtonsDiv.appendChild(signParagraph);
    } else {
        signButtonsDiv.innerHTML = `${sign}`;
    }
}








function addRowToTable(tableBody, name, data, formattedDegree) {
    const row = document.createElement("tr");
    row.innerHTML = `  
        <td class="icon-${name}"></td>
        <td>${name}</td>
        <td>${formattedDegree}</td>
        <td>${data.is_retro === "true" ? "R" : "-"}</td>
        <td class="${signIcons[data.sign]}"></td>
        <td>${data.sign}</td>
        <td>Haus ${data.house}</td>
    `;
    tableBody.appendChild(row);
}
        loadingSpinner.style.display = "none";
        tableContainer.style.display = "block";
        
    });
});