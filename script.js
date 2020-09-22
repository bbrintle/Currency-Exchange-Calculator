//When the window loads, we will set the date on the site
window.onload = function(){
    var day = document.querySelector(".date");
    day.textContent = moment().format("MMMM Do YYYY");
}

//Assign our global variables
var amountToConvert = 0;
var combinedAmount = 0;
var totalAmountNeeded = 0;
var usedCurrencyArray = ["USD"];

//Create a few variables that get the Elements we need to collect our values
var totalAmountElement = document.getElementById("total-amount");
var amountInput = document.getElementById("amount");
var selectCurrencyElement = document.getElementById('currency-picker');
var selectMainCurrencyElement = document.getElementById("default-currency-picker");
var defaultFlag = document.getElementById("default-flag");
var refreshBtn = document.getElementById("refresh");
var mainDisplayDiv = document.querySelector(".currency");
var addCurrencyBtn = document.getElementById("add-currency-btn");

//Function that will change all of the prices based on exchange rate in each of the currency boxes
function updateExchangePrice(API){
    for (var i = 1; i < usedCurrencyArray.length; i++){
        var inputElement = document.getElementById(usedCurrencyArray[i] + "-input");
        var currencyElement = document.getElementById(usedCurrencyArray[i] + "-p");
        var currentExchangeRate = exchangeAPICollector(API, usedCurrencyArray[i]);
        //Do the math for conversion rates
        exchangeRate = inputElement.value / currentExchangeRate;
        currencyElement.textContent = inputElement.value + " " + usedCurrencyArray[i] + " equals " + exchangeRate.toFixed(2) + " " + selectMainCurrencyElement.value;
        combinedAmount = combinedAmount + exchangeRate;
        totalAmountNeeded = amountInput.value - combinedAmount;
    };

    //Check if the totalAmountNeeded is negative, positive, or undefined
    if(totalAmountNeeded === 0){
        totalAmountElement.textContent = "Alright! You have exactly the right amount to make this trip happen!"
    }
    else if(totalAmountNeeded < 0){
        newAmount = totalAmountNeeded * -1;
        totalAmountElement.textContent = "Keep saving! You need " + newAmount.toFixed(2) + " until you have reached your goal!";
    }else{
        totalAmountElement.textContent = "Great! You have save enough! You should have " + totalAmountNeeded.toFixed(2) + " remaining after your trip!";
    }
};

//Function that will identify the selected option within a Select Dropdown
function getSelectedCurrencyFromDropdown(selectEle) {
    var getEle;
    for ( var i = 0, len = selectEle.options.length; i < len; i++ ) {
        getEle = selectEle.options[i];
        if ( getEle.selected === true ) {
            break;
        }
    }
    return getEle;
};

//Function that sets the flag icon for Base Currency
function setFlag(){
    var currencyID = getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value;
    defaultFlag.setAttribute('src', chooseCorrectFlag(currencyID));
};

//Function that pulls the API for the provided currencyID
function pullAPI(currencyID){
    var myURL = "https://v6.exchangerate-api.com/v6/0447b7806aa3c6c9ff66b0a6/latest/" + currencyID;
    $.ajax({
        url: myURL,
        method: "GET"
        }).then(function(response) {
            updateExchangePrice(response);
        });
};

//Crypto Currency API

// function cryptoAPI(){
//     //api request
//     var cryptoURL = "https://api.coingecko.com/api/v3/coins/list";
//     $.ajax({
//         url: cryptoURL,
//         method: "GET"
//         }).then(function(response) {
//             $("<option>").val("bitcoin")
//             $("<option>").val("ethereum")
//             $("<option>").val("tether")
//             $("<option>").val("ripple")
//             $("<option>").val("polkadot")
//             $("<option>").val("bitcoin-cash")
//             $("<option>").val("binancecoin")
//             $("<option>").val("chainlink")
//             $("<option>").val("crypto-com-chain")
//             $("<option>").val("litecoin")
//     });
// };

// var exchange_id = ""
// $("#crypto").change(function() {
//     exchange_id = $(this).children(":selected").attr("id");
// });

// function cryptoConversion(){
//     let base = $('#default-crypto-picker').val()
//     let exchange = exchange_id
//     $.ajax({
//         url: `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=${exchange}`,
//         method: "GET"
//         }).then(function(response) {
//             //console.log(response);
//     })
// };

//Button that adds an additional currency box based on the currently selected dropdown
addCurrencyBtn.addEventListener('click', function(){
    var selectedCurrency = getSelectedCurrencyFromDropdown(selectCurrencyElement).value;
    
    if(usedCurrencyArray.indexOf(selectedCurrency) === -1){
        //Cancel Button Creation
        var cancelBtn = document.createElement("button");
        cancelBtn.textContent = "X";
        cancelBtn.setAttribute("class", "cancel-button");
        cancelBtn.addEventListener('click', function(){
            newCurrencyContainer.remove();
            usedCurrencyArray.splice(usedCurrencyArray.indexOf(selectedCurrency), 1);
        });
        //Flag Image Creation
        var newFlagImg = document.createElement('img');
        newFlagImg.setAttribute("src", chooseCorrectFlag(selectedCurrency))
        newFlagImg.setAttribute('class', "flag");
        //User Input Creation
        var newCurrencyInput = document.createElement("input");
        newCurrencyInput.setAttribute('type', "number");
        newCurrencyInput.setAttribute('id', selectedCurrency + "-input");
        newCurrencyInput.setAttribute('value', '0.00');
        //Currency Name Lable Creation
        var newCurrencyName = document.createElement("p");
        newCurrencyName.setAttribute('id', selectedCurrency + "-p");
        newCurrencyName.textContent = selectedCurrency;
        //Create the Div that all the above info will be shoved inside of
        var newCurrencyContainer = document.createElement("div");
        newCurrencyContainer.setAttribute("class", "currency-box");
        newCurrencyContainer.appendChild(newFlagImg);
        newCurrencyContainer.appendChild(newCurrencyInput);
        newCurrencyContainer.appendChild(cancelBtn);
        newCurrencyContainer.appendChild(newCurrencyName);
        //Append the Div above to mainDisplayDiv
        mainDisplayDiv.appendChild(newCurrencyContainer);
        //Add the ID to the array so that it cannot be used again
        usedCurrencyArray.push(selectedCurrency);
    };
});

//This will run when the refreshBtn is clicked
refreshBtn.addEventListener('click', function(){
    combinedAmount = 0;
    pullAPI(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value);
});

//When the Main Option within the Select is selected, this will run
selectMainCurrencyElement.addEventListener("change", function(){
    combinedAmount = 0;
    setFlag();
    pullAPI(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value);
    usedCurrencyArray.shift();
    usedCurrencyArray.unshift(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value);
});

//cryptoAPI();
//cryptoConversion()
setFlag();
pullAPI(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value);