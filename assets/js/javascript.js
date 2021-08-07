<<<<<<< HEAD
//noticed foundation JS is throwing errors in the console, will add as an issue in github
// variable to target drop down menu button
var menuBtn = document.getElementById('dropBtn')
var searchInputEl = document.getElementById('search-input')
//variable for the container that will hold the search history
var historyContainerEl = document.getElementById('history-wrapper')
// variable to target the find recipe button
var searchBtn = document.getElementById('search')

//variable for a button that is specific to searching on the main page
var mainSrchBtn = document.getElementById('main-search')
=======
// Global Page Elements
const menuBtn = $('#dropBtn')
const dropDownMenu = document.querySelector('.dropdown-content')

// Global Variables
var lastSearch = [];

// Landing Page Elements
const findRecipeBtn = $('#land-find-recipe-btn')
const leadEl = $('#lead');
>>>>>>> main

// Main Page Elements
const mainSrchBtn = $('#main-search-btn')
const mainSrchInput = $('#main-search-input')

// Spoonacular API Key
const spoonApiKey = "";

// Object to construct Spoonacular Urls
var spoonacularUrls = {
  // Known base Urls for various API calls
  apiUrl: "https://api.spoonacular.com/",
  jokeRequest: "food/jokes/random",
  triviaRequest: "food/trivia/random",
  randomRecipesRequest: "recipes/random",
  findByIngredientsRequest: "recipes/findByIngredients",

  // Create base url request with api key and optional parameters string
  constructBaseUrl: function (url, paramsString="") {
    var baseUrl = this.apiUrl;
    
    baseUrl += url;
    baseUrl += `?apiKey=${spoonApiKey}`
    baseUrl += paramsString;

    return baseUrl;
  },

  // Create Request Url for find recipe by ingredients
  findByIngredients: function (ingredients, numberOfRecipes=10, ignorePantry=true) {
    let count = 0;
    let baseUrl = this.constructBaseUrl(this.findByIngredientsRequest)

    // Add parameters for findByIngredient
    ingredients.forEach(item => {

      if (count == 0) {
        baseUrl += `&ingredients=${item}`;
      } else {
        baseUrl += `,+${item}`;
      }
      count++;
    })

    if (numberOfRecipes !== 10) {
      baseUrl += `&numberOfRecipes=${numberOfRecipes}`;
    }

    if (!ignorePantry) {
      baseUrl += `&ignorePantry=${ignorePantry}`
    }
    
    return baseUrl;
  },
}

// Add Joke of the Day
function addJoke() {
  const jokeEl = $('<p>').addClass('joke h3 text-center');
  const jokeRequest = spoonacularUrls.jokeRequest;
  const jokeRequestUrl = spoonacularUrls.constructBaseUrl(jokeRequest) ;

  apiCall(jokeRequestUrl).then((data) => {
    var jokeObject = data;
    jokeEl.text(jokeObject.text)
  });

  jokeEl.insertBefore(leadEl)
}

<<<<<<< HEAD
// Event listener for Landing page get ingredients button
btnExpandedEl.on('click', function(e) {
  const ingredientInputEl = $('#searchInput');
  let ingredientsArray = ingredientInputEl.val().replace(/\s/g,'').split(',');
=======
// Search By Ingredients
function searchByIngredients() {
  let ingredientsArray = mainSrchInput.val().replace(/\s/g,'').split(',');
>>>>>>> main
  let baseUrl = spoonacularUrls.findByIngredients(ingredientsArray);
  
  //appends searches to search history box
  let historyBox = $('.history-wrapper');
  historyBox.append(`<div class='history-card'><p>${ingredientsArray}</p></div>`)
  
  //sets local storage to the most recent search
  localStorage.setItem('srchHistory', ingredientsArray)


  apiCall(baseUrl);
<<<<<<< HEAD

});
=======
}

// Save last search from Landing Page in localStorage
function saveSearchInput(searchInput) {
  let ingredientSearchArray = searchInput.replace(/\s/g,'').split(',')
    
  try {
    localStorage.setItem('lastSearch', JSON.stringify(ingredientSearchArray));
  } catch (error) {
    console.log(error)
  }
}

// Redirect to Main Page with 
function redirectUrlWithParameters(searchInput) {
  let mainUrl = "./assets/main.html";
  let params = `?ingredients=${searchInput.replace(/\s/g,'')}`;
  let targetUrl = mainUrl + params;

  window.location.href = targetUrl;
  
  return targetUrl;
}

// Poplulate Main Search input with localstorage
function populateMainSearch() {
  let lastSearch = JSON.parse(localStorage.getItem('lastSearch'))
  $('#main-search-input').val(lastSearch.join(', '))
  return lastSearch;
}
>>>>>>> main

// Create full request url w/optional additional parameters for a Spoonacular API call
function apiCall(baseUrl, params = {}) {
  let paramsString = ""

  // Add additional params if provided
  if (params != null) {
    for (let [key, value] of Object.entries(params)) {
      paramsString += `&${key}=${value}`;
    }
  };

  let requestUrl = baseUrl + paramsString;

  return fetch(requestUrl).then( function(response) {
    if (!response.status == 200) {
      // TODO: 404 Redirect
    }
    return response.json();
  
  }).then( function(data) {
    // TODO: Do something neat with data
    // OR pass data to new function to handle various API requests
    processSpoonacularData(data);
    return data;
  }).catch((err) => {
    console.log(err);
  });
}

function processSpoonacularData(data) {
  // TODO: Expand to handle various API calls
  console.log(data)
  return data;
}

function printDropMenu(){
  dropDownMenu.classList.toggle('show')
}
//function to redirect to main page
function goToMain() {
  let inputValue = $('#land-input').val()
  saveSearchInput(inputValue);
  redirectUrlWithParameters(inputValue);
}

//function to append search results
function printHistory(){
  //TODO: Add Function
}

//function to create a search history
function printHistory(){
  console.log('test me')

}

<<<<<<< HEAD

//on click runs go to main, so when 'find recipes' button with id 'search' is clicked it re-directs to main content page


menuBtn.addEventListener('click', printDropMenu)
=======
// Added Button Event Listeners
menuBtn.on('click', printDropMenu)
mainSrchBtn && mainSrchBtn.on('click', searchByIngredients);
findRecipeBtn && findRecipeBtn.on('click', goToMain)

// Add JOTD to landing page
if (window.location.pathname.endsWith('index.html')) {
  addJoke();
}
>>>>>>> main

// Functions on switch to Main Page
if (window.location.pathname.includes('main.html')) {
  populateMainSearch();
  searchByIngredients();
}
