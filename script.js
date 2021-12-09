// #region || homepage
    // #region || fetching, rendering, pagination 
let coinsData;
let filteredCoinsData;
let currentPage = 1
let coinsPerPage = 100
let previousSearch;
let lastRefreshedApiDate;

function fetchData() {
    
    // insert loading screen after search container
    if ($(".search-and-fetchBtn-container").length) { // if element exists:
        $(".cardsContainer").remove()
        $(".pagination").remove()
        $("main").append(`<img class="loading" src="./img/loading.gif" alt="loadingIMG">`)
        console.log("added loading image")
    }
    
    // const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=1&per_page=10"
    const url = "https://api.coingecko.com/api/v3/coins/list"

    $.get(url, (data) => {
        coinsData = data
        console.log(coinsData)
        filteredCoinsData = coinsData
        lastRefreshedApiDate = new Date();
        if ($(".search-and-fetchBtn-container").length) { // if element exists:
            $(".loading").remove()
            renderCards()
            createPagination()
            previousSearch = ""
            $(".search-btn").trigger("click") // keep filter on refresh
        } else {
            clearMain()
            createSearchBox()
            renderCards()
            createPagination()
        }
    })
}

function timePassedSinceFetch(miliseconds) {
    let tooltip = $("#refreshApiBtn .tooltip")
    msPassed = new Date(miliseconds)
    if (msPassed < 1000) {
        tooltip.text("Last refreshed: now.")
        return;
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
    indexStart = coinsPerPage * (currentPage - 1)
    indexEnd = coinsPerPage * currentPage
    $(".notFoundH2").remove() // removes h2 which is created when 0 found in search 
    $("main").append(`<div class="cardsContainer"></div>`)
    for (let i = indexStart; i < indexEnd && i < filteredCoinsData.length; i++) {
        // if 100 per page, currentpage 1: index will loop 0-99 , currentpage 2: index will loop 100-199
        $(".cardsContainer").append(`
            <div class="card">
                <h2>${i + 1}. <span class="symbol">${filteredCoinsData[i].symbol}</span></h2>
                <h3>${filteredCoinsData[i].name}</h3>
                <button onclick="moreInfoBtn(event)">More Info</button>
                <input type="checkbox" id="checkbox${i}" />
                <label for="checkbox${i}"></label>
            </div>
        `)

    }
}

function createPagination() {
    const totalPages = Math.ceil(filteredCoinsData.length / coinsPerPage)    
    $("main").append(`<div class="pagination"></div>`)
    for (let i = 1; i < totalPages + 1; i++) {
        if (i == currentPage) {
            $(".pagination").append(`<div class="pageNumber currentPage">${i}</div>`)
            continue
        }
        $(".pagination").append(`<div onclick="pageChange(event)" class="pageNumber">${i}</div>`)
    }
}

function pageChange(e) {
    currentPage = e.target.innerText
    $(".cardsContainer").remove()
    $(".pagination").remove()
    renderCards()
    createPagination()
}

function clearMain() {
    $("main").html("")
}

// #endregion
    // #region || moreinfo button + popup

function moreInfoBtn(e) {
    
    // coin symbol corresponding to the button clicked
    let symbol = e.target.parentElement.firstElementChild.firstElementChild.innerText
    
    showPopupMenu(symbol)

    let index = coinsData.findIndex(each => each.symbol === symbol); 
    
    const url = `https://api.coingecko.com/api/v3/coins/${coinsData[index].id}`
    
    $.get(url, (data) => {
        console.log(data)
        editPopupMenuContents(data)
    })
}

function showPopupMenu(symbol) {
    $(".popup-body").html(`<img class="loading" src="./img/loading.gif" alt="loadingIMG">`)
    $(".popup-menu-title").text(symbol)
    $(".popup-dark-overlay").css("display", "flex")
}

function editPopupMenuContents(coinObject) {

    $(".popup-body").html(`
        <img class="coin-image" src=${coinObject.image.large} alt="coin logo">
        <h4>Current Price: <span class="coin-current-price"></span></h4>
        <select class="select-currencies">
        </select>
    `)
    $(".select-currencies").on("change", updateCoinValue)
    let currenciesArr = Object.keys(coinObject.market_data.current_price) // returns array with USD, ILS, EUR, etc.
    for(let each of currenciesArr) {
        if (each == "usd") {
            $(".select-currencies").append(`<option value="${each}" selected>${each.toUpperCase()}</option>`)
            continue
        }
        $(".select-currencies").append(`<option value="${each}">${each.toUpperCase()}</option>`)
    }
    updateCoinValue()

    function updateCoinValue() {
        let inputValue = $(".select-currencies").val()
        $(".coin-current-price").text(coinObject.market_data.current_price[inputValue].toLocaleString('en-US'))
    }
}

$(".popup-exit-button").click(closePopupMenu)

function closePopupMenu() {
    $(".popup-dark-overlay").css("display", "none")
    $(".popup-menu-title").text("")
}

$(".popup-dark-overlay").click(e => {
    if (e.target === e.currentTarget) {
        closePopupMenu();
    }
})

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
        currentPage = 1
        if (!filteredCoinsData.length) {
            $(".cardsContainer").remove()
            $(".pagination").remove()
            $(".notFoundH2").remove()
            $("main").append(`<h2 class="notFoundH2">No results found. 🙁</h2>`)
        } else {
            $(".cardsContainer").remove()
            $(".pagination").remove()
            renderCards()
            createPagination()

        }
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
        console.log("made it 1")
        if ($(".popup-dark-overlay").css('display') != 'none') {
            console.log("made it 2")
            closePopupMenu()
        }
    }
})

// #endregion
// #endregion
// #region || execution

fetchData()

// #endregion








/*******************[ TO-DO ]*******************

refreshApiBtn hold click mobile

about page

live reports page

************************************************/

