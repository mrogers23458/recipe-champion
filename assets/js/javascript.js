// Page Elements
const contentEl = $('.content');
const contentTitleEl = $('<h1>');
const jokeUrl = "food/jokes/random";
const spoonApiKey = "apiKey=57ad59d77a0f469ab570c2f890ffb990";

var spoonacularUrls = {
  jokeUrl: "food/jokes/random",
  triviaUrl: "food/trivia/random",
  randomRecipesUrl: "recipes/random",
  findByIngredientsUrl: `recipes/findByIngredients/?${spoonApiKey}`,

  findByIngredients: function (ingredients, numberOfRecipes=10, ignorePantry=true) {
    let count = 0;

    ingredients.forEach(item => {
      console.log(item)

      if (count == 0) {
        this.findByIngredientsUrl.concat(`ingredients=${item}`);
      } else {
        this.findByIngredientsUrl.concat(`,+${item}`);
      }
      count++;
    })

    console.log(numberOfRecipes)
    if (numberOfRecipes !== 10) {
      this.findByIngredientsUrl.concat(`&numberOfRecipes=${numberOfRecipes}`)
    }

    console.log(ignorePantry)
    if (ignorePantry) {
      this.findByIngredientsUrl.concat(`&ignorePantry=${ignorePantry}`)
    }
    
    console.log(this.findByIngredientsUrl);
    return this.findByIngredientsUrl;
  },
}

function apiCall(url, paramsArray = []) {
  var params = "";

  if (paramsArray != null)
    paramsArray.forEach(param => {
    params.concat(`&${param}`)
  });

  var requestUrl = `https://api.spoonacular.com/${url}?${spoonApiKey}${params}`

  return requestUrl;
}

// Fetch
const requestUrl = spoonacularUrls.findByIngredients(['apple', 'derp', 'banana'], 15, false)// apiCall(jokeUrl);
console.log(requestUrl)

// fetch(requestUrl).then( function(response) {
//   if (!response.status == 200) {
//     // 404 Redirect
//   }
//   return response.json();

// }).then( function(data) {
//   spoon(data);
// })

// function spoon(data) {
//   // Add joke
//   contentTitleEl.text(data.text);
//   contentEl.append(contentTitleEl);
//   console.log(data)
// }