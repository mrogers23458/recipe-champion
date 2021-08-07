// Global Page Elements
const menuBtn = $('#dropBtn')
const dropDownMenu = document.querySelector('.dropdown-content')
const historyBox = $('.history-wrapper');

// Global Variables
var lastSearch = [];

// Landing Page Elements
const findRecipeBtn = $('#land-find-recipe-btn')
const leadEl = $('#lead');

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
  const jokeRequestUrl = spoonacularUrls.constructBaseUrl(jokeRequest);
  //Check if there is already a joke stored, if not do a call, otherwise use stored
  if (localStorage.getItem('todaysJoke') == null) {
    apiCall(jokeRequestUrl).then((data) => {
      jokeObject = data;
      console.log(jokeObject);
      jokeEl.text(jokeObject.text);
      localStorage.setItem('todaysJoke', jokeObject.text);
      jokeEl.insertBefore(leadEl);
    });
  } else {
    jokeObject = localStorage.getItem('todaysJoke');
    jokeEl.text(jokeObject);
    console.log(jokeObject);
    jokeEl.insertBefore(leadEl);
  }
}

// Search By Ingredients
function searchByIngredients() {
  let ingredientsArray = mainSrchInput.val().replace(/\s/g,'').split(',');
  let baseUrl = spoonacularUrls.findByIngredients(ingredientsArray);

  //sets local storage to the most recent search
  localStorage.setItem('srchHistory', ingredientsArray)


  apiCall(baseUrl);
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

// Create full request url w/optional additional parameters for a Spoonacular API call
function apiCall(baseUrl, params = {}) {
  let paramsString = ""
  console.log('Calling spoonacular: ',baseUrl)
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
      alert('Spoonacular responded with status 200');
    }
    return response.json();
  
  }).then( function(data) {
    // TODO: Do something neat with data
    // OR pass data to new function to handle various API requests
    console.log(data);
    processSpoonacularData(data);
    return data;
  }).catch((err) => {
    console.log(err);
  });
}

function processSpoonacularData(data) {
  // TODO: Expand to handle various API calls
  recipeCardBuild(data);
  console.log(data)
  //return data; //<--don't think this is necessary, unless the call needs it for something
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

// function to do a search by ingredients, and append the search terms to the history box
function searchAndSave(){
  searchByIngredients()
  printHistory()
}

//function to append search results
function printHistory(){
  //TODO: Add Function
    //appends searches to search history box
    let ingredientsArray = mainSrchInput.val().replace(/\s/g,'').split(',');
    historyBox.append(`<div id='history-card'><p>${ingredientsArray}</p></div>`)
    
}

historyBox.on('click', function(e){
  let clickValue = e.target.textContent
  searchByIngredients(clickValue)
})

/*Rebuilder button for dev purposes (or to keep?), 
will use a localy store search result array to build cards 
again without a new query*/
$('#rebuildCards').click( function rebuildCards () {
  if ( localStorage.getItem('queryArray') != null) {
    savedData = JSON.parse(localStorage.getItem('queryArray'));
    recipeCardBuild(savedData);
  } else {
    console.log('No saved search data');
  }
});
//Build cards when called
function recipeCardBuild (array) {
    localStorage.setItem('queryArray', JSON.stringify(array));
    $('.recipeCard').remove();
      array.forEach ((element,index,array) => {
        newRecipeCard = $('<div class="recipeCard" name="recipe '+element.id+'"></div>');
        newRecipeTitle = $('<h3 class="recipeTitle">'+element.title+'</h3>');
        newRecipeImage = $('<img class="recipeImage" src='+element.image+'>');
        newRecipeOl = $('<ol class="ingredientList" name="recipe '+element.id+'"></ol>');
        newRecipeCard.append(newRecipeTitle, newRecipeImage, newRecipeOl);
        element.usedIngredients.forEach((ele,i,arr) => {
          newRecipeIngUsed = $('<li class="usedIngredient" aisle="'+ele.aisle+'">'+ele.originalString+'</li>');
          newRecipeOl.append(newRecipeIngUsed);
        })
        element.missedIngredients.forEach((ele2,i2,arr2) => {
          newRecipeIngMiss = $('<li class="missIngredient" aisle="'+ele2.aisle+'">'+ele2.originalString+'</li>');
          newRecipeOl.append(newRecipeIngMiss);
        })
        $('#recipeContainer').append(newRecipeCard);
      })
}

// Added Button Event Listeners
menuBtn.on('click', printDropMenu)
mainSrchBtn && mainSrchBtn.on('click', searchAndSave);
findRecipeBtn && findRecipeBtn.on('click', goToMain)

// Add JOTD to landing page, check if 24hours has passed since last call
if (window.location.pathname.endsWith('index.html')) {
  if (localStorage.getItem('day1') == null) { 
    localStorage.setItem('day1', Date.now());
    addJoke();
  } else if (localStorage.getItem('day1') != null) {
    day1 = localStorage.getItem('day1');
    day2 = Date.now();
    if ( (day2-day1) >= 86400 ) { //24 hours = 86400 seconds
      addJoke();
    }
    localStorage.setItem('day1', day2);
  }
}

// Functions on switch to Main Page
if (window.location.pathname.includes('main.html')) {
  populateMainSearch();
  searchByIngredients();
}
