//noticed foundation JS is throwing errors in the console, will add as an issue in github

// variable to target the find recipe button
var searchBtn = document.getElementById('search')
//console log to make sure targeting the right element
console.log(searchBtn)

//function to redirect to main page
function goToMain(){
    window.location.href = "./assets/main.html"
}

//on click runs go to main, so when 'find recipes' button with id 'search' is clicked it re-directs to main content page
searchBtn.addEventListener('click', goToMain)