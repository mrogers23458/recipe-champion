//noticed foundation JS is throwing errors in the console, will add as an issue in github
// variable to target drop down menu button
var menuBtn = document.getElementById('dropBtn')
//console log to make sure targeting the right element
console.log(menuBtn)
// variable to target the find recipe button
var searchBtn = document.getElementById('search')
//console log to make sure targeting the right element
console.log(searchBtn)
var dropDownMenu = document.querySelector('.dropdown-content')

function printDropMenu(){
    dropDownMenu.classList.toggle('show')
    console.log(dropDownMenu)
}
//function to redirect to main page
function goToMain(){
    window.location.href = "./assets/main.html"
}

//on click runs go to main, so when 'find recipes' button with id 'search' is clicked it re-directs to main content page
searchBtn.addEventListener('click', goToMain)
menuBtn.addEventListener('click', printDropMenu)