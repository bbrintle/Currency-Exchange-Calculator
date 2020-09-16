// date
window.onload = function(){
    var day = document.getElementById("currentDay");
    var now = moment().format("MMMM Do YYYY");
    day.innerHTML = now;
}

//link to api
//https://v6.exchangerate-api.com/v6/e0620196d78ecdae02db1048/latest/ + userInput

//API KEY
//e0620196d78ecdae02db1048

//api request
$.ajax({
    URL:"https://cors-anywhere.herokuapp.com/https://v6.exchangerate-api.com/v6/0447b7806aa3c6c9ff66b0a6/latest/USD",
    method: "GET"
}).then(function(response){
    console.log(response)
});


