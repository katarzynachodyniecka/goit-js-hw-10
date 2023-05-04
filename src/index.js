import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';

const API_URL = 'https://restcountries.com/v3.1/name/';
const PARAMS = `?fields=name,capital,population,flags,languages`;

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const clearCountry = () => {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
};

inputEl.addEventListener(
  'input',
  debounce(event => {
    // console.log(event.target.value);
    if (event.target.value.trim() !== '') {
      fetchCountries(`${API_URL}${event.target.value.trim()}${PARAMS}`)
        .then(countriesData => renderCountry(countriesData))
        .catch(error => console.log(error));
    } else {
      clearCountry();
    }
  }, DEBOUNCE_DELAY)
);

function renderCountry(countriesData) {
  if (countriesData.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (countriesData.length === 1) {
    clearCountry();
    infoEl.innerHTML = `<div class="country-info__container">
      <img class="country-info__img" src="${
        countriesData[0].flags.svg
      }" width="200px" alt=""/>
      <h1> ${countriesData[0].name.official}</h1>
      </div><div class="country-data__container">
      <p><b>Capital</b>: ${countriesData[0].capital}</p>
      <p><b>Population</b>: ${countriesData[0].population}</p>
      <p><b>Languages</b>: ${Object.values(countriesData[0].languages).join(
        ', '
      )}
      </p></div>`;
  }

  if (countriesData.length > 1 && countriesData.length <= 10) {
    clearCountry();
    const markup = countriesData
      .map(country => {
        return `<li class="country-list__item">
          <img class="country-list__img" src="${country.flags.png}" width="50px" alt=""/>
          <p> ${country.name.official}</p>
          </li>`;
      })
      .join('');
    listEl.innerHTML = markup;
  }
}
