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

function chooseCorrectFlag(countryID){
    switch(countryID){
        case 'USD':
            return "https://www.countryflags.io/us/flat/64.png";
        case 'AED':
            return "https://www.countryflags.io/ae/flat/64.png";
        case 'ARS':
            return "https://www.countryflags.io/ar/flat/64.png";
        case 'AUD':
            return "https://www.countryflags.io/au/flat/64.png";
        case 'BGN':
            return "https://www.countryflags.io/bg/flat/64.png";
        case 'BRL':
            return "https://www.countryflags.io/br/flat/64.png";    
        case 'BSD':
            return "https://www.countryflags.io/bs/flat/64.png";     
        case 'CAD':
            return "https://www.countryflags.io/ca/flat/64.png";  
        case 'CHF':
            return "https://www.countryflags.io/ch/flat/64.png";  
        case 'CLP':
            return "https://www.countryflags.io/cl/flat/64.png";  
        case 'CNY':
            return "https://www.countryflags.io/cn/flat/64.png";  
        case 'COP':
            return "https://www.countryflags.io/co/flat/64.png";  
        case 'CZK':
            return "https://www.countryflags.io/cz/flat/64.png";  
        case 'DKK':
            return "https://www.countryflags.io/dk/flat/64.png";  
        case 'DOP':
            return "https://www.countryflags.io/do/flat/64.png";  
        case 'EGP':
            return "https://www.countryflags.io/eg/flat/64.png";  
        case 'EUR':
            return "https://www.countryflags.io/eu/flat/64.png";  
        case 'FJD':
            return "https://www.countryflags.io/fj/flat/64.png";  
        case 'GBP':
            return "https://www.countryflags.io/gb/flat/64.png";  
        case 'GTQ':
            return "https://www.countryflags.io/gt/flat/64.png";  
        case 'HKD':
            return "https://www.countryflags.io/hk/flat/64.png";
        case 'HRK':
            return "https://www.countryflags.io/hr/flat/64.png";  
        case 'HUF':
            return "https://www.countryflags.io/hu/flat/64.png";  
        case 'IDR':
            return "https://www.countryflags.io/id/flat/64.png";  
        case 'ILS':
            return "https://www.countryflags.io/il/flat/64.png"; 
        case 'INR':
            return "https://www.countryflags.io/in/flat/64.png";
        case 'ISK':
            return "https://www.countryflags.io/is/flat/64.png";
        case 'JPY':
            return "https://www.countryflags.io/jp/flat/64.png";
        case 'KRW':
            return "https://www.countryflags.io/kr/flat/64.png";
        case 'KZT':
            return "https://www.countryflags.io/kz/flat/64.png";
        case 'MVR':
            return "https://www.countryflags.io/mv/flat/64.png";
        case 'MXN':
            return "https://www.countryflags.io/mx/flat/64.png";
        case 'MYR':
            return "https://www.countryflags.io/my/flat/64.png";
        case 'NOK':
            return "https://www.countryflags.io/no/flat/64.png";
        case 'NZD':
            return "https://www.countryflags.io/nz/flat/64.png";
        case 'PAB':
            return "https://www.countryflags.io/pa/flat/64.png";
        case 'PEN':
            return "https://www.countryflags.io/pe/flat/64.png";
        case 'PHP':
            return "https://www.countryflags.io/ph/flat/64.png";
        case 'PKR':
            return "https://www.countryflags.io/pk/flat/64.png";
        case 'PLN':
            return "https://www.countryflags.io/pl/flat/64.png";
        case 'PYG':
            return "https://www.countryflags.io/py/flat/64.png";
        case 'RON':
            return "https://www.countryflags.io/ro/flat/64.png";
        case 'RUB':
            return "https://www.countryflags.io/ru/flat/64.png";
        case 'SAR':
            return "https://www.countryflags.io/sa/flat/64.png";
        case 'SEK':
            return "https://www.countryflags.io/se/flat/64.png";
        case 'SGD':
            return "https://www.countryflags.io/sg/flat/64.png";
        case 'THB':
            return "https://www.countryflags.io/th/flat/64.png";
        case 'TRY':
            return "https://www.countryflags.io/tr/flat/64.png";
        case 'TWD':
            return "https://www.countryflags.io/tw/flat/64.png";
        case 'UAH':
            return "https://www.countryflags.io/ua/flat/64.png";
        case 'UYU':
            return "https://www.countryflags.io/uy/flat/64.png";
        case 'ZAR':
            return "https://www.countryflags.io/za/flat/64.png";
    };
};

function exchangeAPICollector(API, currencyID){
    switch(currencyID){
        case 'USD':
            return API.conversion_rates.USD;
        case 'AED':
            return API.conversion_rates.AED;
        case 'ARS':
            return API.conversion_rates.ARS;
        case 'AUD':
            return API.conversion_rates.AUD;
        case 'BGN':
            return API.conversion_rates.BGN;
        case 'BRL':
            return API.conversion_rates.BRL;
        case 'BSD':
            return API.conversion_rates.BSD;
        case 'CAD':
            return API.conversion_rates.CAD;
        case 'CHF':
            return API.conversion_rates.CHF;
        case 'CLP':
            return API.conversion_rates.CLP;
        case 'CNY':
            return API.conversion_rates.CNY;
        case 'COP':
            return API.conversion_rates.COP;
        case 'CZK':
            return API.conversion_rates.CZK;
        case 'DKK':
            return API.conversion_rates.DKK;
        case 'DOP':
            return API.conversion_rates.DOP;
        case 'EGP':
            return API.conversion_rates.EGP;
        case 'EUR':
            return API.conversion_rates.EUR;
        case 'FJD':
            return API.conversion_rates.FJD;
        case 'GBP':
            return API.conversion_rates.GBP;
        case 'GTQ':
            return API.conversion_rates.GTQ;
        case 'HKD':
            return API.conversion_rates.HKD;
        case 'HRK':
            return API.conversion_rates.HRK;
        case 'HUF':
            return API.conversion_rates.HUF;
        case 'IDR':
            return API.conversion_rates.IDR;
        case 'ILS':
            return API.conversion_rates.ILS;
        case 'INR':
            return API.conversion_rates.INR;
        case 'ISK':
            return API.conversion_rates.ISK;
        case 'JPY':
            return API.conversion_rates.JPY;
        case 'KRW':
            return API.conversion_rates.KRW;
        case 'KZT':
            return API.conversion_rates.KZT;
        case 'MVR':
            return API.conversion_rates.MVR;
        case 'MXN':
            return API.conversion_rates.MXN;
        case 'MYR':
            return API.conversion_rates.MYR;
        case 'NOK':
            return API.conversion_rates.NOK;
        case 'NZD':
            return API.conversion_rates.NZD;
        case 'PAB':
            return API.conversion_rates.PAB;
        case 'PEN':
            return API.conversion_rates.PEN;
        case 'PHP':
            return API.conversion_rates.PHP;
        case 'PKR':
            return API.conversion_rates.PKR;
        case 'PLN':
            return API.conversion_rates.PLN;
        case 'PYG':
            return API.conversion_rates.PYG;
        case 'RON':
            return API.conversion_rates.RON;
        case 'RUB':
            return API.conversion_rates.RUB;
        case 'SAR':
            return API.conversion_rates.SAR;
        case 'SEK':
            return API.conversion_rates.SEK;
        case 'SGD':
            return API.conversion_rates.SGD;
        case 'THB':
            return API.conversion_rates.THB;
        case 'TRY':
            return API.conversion_rates.TRY;
        case 'TWD':
            return API.conversion_rates.TWD;
        case 'UAH':
            return API.conversion_rates.UAH;
        case 'UYU':
            return API.conversion_rates.UYU;
        case 'ZAR':
            return API.conversion_rates.ZAR;
    };
};