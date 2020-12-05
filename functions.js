function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}  

var apikey = {
    cmckey: 'cca25091-2a4a-43f3-855b-e760a8aa859f',
    nomkey: 'e0bdb8da144feffafbc48029d74173ef',

    ethkey: 'MD4QV2Q5U6F7TSKKQQ73INFWXJSFRCJQDK',
    
    btckey: '9f52fe5a-3aa9-437e-ba1f-11f15baf4384',

    xtzkey: 'KT1Ev2jNfMXYvxpMSqdn6dcunb2RqGEm56o9'
}

var totalvalue = 0  
var btcprice,ethprice,xtzprice,ltcprice = 0

var btcval,ethval,xtzval,ltcval = 0

var btcaddr,ethaddr,xtzaddr,ltcaddr = ''

var errflag = 0;

function request(method, url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = resolve;
            xhr.onerror = reject;
            xhr.send();
        });
}
function enterAddr() {
    var dateselector = document.getElementById("datesid")
    var enterCoinButton = document.getElementById("enterCoin")
    enterCoinButton.style.opacity = "0";
    dateselector.style.opacity = "1";
    
    var btcaddrselector = document.getElementById("btcwalletaddr")
    var ethaddrselector = document.getElementById("ethwalletaddr")
    var xtzaddrselector = document.getElementById("xtzwalletaddr")
    btcaddr = btcaddrselector.value
    ethaddr = ethaddrselector.value
    xtzaddr = xtzaddrselector.value
    var btctag = document.getElementById("btctag");
    var ethtag = document.getElementById("ethtag");
    var xtztag = document.getElementById("xtztag");

    

    // coin market cap API for coin prices
    request('GET','https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=' + apikey.cmckey)
    .then((response) => {
        var x = JSON.parse(response.target.responseText)
        for(let i = 0; i < 100; i++) {
            if(x.data[i].name == "Bitcoin") {
                btcprice = x.data[i].quote.USD.price
            }
            if(x.data[i].name == "Ethereum") {
                ethprice = x.data[i].quote.USD.price
            }
            if(x.data[i].name == "Tezos") {
                xtzprice = x.data[i].quote.USD.price
            }
        }
    })
        // eth wallet API
        if(eth.checked) {
            request('GET','https://cors-anywhere.herokuapp.com/https://api.etherscan.io/api?module=account&action=balance&address=' + ethaddr + '&tag=latest&apikey=' + apikey.ethkey)
            .then((response) => {
                var y = JSON.parse(response.target.responseText)
                console.log("eth: y")
                ethval = y.result/1000000000000000000
                var ethval1 = numberWithCommas((y.result/1000000000000000000).toFixed(2))
                document.getElementById("eth").innerHTML = ethval1 + " ETH"
                totalvalue += ethval * ethprice
                var totalvalue1 = numberWithCommas(totalvalue.toFixed(2))
                document.getElementById("totalval").innerHTML = "$" + totalvalue1
                
                if(isNaN(ethval)|| !ethaddr) {
                    error.innerHTML = "Error: invalid address";
                } else {
                    ethtag.style.display="block";
                }
            })
        }
        // btc wallet API
        if(btc.checked) {
        request('GET','https://cors-anywhere.herokuapp.com/https://api.blockcypher.com/v1/btc/main/addrs/' + btcaddr + '/balance')
            .then((response) => {
            console.log(response);
            var z = JSON.parse(response.target.responseText)
            btcval = z.final_balance/100000000
            document.getElementById("btc").innerHTML = btcval + " BTC"
            totalvalue += btcval * btcprice
            var totalvalue1 = numberWithCommas(totalvalue.toFixed(2))
            document.getElementById("totalval").innerHTML = "$" + totalvalue1
            if(isNaN(btcval) || !btcaddr) {
                error.innerHTML = "Error: invalid address";
            } else {
                btctag.style.display="block";
            }
            console.log(errflag)
            }).catch(err => {
            })
        }
        
        if(ltc.checked) {
        request('GET','https://cors-anywhere.herokuapp.com/https://api.blockcypher.com/v1/ltc/main/addrs/' + ltcaddr + '/balance')
            .then((response) => {
            console.log(response);
            var z = JSON.parse(response.target.responseText)
            ltcval = z.final_balance/100000000
            document.getElementById("ltc").innerHTML = ltcval + " LTC"
            totalvalue += ltcval * ltcprice
            var totalvalue1 = numberWithCommas(totalvalue.toFixed(2))
            document.getElementById("totalval").innerHTML = "$" + totalvalue1
            if(isNaN(ltcval) || !ltcaddr) {
                error.innerHTML = "Error: invalid address";
            } else {
                ltctag.style.display="block";
            }
            console.log(errflag)
            }).catch(err => {
            })
        }
        // tezos API
    if(xtz.checked) {
        // fix this: cant get error to show up on empty xtzaddr
        // console.log(xtzaddr)
        // if(xtzaddr==="") {
        //     xtztag.style.display="block";
        // }
        // xtzaddr=base58.encode(xtzaddr)
        request('GET','https://cors-anywhere.herokuapp.com/https://api.tzstats.com/explorer/account/'+xtzaddr)
        .then((response) => {
            var z = JSON.parse(response.target.response)
            console.log(response)
            console.log(z)
            xtzval = z.total_balance
            var xtzval1 = numberWithCommas(z.total_balance.toFixed(2))
            document.getElementById("xtz").innerHTML = xtzval1 + " XTZ"
            totalvalue += xtzval * xtzprice
            var totalvalue1 = numberWithCommas(totalvalue.toFixed(2))
            document.getElementById("totalval").innerHTML = "$" + totalvalue1
            
            console.log("THIS IS IT:" + xtzaddr)
            if(isNaN(xtzval)) {
                error.innerHTML = "Error: invalid address";
                console.log("error!")
            } else {
                xtztag.style.display="block";
            }
            })
    }   

        // error handling
    //     var error = document.getElementById("error");
    //     if(errflag==1){
    //         error.innerHTML = "Error: invalid address";
    //         console.log("error!")
    //     }
    // }
}
    var btc = document.getElementById("addbtc")
    var eth = document.getElementById("addeth")
    var xtz = document.getElementById("addxtz")
    var ltc = document.getElementById("addltc")
function enterCoin() {

    console.log("enterCoin function")
    var btcaddrselector = document.getElementById("btcwalletaddr")
    var ethaddrselector = document.getElementById("ethwalletaddr")
    var xtzaddrselector = document.getElementById("xtzwalletaddr")
    var ltcaddrselector = document.getElementById("ltcwalletaddr")

    var button = document.getElementById("enteraddrbutton")
    var oldbutton = document.getElementById("enterCoin")
    var txt = document.getElementById("selectaddrtxt")

    var cryptoarray = [btc, eth, xtz,ltc]
    var selectorarray = [btcaddrselector, ethaddrselector, xtzaddrselector,ltcaddrselector]
    
    for(var i = 0; i < cryptoarray.length; i++) {
        for(var j = 0; j < selectorarray.length; j++) {
            if(cryptoarray[i].checked && i==j) {
                selectorarray[j].style.display="block";
                button.style.display="block";
                txt.style.display="block";
                oldbutton.style.display="none";
            }
        }
    }

}
function enterDate() {
    var dateselector = document.getElementById("dateselector")
    var date = dateselector.value
    var stepthree = document.getElementById("step3")
    step3.style.opacity = "1";

    request('GET','https://cors-anywhere.herokuapp.com/https://api.nomics.com/v1/exchange-rates/history?key=' + apikey.nomkey + '&currency=BTC&start=' + date + 'T23%3A00%3A00Z&end=' + date + 'T23%3A59%3A00Z')
    .then((response) => {
        var x = JSON.parse(response.target.responseText)
        btcprice = x[0].rate
        totalvalue = 0
        totalvalue += btcval * btcprice
        console.log(1)
        console.log(totalvalue)

    request('GET','https://cors-anywhere.herokuapp.com/https://api.nomics.com/v1/exchange-rates/history?key=' + apikey.nomkey + '&currency=ETH&start=' + date + 'T23%3A00%3A00Z&end=' + date + 'T23%3A59%3A00Z')
    .then((response) => {
        var x1 = JSON.parse(response.target.responseText)
        ethprice = x1[0].rate
        totalvalue += ethval * ethprice
        console.log(2)
        console.log(totalvalue)

    //available for only 90 days as of Aug 6 2020
    request('GET','https://cors-anywhere.herokuapp.com/https://api.tzstats.com/series/binance/XTZ_USDT/ohlcv?start_date=' + date + 'T03:59:00Z&end_date=' + date + 'T03:59:00Z')
    .then((response) => {
        var x = JSON.parse(response.target.responseText)
        xtzprice = x[0][1]
        totalvalue += xtzval * xtzprice
        console.log(3)
        console.log(totalvalue)

        totalvalue = totalvalue.toString()
        totalvalue = numberWithCommas(parseFloat(totalvalue).toFixed(2))
        document.getElementById("totalval").innerHTML = "$" + totalvalue
    }).catch(err => {
        console.log(err)
    })
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
}

function reset() {
    var inputfields = 
    [document.getElementById("addbtc"),
    document.getElementById("addeth"),
    document.getElementById("addxtz"),
    document.getElementById("addltc"),
    document.getElementById("btcwalletaddr"),
    document.getElementById("ethwalletaddr"),
    document.getElementById("xtzwalletaddr"),
    document.getElementById("ltcwalletaddr")]
    inputfields.forEach(x=>x.type="reset");
    window.location.reload();

}