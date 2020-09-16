// date
window.onload = function(){
    var day = document.getElementById("currentDay");
    var now = moment().format("MMMM Do YYYY");
    day.innerHTML = now;
}

//function
function setCurrencies(){   
var currency = document.getElementById("currencyName").value;
//set a var to get the select options values 
//set currency you want to convert to
var urlQuery = "https://v6.exchangerate-api.com/v6/0447b7806aa3c6c9ff66b0a6/latest/" + currency;
var amountToConvernt = document.getElementById("amount");


// set base = usd




//api
console.log(urlQuery)
api
$.ajax({
    url: urlQuery,
    method: "GET"
}).then(function(response){
    console.log(response)
});

}


//convert to wanted currencies

function convert(base, currency){
    amountConverted = base * currency
    
}