var urlQuery;

// date
window.onload = function(){
    var day = document.getElementById("currentDay");
    var now = moment().format("MMMM Do YYYY");
    day.innerHTML = now;
}

//function
var amountToConvert = 0;
var amountInput = document.getElementById("amount");
var currencyElement = document.querySelector("option");
var selectCurrency = document.getElementById('CurrencyName');
function getSelectedOption(sel) {
    var opt;
    for ( var i = 0, len = sel.options.length; i < len; i++ ) {
        opt = sel.options[i];
        if ( opt.selected === true ) {
            break;
        }
    }
    return opt;
}
amountInput.addEventListener("change", function(){
    amountToConvert = amountInput.value;
    console.log(amountToConvert);
    var currencyID = getSelectedOption(selectCurrency)
    pullAPI(currencyID.value);
    console.log(currencyID.value);

});

function pullAPI(currencyID){
    var urlQuery = "https://v6.exchangerate-api.com/v6/0447b7806aa3c6c9ff66b0a6/latest/" + currencyID;
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