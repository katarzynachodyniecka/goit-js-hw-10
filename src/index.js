import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const API_URL = 'https://restcountries.com/v3.1/name/';
const FILTER = `?fields=name,capital,population,flags,languages`;

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const clearCountry() => {
    listEl.innerHTML = ""
    infoEl.innerHTML = ""
}

// const addSpace = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

inputEl.addEventListener(  
    'input', debounce(event => {
  if (event.target.value.trim() !== '') {
    fetchCountries(`${API_URL}${event.target.value.trim()}${FILTER}`)
      .then(countriesData => renderCountry(countriesData))
      .catch(error => console.log(error));
  } else {
    clearCountry();
  }
//   console.log(e.target.value);
}, DEBOUNCE_DELAY))

function renderCountry(countriesData) {
    // console.log(countriesData.length);
    if (countriesData.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    }
    if (countriesData.length === 1) {
      clearFields();
      countryInfo.innerHTML = `<div class="country-info__container">
      <img class="country-info__img" src="${
        countriesData[0].flags.svg
      }" width="100px" alt=""/>
      <h1> ${countriesData[0].name.official}</h1>
      </div>
      <p><b>Capital</b>: ${countriesData[0].capital}</p>
      <p><b>Population</b>: ${countriesData[0].population}</p>
      <p><b>Languages</b>: ${Object.values(countriesData[0].languages).join(', ')}
      </p>`;
    }
  
    if (countriesData.length > 1 && countriesData.length <= 10) {
      // console.log(countriesData);
      // console.log(...countriesData);
      clearFields();
      const markup = countriesData
        .map(country => {
          return `<a href="http://" target="_blank" rel="noopener noreferrer"><li class="country-list__item">
          <img class="country-list__img" src="${country.flags.svg}" width="50px" alt=""/>
          <p> ${country.name.official}</p>
          </li></a>`;
        })
        .join('');
      countryList.innerHTML = markup;
    }
  }