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
var cryptoObject = {
    USD: 0,
    AED: 0,
    ARS: 0,
    AUD: 0,
    BGN: 0,
    BRL: 0,
    BSD: 0,
    CAD: 0,
    CHF: 0,
    CLP: 0,
    CNY: 0,
    COP: 0,
    CZK: 0,
    DKK: 0,
    DOP: 0,
    EGP: 0,
    EUR: 0,
    FJD: 0,
    GBP: 0,
    GTQ: 0,
    HKD: 0,
    HRK: 0,
    HUF: 0,
    IDR: 0,
    ILS: 0,
    INR: 0,
    ISK: 0,
    JPY: 0,
    KRW: 0,
    KZT: 0,
    MVR: 0,
    MXN: 0,
    MYR: 0,
    NOK: 0,
    NZD: 0,
    PAB: 0,
    PEN: 0,
    PKR: 0,
    PLN: 0,
    PYG: 0,
    RON: 0,
    RUB: 0,
    SAR: 0,
    SEK: 0,
    SGD: 0,
    THB: 0,
    TRY: 0,
    TWD: 0,
    UAH: 0,
    UYU: 0,
    ZAR: 0,
    btc: 0,
    eth: 0,
    usdt: 0,
    xrp: 0,
    dot: 0,
    bch: 0,
    bnb: 0,
    link: 0,
    cro: 0,
    ltc: 0
};

//Create a few variables that get the Elements we need to collect our values
var totalAmountElement = document.getElementById("total-amount");
var amountInput = document.getElementById("amount");
var selectCurrencyElement = document.getElementById('currency-picker');
var selectMainCurrencyElement = document.getElementById("default-currency-picker");
var defaultFlag = document.getElementById("default-flag");
var refreshBtn = document.getElementById("refresh");
var mainDisplayDiv = document.querySelector(".currency");
var addCurrencyBtn = document.getElementById("add-currency-btn");
var bitcoinTotal = document.getElementById("total");
var currencySymbolElement = document.getElementById("put-symbol-here");

//Function that will change all of the prices based on exchange rate in each of the currency boxes
function updateExchangePrice(API){
    var selectedBaseOption = getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value;
    for (var i = 1; i < usedCurrencyArray.length; i++){

        if(usedCurrencyArray[i] === "btc" ||
        usedCurrencyArray[i] === "eth" ||
        usedCurrencyArray[i] === "usdt" ||
        usedCurrencyArray[i] === "xrp" ||
        usedCurrencyArray[i] === "dot" ||
        usedCurrencyArray[i] === "bch" ||
        usedCurrencyArray[i] === "bnb" ||
        usedCurrencyArray[i] === "link" ||
        usedCurrencyArray[i] === "cro" ||
        usedCurrencyArray[i] === "ltc"){
            if(selectedBaseOption === "btc" ||
            selectedBaseOption === "eth" ||
            selectedBaseOption === "usdt" ||
            selectedBaseOption === "xrp" ||
            selectedBaseOption === "dot" ||
            selectedBaseOption === "bch" ||
            selectedBaseOption === "bnb" ||
            selectedBaseOption === "link" ||
            selectedBaseOption === "cro" ||
            selectedBaseOption === "ltc"){
                //Crypto Updates
                singlePullCryptoAPI(usedCurrencyArray[i], selectedBaseOption);
            }else{
                singlePullAPICrypto(selectedBaseOption, usedCurrencyArray[i]);
            }
        }else{
            var selectedDropdownCurrency = getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value;
            if(selectedDropdownCurrency === "btc" ||
            selectedDropdownCurrency === "eth" ||
            selectedDropdownCurrency === "xrp" ||
            selectedDropdownCurrency === "dot" ||
            selectedDropdownCurrency === "bch" ||
            selectedDropdownCurrency === "bnb" ||
            selectedDropdownCurrency === "link" ||
            selectedDropdownCurrency === "cro" ||
            selectedDropdownCurrency === "ltc"){
                //executes when Default is Crypto, but convert box is not crypto
                singlePullCryptoAPI(usedCurrencyArray[i], selectedDropdownCurrency);
            }else{
                //Physcial Currency Updates
                var inputElement = document.getElementById(usedCurrencyArray[i] + "-input");
                var currencyElement = document.getElementById(usedCurrencyArray[i] + "-p");
                var currentExchangeRate = exchangeAPICollector(API, usedCurrencyArray[i]);
                //Do the math for conversion rates
                exchangeRate = inputElement.value / currentExchangeRate;
                currencyElement.textContent = inputElement.value + " " + usedCurrencyArray[i] + " equals " + exchangeRate.toFixed(2) + " " + selectMainCurrencyElement.value;
                combinedAmount = combinedAmount + exchangeRate;
                totalAmountNeeded = amountInput.value - combinedAmount;
                updateSavingsDisplay(totalAmountNeeded);
            }
            
        }
    };
};

function updateSavingsDisplay(totalAmountNeeded){
        //Check if the totalAmountNeeded is negative, positive, or undefined
        if(totalAmountNeeded === 0 && usedCurrencyArray.length === 1){ } //do nothing
        else if(totalAmountNeeded === 0){
            totalAmountElement.textContent = "Alright! You have exactly the right amount to make this trip happen!"
        }
        else if(totalAmountNeeded < 0){
            newAmount = totalAmountNeeded * -1;
            totalAmountElement.textContent = "Keep saving! You need " + newAmount.toFixed(2) + " until you have reached your goal!";
        }else{
            totalAmountElement.textContent = "Great! You have save enough! You should have " + totalAmountNeeded.toFixed(2) + " remaining after your trip!";
        }
}

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
    setDefaultSymbol(currencyID);
};

function setDefaultSymbol(currencyID){
    var currencySymbol = chooseCurrencySymbol(currencyID);
    currencySymbolElement.innerHTML = currencySymbol;
}

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

function cryptoConversion(exchangeID){
    let base = getSelectedCurrencyFromDropdown(selectMainCurrencyElement).textContent;
    var exchange = exchangeID;
    $.ajax({
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=${exchange}`,
        method: "GET"
        }).then(function(response) {
            updateExchangePrice(response);
    });
};

function singlePullAPICrypto(exchangeID, base){
    var newBase = getCryptoFullName(base);
    $.ajax({
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${newBase}&vs_currencies=${exchangeID}`,
        method: "GET"
        }).then(function(response) {
            var cryptoExchangeRate = exchangeCryptoAPICollector(response, exchangeID, base);
            var inputElement = document.getElementById(base + "-input");
            var currencyElement = document.getElementById(base + "-p");
            cryptoObject[exchangeID] = cryptoExchangeRate;
            currentExchangeRate = cryptoObject[exchangeID];   
            exchangeRate = inputElement.value * currentExchangeRate;
            currencyElement.textContent = inputElement.value + " " + base.toUpperCase() + " equals " + exchangeRate.toFixed(2) + " " + selectMainCurrencyElement.value.toUpperCase();
            combinedAmount = combinedAmount + exchangeRate;
            totalAmountNeeded = amountInput.value - combinedAmount;
            updateSavingsDisplay(totalAmountNeeded);
    });
};

function singlePullCryptoAPI(exchangeID, base){
    var newBase = getCryptoFullName(base);
    var exchange = exchangeID;
    $.ajax({
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${newBase}&vs_currencies=${exchange}`,
        method: "GET"
        }).then(function(response) {          
            if(exchangeID === "btc" ||
            exchangeID === "eth" ||
            exchangeID === "xrp" ||
            exchangeID === "dot" ||
            exchangeID === "bch" ||
            exchangeID === "bnb" ||
            exchangeID === "link" ||
            exchangeID === "cro" ||
            exchangeID === "ltc"){
                var cryptoExchangeRate = exchangeCryptoAPICollector(response, exchangeID, base);
                var inputElement = document.getElementById(exchangeID + "-input");
                var currencyElement = document.getElementById(exchangeID + "-p");
                cryptoObject[exchangeID] = cryptoExchangeRate;
                currentExchangeRate = cryptoObject[exchangeID];   
                exchangeRate = inputElement.value / currentExchangeRate;
                currencyElement.textContent = inputElement.value + " " + exchangeID.toUpperCase() + " equals " + exchangeRate.toFixed(2) + " " + selectMainCurrencyElement.value.toUpperCase();
            }else{
                var cryptoExchangeRate = exchangeCryptoAPICollector(response, exchangeID, base);
                var inputElement = document.getElementById(exchangeID + "-input");
                var currencyElement = document.getElementById(exchangeID + "-p");
                currentExchangeRate = cryptoExchangeRate;
                exchangeRate = inputElement.value / currentExchangeRate;
                if(isNaN(exchangeRate)){
                    exchangeRate = 0;
                    currencyElement.textContent = "Sorry, this conversion rate does not exist currently."
                }else{
                    currencyElement.textContent = inputElement.value + " " + exchangeID.toUpperCase() + " equals " + exchangeRate.toFixed(2) + " " + selectMainCurrencyElement.value.toUpperCase();
                }
            }
            combinedAmount = combinedAmount + exchangeRate;
            totalAmountNeeded = amountInput.value - combinedAmount;
            updateSavingsDisplay(totalAmountNeeded);
    })
};

//Button that adds an additional currency box based on the currently selected dropdown
addCurrencyBtn.addEventListener('click', function(){

    var selectedCurrency = getSelectedCurrencyFromDropdown(selectCurrencyElement).value;
    
    if(usedCurrencyArray.indexOf(selectedCurrency) === -1){
        //Cancel Button Creation
        var cancelBtn = document.createElement("button");
        cancelBtn.textContent = "X";
        cancelBtn.setAttribute("class", "button is-info cancel-button");
        cancelBtn.addEventListener('click', function(){
            newCurrencyContainer.remove();
            usedCurrencyArray.splice(usedCurrencyArray.indexOf(selectedCurrency), 1);
        });
        //Flag Image Creation
        var newFlagImg = document.createElement('img');
        newFlagImg.setAttribute("src", chooseCorrectFlag(selectedCurrency))
        newFlagImg.setAttribute('class', "flag");
        //User Input Creation
        var newCurrencyInput = document.createElement("textarea");
        newCurrencyInput.setAttribute('type', "number");
        newCurrencyInput.setAttribute('id', selectedCurrency + "-input");
        newCurrencyInput.setAttribute("placeholder", '0.00');
        newCurrencyInput.setAttribute('class', 'textarea-exchange');
        //Currency ID Label Creation
        var newCurrencyIDName = document.createElement("p");
        newCurrencyIDName.setAttribute('id', selectedCurrency + "-p");
        newCurrencyIDName.textContent = selectedCurrency.toUpperCase();
        //Currency Name Label Creation
        var newCurrencyName = document.createElement("p");
        newCurrencyName.innerHTML = getSelectedCurrencyFromDropdown(selectCurrencyElement).textContent + " " + chooseCurrencySymbol(selectedCurrency)
        //Create the Div that all the above info will be shoved inside of
        var newCurrencyContainer = document.createElement("div");
        newCurrencyContainer.setAttribute("class", "currency-box");
        newCurrencyContainer.appendChild(newCurrencyName);
        newCurrencyContainer.appendChild(newFlagImg);
        newCurrencyContainer.appendChild(newCurrencyInput);
        newCurrencyContainer.appendChild(cancelBtn);
        newCurrencyContainer.appendChild(newCurrencyIDName);
        //Append the Div above to mainDisplayDiv
        mainDisplayDiv.appendChild(newCurrencyContainer);
        //Add the ID to the array so that it cannot be used again
        usedCurrencyArray.push(selectedCurrency);
    };
});

//This will run when the refreshBtn is clicked
refreshBtn.addEventListener('click', function(){
    if(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "btc" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "eth" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "usdt" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "xrp" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "dot" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "bch" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "bnb" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "link" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "cro" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "ltc"){
        combinedAmount = 0;
        var exchangeID = getSelectedCurrencyFromDropdown(selectCurrencyElement).value;
        cryptoConversion(exchangeID);
    }else{
        combinedAmount = 0;
        pullAPI(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value);
    }
});

//When the Main Option within the Select is selected, this will run
selectMainCurrencyElement.addEventListener("change", function(){
    if(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "btc" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "eth" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "usdt" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "xrp" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "dot" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "bch" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "bnb" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "link" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "cro" ||
    getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value === "ltc"){
        var exchangeID = getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value;
        cryptoObject = {
            btc: 0,
            eth: 0,
            usdt: 0,
            xrp: 0,
            dot: 0,
            bch: 0,
            bnb: 0,
            link: 0,
            cro: 0,
            ltc: 0
        };
        setFlag();
        cryptoConversion(exchangeID);
    }else{
        combinedAmount = 0;
        setFlag();
        pullAPI(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value);  
    }
    usedCurrencyArray.shift();
    usedCurrencyArray.unshift(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value);
});

setFlag();
pullAPI(getSelectedCurrencyFromDropdown(selectMainCurrencyElement).value);
