//When the window loads, we will set the date on the site
window.onload = function(){
    var day = document.querySelector(".date");
    day.textContent = moment().format("MMMM Do YYYY");
}


var amountToConvert = 0;

//create a few variables that get the Elements we need to collect our values
var amountInput = document.getElementById("amount");
var selectCurrencyElement = document.getElementById('currency-picker');



var selectMainCurrenyElement = document.getElementById("default-currency-picker");
var defaultFlag = document.getElementById("default-flag");


//***********************************************************/
//collect the button element and create an on click event listner
var mainDisplayDiv = document.querySelector(".currency");
var addCurrencyBtn = document.getElementById("add-currency-btn");

var usedCurrencyArray = ["USD"];

addCurrencyBtn.addEventListener('click', function(){
    var selectedCurrency = getSelectedCurrenyFromDropdown(selectCurrencyElement).value
    
    if(usedCurrencyArray.indexOf(selectedCurrency) === -1){
        var newCurrencyContainer = document.createElement("div");
    
        var newFlagImg = document.createElement('img');
        newFlagImg.setAttribute("src", selectedCurrency + ".PNG")
        newFlagImg.setAttribute('class', "flag");

        var newCurrencyInput = document.createElement("input");
        newCurrencyInput.setAttribute('type', "number");
        newCurrencyInput.setAttribute('id', selectedCurrency + "-input");

        var newCurrencyName = document.createElement("p");
        newCurrencyName.setAttribute('id', selectedCurrency + "-p");
        newCurrencyName.textContent = selectedCurrency + ": ";

        newCurrencyContainer.setAttribute("class", "currency-box");
        newCurrencyContainer.appendChild(newFlagImg);
        newCurrencyContainer.appendChild(newCurrencyInput);
        newCurrencyContainer.appendChild(newCurrencyName);
        mainDisplayDiv.appendChild(newCurrencyContainer);

        usedCurrencyArray.push(selectedCurrency);
    }
    
});

function updateExchangePrice(API){

    for (var i = 1; i < usedCurrencyArray.length; i++){
        var inputElement = document.getElementById(usedCurrencyArray[i] + "-input");
        var currencyElement = document.getElementById(usedCurrencyArray[i] + "-p");

        
        var currentExchangeRate = exchangeAPICollector(API, usedCurrencyArray[i]);

        exchangeRate = currentExchangeRate * inputElement.value;
        console.log(currentExchangeRate);
        console.log(exchangeRate);
        currencyElement.textContent = usedCurrencyArray[i] + ": " + exchangeRate;
        
    }

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
    }

}


function getSelectedCurrenyFromDropdown(selectEle) {
    var getEle;
    for ( var i = 0, len = selectEle.options.length; i < len; i++ ) {
        getEle = selectEle.options[i];
        if ( getEle.selected === true ) {
            break;
        }
    }
    return getEle;
}

function setDefaultFlag(){
    var currencyDefault = getSelectedCurrenyFromDropdown(selectMainCurrenyElement).value;
    defaultFlag.setAttribute('src', currencyDefault + ".png");
};

//foreign currency api
function pullAPI(defaultCurrency){
    //api request
    console.log(defaultCurrency);
    var myURL = "https://v6.exchangerate-api.com/v6/0447b7806aa3c6c9ff66b0a6/latest/" + defaultCurrency;
    console.log(myURL);
    $.ajax({
        url: myURL,
        method: "GET"
        }).then(function(response) {
            console.log(response);

            updateExchangePrice(response);

    });
}

//Crypto Currency API

function cryptoAPI(){
    //api request
    var cryptoURL = "https://api.coingecko.com/api/v3/coins/list";
    $.ajax({
        url: cryptoURL,
        method: "GET"
        }).then(function(response) {
            console.log(response);
    
            $("<option>").val("bitcoin")
            $("<option>").val("ethereum")
            $("<option>").val("tether")
            $("<option>").val("ripple")
            $("<option>").val("polkadot")
            $("<option>").val("bitcoin-cash")
            $("<option>").val("binancecoin")
            $("<option>").val("chainlink")
            $("<option>").val("crypto-com-chain")
            $("<option>").val("litecoin")


    });
}
cryptoAPI();

var exchange_id = ""
$("#crypto").change(function() {
    exchange_id = $(this).children(":selected").attr("id");
});

function cryptoConversion(){
    let base = $('#default-crypto-picker').val()
    let exchange = exchange_id
    $.ajax({
        url: `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=${exchange}`,
        method: "GET"
        }).then(function(response) {
            console.log(response);
    })
}

cryptoConversion()


selectMainCurrenyElement.addEventListener("change", function(){
    setDefaultFlag();
    pullAPI(getSelectedCurrenyFromDropdown(selectMainCurrenyElement).value);
    usedCurrencyArray.shift()
    usedCurrencyArray.unshift(getSelectedCurrenyFromDropdown(selectMainCurrenyElement).value)
    console.log(usedCurrencyArray);
});

amountInput.addEventListener("change", function(){
    amountToConvert = amountInput.value;
    console.log(amountToConvert);

    var currencyID = getSelectedCurrenyFromDropdown(selectCurrencyElement)
    console.log(currencyID.value);
});

setDefaultFlag();
pullAPI(getSelectedCurrenyFromDropdown(selectMainCurrenyElement).value);
