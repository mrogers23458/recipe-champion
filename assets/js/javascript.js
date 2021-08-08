//word cloud default values variable
const myTags = [];

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
const spoonApiKey = "a33faa16cf9b491e818074aba497f961";

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
    //function call to populate word cloud with fetched Data
    populateWordCloud(data)
    
    return data;
  }).catch((err) => {
    console.log(err);
  });
}

function processSpoonacularData(data) {
  // TODO: Expand to handle various API calls
  localStorage.setItem('queryArray', JSON.stringify(data));
  recipeCardBuild(data);
  console.log(data)

  
  return data;
}

// actual function to populate wordcloud
function populateWordCloud(data){
  //iteration for 10 recipes
  for(i=0; i < 10; i++){
    var recipesArray = data[i].title
      myTags.push(recipesArray)
  }
  
  // rends the word cloud to div with class content, with tags pushed from iteration
  TagCloud('.content', myTags,{
    // word cloud rendering options
    
    // radius in px
    radius: 300,

    // animation speed
    // slow, normal, fast
    maxSpeed: 'normal',
    initSpeed: 'normal',

    // 0 = top
    // 90 = left
    // 135 = right-bottom
    direction: 135,
    
    // interact with cursor move on mouse out
    keep: true
    
});

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
    console.log('No saved data');
  }
});
//Build cards when called
function recipeCardBuild (array) {
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

// Add JOTD to landing page
if (window.location.pathname.endsWith('index.html')) {
  addJoke();
}

// Functions on switch to Main Page
if (window.location.pathname.includes('main.html')) {
  populateMainSearch();
  searchByIngredients();
}


