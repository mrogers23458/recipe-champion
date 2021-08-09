//word cloud global variables
const myTags = [];
const wordcloudDivEl = $('#wordCloudHolderEl')
var test = document.querySelector('.content')

// Global Page Elements
const menuBtn = $('#dropBtn');
const dropDownMenu = document.querySelector('.dropdown-content');
const historyBox = $('.history-wrapper');

// Global Variables
var lastSearch = [];
var slotHasFocus = "";

// Landing Page Elements
const findRecipeBtn = $('#land-find-recipe-btn');
const leadEl = $('#lead');

// Main Page Elements
const mainSrchBtn = $('#main-search-btn');
const mainSrchInput = $('#main-search-input');
const recipeContainer = $('#recipeContainer');
const recipeCompareContainer = $('#recipe-compare-container');
const slot1 = $('.recipe-compare-card-1').attr('name', 'slot1');
const slot2 = $('.recipe-compare-card-2').attr('name', 'slot2');

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
  findByIngredients: function (ingredientsArray, numberOfRecipes=10, ignorePantry=true) {
    let count = 0;
    let baseUrl = this.constructBaseUrl(this.findByIngredientsRequest)

    // Add parameters for findByIngredient
    ingredientsArray.forEach(item => {

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
function searchByIngredients(ingredientsArray) {
  let baseUrl = spoonacularUrls.findByIngredients(ingredientsArray);

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
  console.log('Calling spoonacular: ', baseUrl)
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
      alert(`Spoonacular responded with ${response.status}`);
    }
    return response.json();
  
  }).then( function(data) {
    // TODO: Do something neat with data
    // OR pass data to new function to handle various API requests
    processSpoonacularData(data);
    //function call to populate word cloud with fetched Data
    populateWordCloud(data)
    
    return data;
  }).catch((error) => {
    console.log(error);
  });
}

function processSpoonacularData(data) {
  // TODO: Expand to handle various API calls
  localStorage.setItem('queryArray', JSON.stringify(data));
  //return data; //<--don't think this is necessary, unless the call needs it for something
}

// actual function to populate wordcloud
function populateWordCloud(data){
  //iteration for 10 recipes
  const myTags = []
  test.innerHTML = ''

  for(i=0; i < 10; i++){
    var recipesArray = data[i].title
      myTags.push(recipesArray)
  }
  
  // renders the word cloud to div with class content, with tags pushed from iteration
  TagCloud('.content', myTags, {
    // word cloud rendering options
    
    // radius in px
    radius: 400,

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
  let ingredientsArray = mainSrchInput.val().replace(/\s/g,'').split(',');
  searchByIngredients(ingredientsArray)
  printHistory(ingredientsArray)
}

//function to append search results
function printHistory(ingredientsArray) {
    //appends searches to search history box
    historyBox.append(`<div id='history-card'><p>${ingredientsArray}</p></div>`)
    
    //sets local storage to the most recent search
    localStorage.setItem('srchHistory', ingredientsArray)
}

function getStoredQuery() {
  if ( localStorage.getItem('queryArray') != null) {
    var savedData = JSON.parse(localStorage.getItem('queryArray'));
  } else {
    console.log('No saved search data');
  }
  return savedData;
}

// Recipe Card Class 
class RecipeCard {
  constructor(recipeObject) {
    this.id = recipeObject.id;
    this.title = recipeObject.title;
    this.image = recipeObject.image;
    this.imageType = recipeObject.imageType;
    this.likes = recipeObject.likes;
    this.missedIngredientCount = recipeObject.missedIngredientCount;
    this.missedIngredients = recipeObject.missedIngredients;
    this.unusedIngredients = recipeObject.unusedIngredients;
    this.usedIngredientCount = recipeObject.usedIngredientCount;
    this.usedIngredients = recipeObject.usedIngredients;

    this.buildCard = function buildCard() {
      // Build Card Elements with selected data provided by the Spoonacular API
      let newRecipeCard = $('<div>').addClass("recipeCard").attr('data-id', this.id);
      let newRecipeTitle = $('<h3>').addClass("recipeTitle").text(this.title);
      let newRecipeImage = $('<img>').addClass("recipeImage").attr('src', this.image);
      let newRecipeOl = $('<ol>').addClass("ingredientList").attr('data-id', this.id);
      newRecipeCard.append(newRecipeTitle, newRecipeImage, newRecipeOl);

      console.log(this.usedIngredients)
      this.usedIngredients.forEach((ele) => {
        console.log(ele)
        let newRecipeIngUsed = $('<li>').addClass("usedIngredient").attr({'data-id': this.id, 'aisle': ele.aisle}).text(ele.originalString);
        newRecipeOl.append(newRecipeIngUsed);
      })

      this.missedIngredients.forEach((ele2) => {
        let newRecipeIngMiss = $('<li>').addClass("missIngredient").attr({'data-id': this.id, 'aisle': ele2.aisle}).text(ele2.originalString);
        newRecipeOl.append(newRecipeIngMiss);
      })

      return newRecipeCard;
    };  
  }
}

//Build cards when called
function buildAllCards (recipesArray) {
  $('.recipeCard').remove();
  recipesArray.forEach ((element) => {
    newRecipeCard = $('<div class="recipeCard" data-id='+element.id+'></div>');
    newRecipeTitle = $('<h3 class="recipeTitle" data-id='+element.id+'>'+element.title+'</h3>');
    newRecipeImage = $('<img class="recipeImage" src='+element.image+' data-id='+element.id+'>');
    newRecipeOl = $('<ol class="ingredientList" data-id='+element.id+' "></ol>');
    newRecipeCard.append(newRecipeTitle, newRecipeImage, newRecipeOl);
    element.usedIngredients.forEach((ele) => {
      let newRecipeIngUsed = $('<li class="usedIngredient" data-id='+element.id+' aisle="'+ele.aisle+'">'+ele.originalString+'</li>');
      newRecipeOl.append(newRecipeIngUsed);
    })
    element.missedIngredients.forEach((ele2) => {
      let newRecipeIngMiss = $('<li class="missIngredient" data-id='+element.id+' aisle="'+ele2.aisle+'">'+ele2.originalString+'</li>');
      newRecipeOl.append(newRecipeIngMiss);
    })
    $('#recipeContainer').append(newRecipeCard);
  })
}

function getRecipeId(recipeTitle) {
  let savedData = getStoredQuery();
  let recipe = savedData.find(recipe => {
    return recipe.title == recipeTitle;
  })

  let recipeId = recipe.id;

  return recipeId;
}

// Get Recipie by Id
function getRecipeById(id) {
  let savedData = getStoredQuery();
  let recipeObject = savedData.find(recipe => {
    return recipe.id == id;
  });
  
  let newRecipeCard = new RecipeCard(recipeObject);

  return newRecipeCard.buildCard();
}

// Compare Section Logic
function compareSlotSelect(recipeId) {
  let recipeCard = getRecipeById(recipeId);

  // Append Card to the Recipe Compare Container
  if (slot1.children().length < 1) {
    slot1.append(recipeCard);
    
  } else if (slot2.children().length < 1){
    slot2.append(recipeCard);

  } else {
    // Select Slot By Last Focus
    if (slotHasFocus === "slot1") {
      slot1.children().remove();
      slot1.append(recipeCard);

    } else if (slotHasFocus === "slot2") {
      slot2.children().remove();
      slot2.append(recipeCard);

    } else {
      return;
    }
  }
}

// Added Button Event Listeners
menuBtn.on('click', printDropMenu)
mainSrchBtn && mainSrchBtn.on('click', searchAndSave);
findRecipeBtn && findRecipeBtn.on('click', goToMain);

// TODO: Update this to word cloud button event once available
recipeContainer && recipeContainer.on('click', (event) => {
  let recipeId = $(event.target).attr('data-id');

  compareSlotSelect(recipeId)
});

// To give last used Recipe Container focus so we know which recipe should be switched out
recipeCompareContainer && recipeCompareContainer.on('click', (event) => {
  // Check if the clicked target is a slot 1 or 2 item
  if ($('.recipe-compare-card-1').has($(event.target)).length === 1) {
    slotHasFocus = "slot1";
  } else if ($('.recipe-compare-card-2').has($(event.target)).length === 1) {
    slotHasFocus = "slot2";
  }
})

// Search from history list
historyBox.on('click', function(event){
  let clickValue = event.target.textContent
  let ingredientsArray = clickValue.replace(/\s/g,'').split(',');
  searchByIngredients(ingredientsArray);
});

// Click function for wordcloud items
wordcloudDivEl.on('click', function(e){
  let recipeTitle = e.target.textContent;
  let recipeId = getRecipeId(recipeTitle);
  compareSlotSelect(recipeId);
})

// Add JOTD to landing page, check if 24hours has passed since last call
if (window.location.pathname.endsWith('index.html')) {
  if (localStorage.getItem('day1') == null) { 
    localStorage.setItem('day1', Date.now());
    addJoke();
  } else {
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
  let ingredientsList = populateMainSearch();
  searchByIngredients(ingredientsList);
} 

// DEBUG Tools:
//
//
/*Rebuilder button for dev purposes (or to keep?), 
will use a localy store search result array to build cards 
again without a new query*/
$('#rebuildCards').on('click', rebuildCards);

function rebuildCards() {
  let savedData = getStoredQuery();
  buildAllCards(savedData);
}

// DEBUG END
