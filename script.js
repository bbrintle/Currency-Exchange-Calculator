// date
window.onload = function(){
    var day = document.getElementById("currentDay");
    var now = moment().format("MMMM Do YYYY");
    day.innerHTML = now;
}

//function
function conversion(){   
var currency = document.getElementById("currencyName").value;

var urlQuery = "https://v6.exchangerate-api.com/v6/0447b7806aa3c6c9ff66b0a6/latest/" + ;
// var amountToConvernt = document.getElementById("amount");
// var base = conversion.Rates;
//var  = document.getElementbyID("Country code ");

// console.log(urlQuery)
//api
// $.ajax({
//     url: urlQuery,
//     method: "GET"
// }).then(function(response){
//     console.log(response)
// });

}