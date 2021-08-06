// Global Page Elements
const menuBtn = $('#dropBtn')
const dropDownMenu = document.querySelector('.dropdown-content')

// Global Variables
var recentSearches = [];

// Landing Page Elements
const findRecipeBtn = $('#land-find-recipe-btn')
const leadEl = $('#lead');

// Main Page Elements
const mainSrchBtn = $('#main-search-btn')
const mainSrchInput = $('#main-search-input')

// Spoonacular API Key
const spoonApiKey = "c0b01345b7484f1b90b89bab3999317f";

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

// Search By Ingredients
function searchByIngredients() {
  let ingredientsArray = mainSrchInput.val().replace(/\s/g,'').split(',');
  let baseUrl = spoonacularUrls.findByIngredients(ingredientsArray);

  apiCall(baseUrl);
}

function saveSearchInput(searchInput) {
  recentSearches.push(searchInput)
  try {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  } catch (error) {
    console.log(error)
  }
}

function populateMainSearch() {
  let recentSearches = JSON.parse(localStorage.getItem('recentSearches'))
  $('#main-search-input').text(recentSearches.join(', '))
  return recentSearches;
}

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
  console.log(dropDownMenu)
}
//function to redirect to main page
function goToMain(){
  saveSearchInput($('#land-input').val());
  window.location.href = "./assets/main.html";
  populateMainSearch();
}

//function to append search results
function printHistory(){

}

function loadEverything(){
  goToMain()
  apiCall()
}

//on click runs go to main, so when 'find recipes' button with id 'search' is clicked it re-directs to main content page
menuBtn.on('click', printDropMenu)
mainSrchBtn && mainSrchBtn.on('click', searchByIngredients);
findRecipeBtn && findRecipeBtn.on('click', goToMain)

// Add JOTD to landing page
if (window.location.pathname.endsWith('index.html')) {
  addJoke();
}
