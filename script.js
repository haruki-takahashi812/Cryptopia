// #region || web pages navbar

let currentWebPage = "home"

$("#home-btn").click(() => {
    if (currentWebPage == "home" || currentWebPage == "loading") {
        return
    }
    currentWebPage = "loading"
    $(".triangle-page-marker").attr('data-current-page', 'home')
    $("main").css("left", "-110vw") // slide out
    clearInterval(myInterval) // from graph
    setTimeout(() => {
        if ($("html").scrollTop() == 0) {
            renderHomePage()
            $("main").css("left", "0") // slide in
            currentWebPage = "home"
        } else {
            $("html").animate({ scrollTop: 0 }, 'fast') // scroll to top
            setTimeout(() => {
                renderHomePage()
                $("main").css("left", "0") // slide in
                currentWebPage = "home"
            }, 200)
        }
    }, 250)
})

$("#charts-btn").click(() => {
    if (currentWebPage == "charts" || currentWebPage == "loading") {
        return
    }
    let slidingSide;
    if (currentWebPage == "home") {
        slidingSide = "" // slide to the right (positive number)
    } else {
        slidingSide = "-" // slide to the left (negative number)
    }
    currentWebPage = "loading"
    $(".triangle-page-marker").attr('data-current-page', 'charts')
    $("main").css("left", `${slidingSide}110vw`)
    clearInterval(myInterval) // from graph
    setTimeout(() => {
        if ($("html").scrollTop() == 0) {
            renderChartsPage()
            $("main").css("left", "0")
            currentWebPage = "charts"
        } else {
            $("html").animate({ scrollTop: 0 }, 'fast')
            setTimeout(() => {
                renderChartsPage()
                $("main").css("left", "0")
                currentWebPage = "charts"
            }, 200)
        }
    }, 250)
})

$("#about-btn").click(() => {
    if (currentWebPage == "about" || currentWebPage == "loading") {
        return
    }
    currentWebPage = "loading"
    $(".triangle-page-marker").attr('data-current-page', 'about')
    $("main").css("left", "110vw")
    clearInterval(myInterval) // from graph
    setTimeout(() => {
        if ($("html").scrollTop() == 0) {
            renderAboutPage()
            $("main").css("left", "0")
            currentWebPage = "about"
        } else {
            $("html").animate({ scrollTop: 0 }, 'fast')
            setTimeout(() => {
                renderAboutPage()
                $("main").css("left", "0")
                currentWebPage = "about"
            }, 200)
        }
    }, 250)
})

function renderHomePage() {
    $("main").html("")
    createSearchBox()
    renderCards()
    createPagination()
}

function renderChartsPage() {
    $("main").html(`
    <div class="chart-container">
        <div class="chart">
            <canvas id="myChart"></canvas>
        </div>
        <button id="create-graph-btn">Reload Graph</button>
        <button id="stop-interval-btn">Stop Interval</button>
    </div>
    `)
    $("#create-graph-btn").click(createGraph)
    createGraph()
}

function renderAboutPage() {
    $("main").html(`
    <div class="about-page-container">
        <section class="about-page-section-1">
            <div class="text">
                <h1>Cryptopia lists all the latest crypto coins and lets you compare them.</h1>
                <h2>Select up to 5 coins at the Home page, and see their live comparisons at the Charts page.</h2>
            </div>
            <img class="crypto-coins-img" src="./img/coins.png" alt="crypto coins IMG">
        </section>
        <section class="about-page-section-2">
            <h1 class="section-2-title">About the author:</h1>
            <div class="section-2-info">
                <h2>Elon musk</h2>
                <div class="p">
                    South African-born American entrepreneur and businessman who founded PayPal in 1999, 
                    SpaceX in 2002 and Tesla Motors in 2003. Musk became a multimillionaire in his late 20s when he sold his 
                    start-up company, Zip2, to a division of Compaq Computers.
                    <div class="icons">
                        <a target="_blank" href="https://www.facebook.com/groups/ElonMusk/"><i class="fa fa-facebook"></i></a>
                        <a target="_blank" href="https://twitter.com/elonmusk"><i class="fa fa-twitter"></i></a>
                        <a target="_blank" href="https://www.instagram.com/elonmusk/"><i class="fa fa-instagram"></i></a>    
                    </div>
                </div>
            </div>
            <img class="elon-musk-img" src="./img/elonmusk.jpg" alt="Elon Musk IMG">
        </section>
    </div>
    `)
}

// #endregion
// #region || charts page

let chart = undefined;
let myInterval;

function createGraph() {
    clearInterval(myInterval)

    let timeNow = new Date().toISOString().slice(14,19) // mm:ss

    // x-axis
    let labels = [
        timeNow,
    ];
    
    let data = {
        labels,
        // y-axis
        datasets: [
            {
            label: "something1",
            backgroundColor: 'white', // points color
            borderColor: 'blue', // line color
            data: [123, 432, 120, 14, 1023, 500, 344],
            },
            {
            label: "something2",
            backgroundColor: 'white',
            borderColor: 'limegreen',
            data: [323, 132, 220, 124, 23, 400, 144],
            },
            {
            label: "something3",
            backgroundColor: 'white',
            borderColor: 'red',
            data: [400, 300, 200, 400, 800, 1000, 354],
            },
        ]
    }

    const config = {
        type: "line",
        data: data,
        options: {
            animation: false,
            elements: {
                point: {
                    radius: 2,
                },
                line: {
                    borderWidth: 1,
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value){
                            return "$" + value + "m";
                        }
                    },
                    title: {
                        display: true,
                        text: "Coin Value",
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "Time (mm:ss)",
                    },
                },
            },
            plugins: {
                legend: {
                    position:"right",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "rectRounded",
                    }
                },
                title: {
                    display: true,
                    text: 'Live Chart'
                }
            }
        }
    }
    
    // if chart exists, delete it
    if (typeof chart == "object") {
        chart.destroy()
    }
    chart = new Chart($("#myChart"), config);

    myInterval = setInterval(() => {
        let timeNow = new Date().toISOString().slice(14,19) // mm:ss
        labels.push(`${timeNow}`)
        console.log(labels)
        chart.update()
    }, 2000);
    
    $("#stop-interval-btn").click(()=>{clearInterval(myInterval)})
}

// #endregion
// #region || homepage
    // #region || fetching + rendering cards
let coinsData;
let filteredCoinsData;
let currentCoinsPage = 1
let coinsPerPage = 100
let previousSearch;
let lastRefreshedApiDate;

function fetchData() {
    
    // insert loading screen after search container
    if ($(".search-and-fetchBtn-container").length) { // if element exists:
        $(".cardsContainer").remove()
        $(".pagination").remove()
        $("main").append(`<img class="loading" src="./img/loading.gif" alt="loadingIMG">`)
    }
    
    // const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=1&per_page=10"
    const url = "https://api.coingecko.com/api/v3/coins/list"

    $.get(url, (data) => {
        coinsData = data
        console.log(coinsData)
        filteredCoinsData = coinsData
        lastRefreshedApiDate = new Date()

        if (currentWebPage == "home") {
            if ($(".search-and-fetchBtn-container").length) { // if element exists:
                $(".loading").remove()
                // renderCards()
                // createPagination()
                previousSearch = ""
                $(".search-btn").trigger("click") // keeping search filter on refresh
            } else {
                renderHomePage()
            }
        }
    })
}

function timePassedSinceFetch(miliseconds) {
    let tooltip = $("#refreshApiBtn .tooltip")
    msPassed = new Date(miliseconds)
    if (msPassed < 1000) {
        tooltip.text("Last refreshed: now.")
        return
    }
    // 24 hours = 86400000 miliseconds
    if (msPassed < 86400000) {
        if (msPassed.getUTCHours() == 0) {
            if (msPassed.getMinutes() == 0) {
                tooltip.text(`Last refreshed: ${msPassed.getUTCSeconds()} sec ago.`)
            } else {
                tooltip.text(`Last refreshed: ${msPassed.getUTCMinutes()} min ago.`)
            }
        } else {
            tooltip.text(`Last refreshed: ${msPassed.getUTCHours()} hours ago.`)
        }
    } else {
        tooltip.text("Last refreshed: over 24 hours ago.")
    }
}

function renderCards() {
    $("main").append(`<div class="cardsContainer"></div>`)
    if (!filteredCoinsData.length) { // if array is empty:
        $(".cardsContainer").append(`<h2 class="notFoundH2">No results found. 🙁</h2>`)
    }
    indexStart = coinsPerPage * (currentCoinsPage - 1)
    indexEnd = coinsPerPage * currentCoinsPage
    for (let i = indexStart; i < indexEnd && i < filteredCoinsData.length; i++) {
        // if 100 per page, currentpage 1: index will loop 0-99 , currentpage 2: index will loop 100-199
        $(".cardsContainer").append(`
            <div class="card">
                <h2>${i + 1}. <span class="symbol">${filteredCoinsData[i].symbol}</span></h2>
                <h3>${filteredCoinsData[i].name}</h3>
                <input type="checkbox" id="checkbox${i}" />
                <label for="checkbox${i}"></label>
                <button id="button${i}" onclick="moreInfoBtn(${i})">More Info</button>
                <div class="more-info-container">

                </div>
            </div>
        `)

    }
}

// #endregion
    // #region || pagination

function createPagination() {
    if (!filteredCoinsData.length) { // if array is empty:
        return
    }
    let totalPages = Math.ceil(filteredCoinsData.length / coinsPerPage)
    $("main").append(`<div class="pagination"></div>`)
    
    let displayAllPages = false;

    if (displayAllPages) {
        for (let i = 1; i <= totalPages; i++) {
            if (i == currentCoinsPage) {
                $(".pagination").append(`<div class="page-number current-coins-page">${i}</div>`)
                continue
            }
            $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">${i}</div>`)
        }
    } else {
        // my pagination algorithm https://docs.google.com/document/d/199mvUjZvVXJDHeATYpeLyElzaZAjcUAklDHYUVUgKxY/edit?usp=sharing
        let step = 3

        let mid = step + 3
        let maximal = step * 2 + 5
        let f = totalPages
        let c = currentCoinsPage

        if (c == 1) {
            $(".pagination").append(`<div class="page-number previous-page disabled"><i class="fa fa-chevron-left"></i></div>`)
        } else {
            $(".pagination").append(`<div class="page-number previous-page" onclick="previousPageArrow()"><i class="fa fa-chevron-left"></div>`)
        }
        if (f <= maximal) {
            for (let i = 1; i <= f; i++) {
                if (i == c) {
                    $(".pagination").append(`<div class="page-number current-coins-page">${i}</div>`)
                    continue
                }
                $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">${i}</div>`)
            }
        } else if (c <= mid) {
            for (let i = 1; i <= mid + step; i++) {
                if (i == c) {
                    $(".pagination").append(`<div class="page-number current-coins-page">${i}</div>`)
                    continue
                }
                $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">${i}</div>`)
            }
            $(".pagination").append(`<div class="page-number dots">...</div>`)
            $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">${f}</div>`)
        } else if (c > (f - mid)) {
            $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">1</div>`)
            $(".pagination").append(`<div class="page-number dots">...</div>`)
            for (let i = mid + step - 1; i >= 0; i--) {
                if (f - i == c) {
                    $(".pagination").append(`<div class="page-number current-coins-page">${f - i}</div>`)
                    continue
                }
                $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">${f - i}</div>`)
            }
        } else {
            $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">1</div>`)
            $(".pagination").append(`<div class="page-number dots">...</div>`)
            for (let i = -(step); i <= step; i++) {
                if (c + i == c) {
                    $(".pagination").append(`<div class="page-number current-coins-page">${c + i}</div>`)
                    continue
                }
                $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">${c + i}</div>`)
            }
            $(".pagination").append(`<div class="page-number dots">...</div>`)
            $(".pagination").append(`<div onclick="pageChange(event)" class="page-number">${f}</div>`)
        }
        if (c == f) {
            $(".pagination").append(`<div class="page-number next-page disabled"><i class="fa fa-chevron-right"></div>`)
        } else {
            $(".pagination").append(`<div class="page-number next-page" onclick="nextPageArrow()"><i class="fa fa-chevron-right"></div>`)
        }
    }
    
}

function pageChange(e) {
    currentCoinsPage = parseInt(e.target.innerText)
    $(".cardsContainer").remove()
    $(".pagination").remove()
    renderCards()
    createPagination()
}

function nextPageArrow() {    
    currentCoinsPage++ 
    $(".cardsContainer").remove()
    $(".pagination").remove()
    renderCards()
    createPagination()
}

function previousPageArrow() { 
    currentCoinsPage--
    $(".cardsContainer").remove()
    $(".pagination").remove()
    renderCards()
    createPagination()
}

// #endregion
    // #region || moreinfo slider

let previousMICurrency = "usd"; // previous more-info selected currency

function moreInfoBtn(btnId) {
    let btn = $(`#button${btnId}`)

    // check if slider already open
    if (btn.next().css("display") != "none") {
        btn.next().slideToggle(300)
        return
    }
    
    // open slider menu with loading gif
    btn.next().html(`<img class="loading" src="./img/loading.gif" alt="loadingIMG">`);
    btn.next().slideToggle(300)
    
    // coin name corresponding to the button clicked (<h3>)
    let name = btn.parent().children().first().next().text()
    console.log(`name: ${name}`)
    let index = coinsData.findIndex(each => each.name === name)
    // https://api.coingecko.com/api/v3/coins/aag-ventures  aag
    const url = `https://api.coingecko.com/api/v3/coins/${coinsData[index].id}`
    console.log(`fetching from url: ${url}`)
    
    $.get(url, (data) => {
        editSliderContent(btn, data, true)
    }).fail(() => {
        editSliderContent(btn, 0, false)
    })
}

// btnElement must be jquery element
// success = true if fetching worked
function editSliderContent(btnElement, coinObject, success) {
    let sliderElement = btnElement.next()
    if (success === false) {
        sliderElement.html(`
            <br>
            <h4>Failed to fetch data. Try again.</h4>
        `)
        return
    }

    const currenciesArr = Object.keys(coinObject.market_data.current_price) // returns array with USD, ILS, EUR, etc.
    if (!currenciesArr.length) {
            sliderElement.html(`
            <img class="coin-image" src=${coinObject.image.large} alt="coin logo">
            <h4>(unknown coin value)</h4>
        `)
    } else {
        sliderElement.html(`
            <img class="coin-image" src=${coinObject.image.large} alt="coin logo">
            <h4>Value: <span class="coin-current-price"></span></h4>
            <select class="select-currencies">
            </select>
        `)

        let selectElement = sliderElement.children(".select-currencies")
        
        selectElement.on("change", updateCoinValue)

        for(let each of currenciesArr) {
            if (each == previousMICurrency) {
                selectElement.append(`<option value="${each}" selected>${each.toUpperCase()}</option>`)
                continue
            }
            selectElement.append(`<option value="${each}">${each.toUpperCase()}</option>`)
        }

        updateCoinValue()

        function updateCoinValue() {
            let inputValue = selectElement.val()
            previousMICurrency = inputValue
            selectElement.prev().children("span").text(coinObject.market_data.current_price[inputValue].toLocaleString('en-US'))
        }
    }
}

// #endregion
    // #region || popup modal + toggle checkboxes

let toggledList = [];

//$("#name-checkbox").is(':checked')
function checkboxClick() {

}



// #endregion
    // #region || search + mic + api-button

/* default checked search values */
let searchExactMatch = true
let searchSymbols = true
let searchNames = false

function createSearchBox() {
    $("main").append(`
    <div class="search-and-fetchBtn-container">
        <div class="search-container">

            <input type="checkbox" id="search-checkbox">
            <label for="search-checkbox" class="search-label">
                <i class="fa fa-chevron-down"></i>
                <div class="search-dropdown-menu" onclick="if (event.target === event.currentTarget){event.preventDefault()}">
                    <div class="flex-row">
                        <input type="checkbox" id="exactmatch-checkbox">
                        <label for="exactmatch-checkbox" class="exactmatch-label">Exact Match</label>
                    </div>
                    <div class="flex-row">
                        <input type="checkbox" id="symbol-checkbox">
                        <label for="symbol-checkbox" class="symbol-label">Search Symbols</label>
                    </div>
                    <div class="flex-row">
                        <input type="checkbox" id="name-checkbox">
                        <label for="name-checkbox" class="name-label">Search Names</label>
                    </div>
                </div>
            </label>

            <input type="text" placeholder="Search..." class="search-text-input">
            <button class="search-btn">
                <i class="fa fa-search"></i>
            </button>
            <button class="search-mic-btn">
                <i class="fa fa-microphone"></i>
            </button>
        </div>
        <button id="refreshApiBtn" onclick="fetchData()" onmouseover="timePassedSinceFetch(Math.abs((new Date()) - lastRefreshedApiDate))">
            <i class="fa fa-refresh"></i>
            <span class="tooltip">Last refreshed: </span>
        </button>
    </div>
    `)
    
    $(".search-text-input").val(previousSearch)

    if (searchExactMatch) {
        $("#exactmatch-checkbox").prop("checked", true)
    } else {
        $("#exactmatch-checkbox").prop("checked", false)
    }
    if (searchSymbols) {
        $("#symbol-checkbox").prop("checked", true)
    } else {
        $("#symbol-checkbox").prop("checked", false)
    }
    if (searchNames) {
        $("#name-checkbox").prop("checked", true)
    } else {
        $("#name-checkbox").prop("checked", false)
    }
        
    $("#exactmatch-checkbox").on("change", () => {
        searchExactMatch = !searchExactMatch
        previousSearch = ""
        $(".search-btn").trigger("click")
    })

    // radio checkboxes
    $("#symbol-checkbox").on("change", () => {
        if ($("#name-checkbox").is(':checked')) {
            searchSymbols = !searchSymbols
        } else {
            $("#name-checkbox").prop("checked", true)
            searchSymbols = !searchSymbols
            searchNames = !searchNames
        }
        previousSearch = ""
        $(".search-btn").trigger("click")
    })

    $("#name-checkbox").on("change", () => {
        if ($("#symbol-checkbox").is(':checked')) {
            searchNames = !searchNames
        } else {
            $("#symbol-checkbox").prop("checked", true)
            searchNames = !searchNames
            searchSymbols = !searchSymbols
        }
        previousSearch = ""
        $(".search-btn").trigger("click")
    })
    
    // #region || search filter

    $(".search-btn").click(searchFilterClick)

    function searchFilterClick() {
        if ($(".search-text-input").val() == "") {
            // show all coins if search is empty
            filteredCoinsData = coinsData
            // render
            currentCoinsPage = 1
            $(".cardsContainer").remove()
            $(".pagination").remove()
            renderCards()
            createPagination()
            return
        }
        if (previousSearch == $(".search-text-input").val()) {
            return
        }
        previousSearch = $(".search-text-input").val()
        
        // checkbox search filters
        let exact = $("#exactmatch-checkbox").is(':checked')
        let symbol = $("#symbol-checkbox").is(':checked')
        let name = $("#name-checkbox").is(':checked')

        let searchInputValue = $(".search-text-input").val().toLowerCase()

        if (exact) {
            if (symbol && name ) {
                filteredCoinsData = coinsData.filter(each => {
                    return (each.symbol.toLowerCase() == searchInputValue || each.name.toLowerCase() == searchInputValue)
                })
            } else if (symbol) {
                filteredCoinsData = coinsData.filter(each => {
                    return (each.symbol.toLowerCase() == searchInputValue)
                })
            } else {
                filteredCoinsData = coinsData.filter(each => {
                    return (each.name.toLowerCase() == searchInputValue)
                })
            }
        } else {
            if (symbol && name) {
                filteredCoinsData = coinsData.filter(each => {
                    return (each.symbol.toLowerCase().includes(searchInputValue) || each.name.toLowerCase().includes(searchInputValue))
                })
            } else if (symbol) {
                filteredCoinsData = coinsData.filter(each => {
                    return (each.symbol.toLowerCase().includes(searchInputValue))
                })
            } else {
                filteredCoinsData = coinsData.filter(each => {
                    return (each.name.toLowerCase().includes(searchInputValue))
                })
            }
        }

        // render
        currentCoinsPage = 1
        $(".cardsContainer").remove()
        $(".pagination").remove()
        renderCards()
        createPagination()
    }
    // #endregion
    // #region || speech recognition

    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.interimResults = true
        recognition.lang = "en-US"
        
        $(".search-mic-btn").click(e => {
            console.log("listening...")
            recognition.start()
            $(".search-mic-btn").addClass("listening")
        })
        
        recognition.onresult = function(e) {
            $(".search-text-input").val(e.results[0][0].transcript) // includes its thinking process
            console.log("finished interim")
            if (e.results[0].isFinal == true) {
                console.log("completed listening process")
                searchFilterClick()
            }
        }
        
        recognition.onspeechend = function() {
            recognition.stop()
            console.log("stopped listening: speech ended.")
            $(".search-mic-btn").blur()
            $(".search-mic-btn").removeClass("listening")
        }
        
        recognition.onerror = function(event) {
            console.log('Stopped listening due to error: ' + event.error)
            recognition.stop()
            $(".search-mic-btn").blur()
            $(".search-mic-btn").removeClass("listening")
        }
    } catch (error) {
        console.warn("Microphone was removed due to lack of browser support. ERR:", error)
        $(".search-mic-btn").remove()
    }
    
    // #endregion
}

// #endregion
    // #region || keyboard presses

$(document).on("keydown", function(e) {
    if (e.keyCode == 13) { // if enter is pressed:
        if ($(".search-btn").length) { // if element exists:
            if ($(".search-text-input").is(":focus")) {
                $(".search-btn").trigger("click")
            }
        }
    }
    if (e.keyCode == 27) { // if esc is pressed:
        if ($(".search-btn").length) { // if element exists:
            if ($(".search-text-input").is(":focus")) {
                $(".search-text-input").blur()
            }
        }
        if ($(".popup-dark-overlay").css('display') != 'none') {
            closePopupMenu()
        }
    }
})

// #endregion
// #endregion
// #region || execution

fetchData()

// #endregion

