document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quote-form');
  const modal = document.getElementById('confirmation-modal');
  const closeBtn = document.getElementById('close-modal');

  // show modal on submit (requestaquote)
  if (form && modal && closeBtn) {
    form.addEventListener('submit', function () {
      modal.classList.add('show');
      modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', function () {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    });
  }

  // show modal immediately on thank you page
  if (!form && modal && closeBtn) {
    modal.classList.add('show');
    modal.classList.remove('hidden');

    closeBtn.addEventListener('click', function () {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    });
  }

  // Accordion for about
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const panel = btn.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        panel.style.opacity = 0;
      } else {
        document.querySelectorAll('.panel').forEach(p => {
          p.style.maxHeight = null;
          p.previousElementSibling.classList.remove('active');
          p.style.opacity = 0;
        });
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.style.opacity = 1;
      }
    });
  });

  // Dark mode toggle
  const toggleButton = document.getElementById('dark-mode-toggle');
  const savedMode = localStorage.getItem('darkMode');

  if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem(
        'darkMode',
        document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled'
      );
    });
  }
});

//Weather API
const weatherBtn = document.getElementById('fetch-weather');
const weatherResult = document.getElementById('weather-result');

if (weatherBtn && weatherResult) {
  weatherBtn.addEventListener('click', () => {
    weatherResult.textContent = "Fetching your location...";

    if (!navigator.geolocation) {
      weatherResult.textContent = "Geolocation is not supported by your browser.";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        weatherResult.textContent = "Getting current weather...";

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`)
          .then(response => {
            if (!response.ok) throw new Error("Weather data unavailable.");
            return response.json();
          })
          .then(data => {
            const weather = data.current_weather;
            weatherResult.innerHTML = `
              <div class="weather-box">
                <p>🌡️ Temperature: ${weather.temperature}°F</p>
                <p>💨 Wind Speed: ${weather.windspeed} mph</p>
                <p>📍 Based on your current location</p>
              </div>
            `;
          })
          .catch(() => {
            weatherResult.textContent = "⚠️ Unable to fetch weather data. Please try again later.";
          });
      },
      () => {
        weatherResult.textContent = "Permission denied. Cannot fetch weather without location access.";
      }
    );
  });
}

//Autofill service selection to requestaquote
const urlParams = new URLSearchParams(window.location.search);
const requestedService = urlParams.get('service');

if (requestedService) {
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    serviceSelect.value = requestedService.toLowerCase();
  }
}

//recent work gallery
const serviceFilter = document.getElementById('service-filter');
const gallery = document.getElementById('gallery');

if (serviceFilter && gallery) {
  const imageSets = {
    trimming: [
      "images/cleanupb1.PNG",
      "images/cleanupb2.PNG",
      "images/cleanupb3.PNG",
      "images/cleanupa1.PNG",
      "images/cleanupa2.PNG",
      "images/cleanupa3.PNG"
    ],
    mulching: [
      "images/mulchingB2.jpg",
      "images/mulching1B.jpg",
      "images/mulchingB3.jpg",
      "images/mulchingA2.jpg",
      "images/mulching1A.jpg",
      "images/mulchingA3.jpg"
    ],
    hauloff: [
      "images/remove3.jpg",
      "images/haul1.jpg",
      "images/haul2.jpg",
    ],
    removal: [
      "images/remove5B.jpg",
      "images/removalBA.jpeg",
      "images/remove6B.png",
      "images/remove5A.jpg",
      "images/remove4.jpeg",
      "images/remove6A.png"
    ]
  };

  serviceFilter.addEventListener('change', () => {
    const selected = serviceFilter.value;
    gallery.innerHTML = ''; // clear current images

    if (imageSets[selected]) {
      imageSets[selected].forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = selected + " project";
        gallery.appendChild(img);
      });
    }
  });
}
