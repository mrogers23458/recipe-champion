// Spoonacular API Key
const spoonApiKey = "apiKey=57ad59d77a0f469ab570c2f890ffb990";

// Object to construct Spoonacular Urls
var spoonacularUrls = {
  // Known base Urls for various API calls
  apiUrl: "https://api.spoonacular.com/",
  jokeUrl: "food/jokes/random",
  triviaUrl: "food/trivia/random",
  randomRecipesUrl: "recipes/random",
  findByIngredientsUrl: "recipes/findByIngredients",

  // Create base url request with api key and optional parameters string
  constructBaseUrl: function (url, paramsString="") {
    var baseUrl = this.apiUrl;
    
    baseUrl += url;
    baseUrl += `?${spoonApiKey}`
    baseUrl += paramsString;

    return baseUrl;
  },

  // Create Request Url for find recipe by ingredients
  findByIngredients: function (ingredients, numberOfRecipes=10, ignorePantry=true) {
    let count = 0;
    let baseUrl = this.constructBaseUrl(this.findByIngredientsUrl)

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

// Create full request url w/optional additional parameters for a Spoonacular API call
function apiCall(baseUrl, params = {}) {
  let paramsString = ""

  if (params != null) {
    for (let [key, value] of Object.entries(params)) {
      paramsString += `&${key}=${value}`;
    }
  };

  let requestUrl = baseUrl + paramsString;

  return requestUrl;
}

// DEBUG Request call
const requestUrl = spoonacularUrls.findByIngredients(['apple', 'derp', 'banana'], 15, false)
console.log(requestUrl)

fetch(requestUrl).then( function(response) {
  if (!response.status == 200) {
    // TODO: 404 Redirect
  }
  return response.json();

}).then( function(data) {
  spoon(data);
})

function spoon(data) {
  // TODO: Expand to handle various API calls
  console.log(data)
}