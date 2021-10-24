async function windowActions() {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
    const request = await fetch(endpoint);
    const Food = await request.json();
    const ACCESS_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const mymap = L.map('mapid').setView([38.989, -76.937],8);
    let results = 0; //Keep track of results
  
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(mymap);
  
    function findMatches (wordToMatch, Food) {
      return Food.filter((place) => {
        const regex = new RegExp(wordToMatch, 'gi');
        return place.zip.match(regex);
      });
    }
  
    function displayMatches(event) {
      const matchArray = findMatches(event.target.value, Food);
      const html = matchArray.map((place) => {
        if (!event.target.value || results > 4) {
          document.querySelector('.suggestions').innerHTML = '';
        } else {
          results += 1;
  
          const point = place.geocoded_column_1;
          const latitude = point.coordinates;
          const marker = latitude.reverse();
  
          L.marker(marker).addTo(mymap);
          return `
                  <li>
                      <span class = "name">${place.name}<br></span>
                      <span class = "address">${place.address_line_1}<br></span>
                      <br>
                  </li>
                  `;
        }
      }).join('');
      suggestions.innerHTML = html;
      results = 0;
    }
  
    const searchInput = document.querySelector('.search');
    const suggestions = document.querySelector('.suggestions');
  
    searchInput.addEventListener('change', (evt) => { displayMatches(evt); });
    searchInput.addEventListener('keyup', (evt) => { displayMatches(evt); });
  }
  
  window.onload = windowActions;