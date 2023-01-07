import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const ul = document.querySelector('.country-list');

input.addEventListener('input', debounce(() => {

  if(!input.value.trim()){
    ul.innerHTML = ''
    return
  }

  fetchCountries(input.value.trim()).then((countries) => {
    const amount = countries.length;

    if (amount > 10) {
      ul.innerHTML = ''
      return Notify.info('Too many matches found. Please enter a more specific name.');

    } else if (amount >= 2 && amount <= 10) {
      renderCountriesList(countries)

    } else if(amount === 1){
      renderCountry(countries[0])
    }

  }).catch(() => {
    ul.innerHTML = '';
    Notify.failure('Oops, there is no country with that name');
  });

}, DEBOUNCE_DELAY));

function renderCountriesList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class='country-container'>
          <img src=${flags.svg} width='50px'>
          <p>${name.official}</p>
         </li>`
    }).join('')

  ul.innerHTML = markup
}

function renderCountry (country) {
  const markup = `<li>
          <div class='country-container'>
            <img src=${country.flags.svg} width='50px'>
            <b class='country-name'>${country.name.official}</b>
          </div>
          <p><b>Capital:</b> ${country.capital}</p>
          <p><b>Population:</b> ${country.population}</p>
          <p><b>Languages:</b> ${Object.values(country.languages).join(', ')}</p>
         </li>`

  ul.innerHTML = markup
}