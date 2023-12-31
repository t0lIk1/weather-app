searchResult.addEventListener('input', () => {
  const searchTerm = searchResult.value;
  updateSearchResults(searchTerm);
});

function submitForm(event) {
  event.preventDefault();
  town = searchResult.value;
  translateTown(town);
}

function updateSearchResults(searchTerm) {
  dropmenu.innerHTML = '';
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apikey}`)
    .then(response => response.json())
    .then(data => {
      if (searchTerm.trim() !== '' && data.length > 0) {
        // Если введенный термин поиска не пустой и есть результаты, добавляем класс 'active'
        searchResult.classList.add('active');
      } else {
        // Если введенный термин поиска пустой или результатов нет, убираем класс 'active'
        searchResult.classList.remove('active');
      }
      data.forEach(result => {
        const resultElement = document.createElement('p');
        resultElement.textContent = result.name + ', ' + result.country;
        if (!displayedResults.includes(resultElement.textContent)) {
          dropmenu.appendChild(resultElement);
          displayedResults.push(resultElement.textContent);
          resultElement.addEventListener('click', () => {
            searchResult.value = result.name + ", " + result.country;
            nameTown.innerHTML = result.name + ", " + result.country;
            searchResult.classList.remove('active');
            selectedResult = result;
            coords(result.lat, result.lon);
            dropmenu.innerHTML = '';
          });
          
        }
      });
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
    
}
const debouncedUpdateSearchResults = debounce(updateSearchResults, 1000);


async function searchCity() {
  let link = `https://api.openweathermap.org/geo/1.0/direct?q=${town}&limit=5&appid=${apikey}`;
  try {
    const response = await fetch(link);
    const data = await response.json();
    const cities = data.map(city => city.name);
    cities.forEach(city => {
      const result = document.querySelector('.dropmenu');
      
      result.textContent = city;
      document.body.appendChild(result);
    });
  } catch (error) {
    console.log('Error:', error);
  }
};
