let coinsData;
let filteredCoinsData;
let currentPage = 1
let coinsPerPage = 100
let previousSearch;
let lastRefreshedApiDate;

function fetchData() {
    // const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=1&per_page=10"
    const url = "https://api.coingecko.com/api/v3/coins/list"
    // insert loading screen after search container

    if ($(".search-and-fetchBtn-container").length) { // if element exists:
        $(".cardsContainer").remove()
        $(".pagination").remove()
        $("main").append(`<img class="loading" src="./img/loading.gif" alt="loadingIMG">`)
        console.log("added loading image")
    }

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

function renderCards() {
    indexStart = coinsPerPage * (currentPage - 1)
    indexEnd = coinsPerPage * currentPage
    $(".notFoundH2").remove() // removes h2 which is created when 0 found in search 
    $("main").append(`<div class="cardsContainer"></div>`)
    for (let i = indexStart; i < indexEnd && i < filteredCoinsData.length; i++) {
        // if 100 per page, currentpage 1: index will loop 0-99 , currentpage 2: index will loop 100-199
        $(".cardsContainer").append(`
            <div class="card">
                <h2>${i + 1}. ${filteredCoinsData[i].symbol}</h2>
                <h3>${filteredCoinsData[i].name}</h3>
                <button>More Info</button>
                <input type="checkbox" id="checkbox${i}" />
                <label for="checkbox${i}"></label>
            </div>
        `)

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

// #region || search + mic + api-button

function createSearchBox() {
    $("main").append(`
    <div class="search-and-fetchBtn-container">
        <div class="search-container">
            <input type="text" placeholder="Search by symbol..." class="search-text-input">
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
    
    // #region || search filter

    $(".search-btn").click(searchFilterClick)

    function searchFilterClick() {
        if (previousSearch == $(".search-text-input").val()) {
            return
        }
        previousSearch = $(".search-text-input").val()
        filteredCoinsData = coinsData.filter(each => {
            return each.symbol.toLowerCase().includes($(".search-text-input").val().toLowerCase())
        })
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
            // for final check for .isFinal == true
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
// #region || execution
fetchData()
// #endregion

/*

todo;
about page
what is 2nd page?

*/

