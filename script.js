// #region || web pages navbar

let currentWebPage = "home"

$("#home-btn").click(() => {
    if (currentWebPage == "home" || currentWebPage == "loading") {
        return
    }
    currentWebPage = "loading"
    $(".triangle-page-marker").attr('data-current-page', 'home');
    $("main").css("left", "-110vw") // slide out
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
    $(".triangle-page-marker").attr('data-current-page', 'charts');
    $("main").css("left", `${slidingSide}110vw`)
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
    $(".triangle-page-marker").attr('data-current-page', 'about');
    $("main").css("left", "110vw")
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
    <h1>This is CHARTS page</h1>
    
    `)
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
                <p>
                    South African-born American entrepreneur and businessman who founded PayPal in 1999, 
                    SpaceX in 2002 and Tesla Motors in 2003. Musk became a multimillionaire in his late 20s when he sold his 
                    start-up company, Zip2, to a division of Compaq Computers.
                </p>
            </div>
            <img class="elon-musk-img" src="./img/elonmusk.jpg" alt="Elon Musk IMG">
        </section>
    </div>
    `)
}

// #endregion
// #region || homepage
    // #region || fetching, rendering, pagination 
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
        lastRefreshedApiDate = new Date();

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
                <button onclick="moreInfoBtn(event)">More Info</button>
                <input type="checkbox" id="checkbox${i}" />
                <label for="checkbox${i}"></label>
            </div>
        `)

    }
}

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




/*******************[ TO-DO ]*******************


color currentWebPage diferent

about page

live reports page

************************************************/

