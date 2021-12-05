let coinsData;
let filteredCoinsData;
let currentPage = 1
let coinsPerPage = 100
let previousSearch;

$(".fetchBtn").click(() => {
    fetchData()
})

function fetchData() {
    // const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=1&per_page=10"
    const url = "https://api.coingecko.com/api/v3/coins/list"
    $.get(url, (data) => {
        coinsData = data
        filteredCoinsData = coinsData
        console.log(coinsData)
        clearMain()
        createSearchBox()
        renderCards()
        createPagination()
    })
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
    console.log("pageChange: renderCards()")
    renderCards()
    console.log("pageChange: createPagination()")
    createPagination()
    console.log("pageChange: finito")
}

function clearMain() {
    $("main").html("")
}

// #region || search + mic

function createSearchBox() {
    $("main").append(`
    <div class="search-container">
        <input type="text" placeholder="Search by symbol..." class="search-text-input">
        <button class="search-btn">
            <i class="fa fa-search"></i>
        </button>
        <button class="search-mic-btn">
            <i class="fa fa-microphone"></i>
        </button>
    </div>
    `)
    const searchBtn = document.querySelector(".search-btn")
    const searchMicBtn = document.querySelector(".search-mic-btn")
    const searchTextInput = document.querySelector(".search-text-input")
    
    // #region || search filter

    searchBtn.addEventListener("click", searchFilterClick)

    function searchFilterClick() {
        if (previousSearch == searchTextInput.value) {
            return
        }
        previousSearch = searchTextInput.value
        filteredCoinsData = coinsData.filter(each => {
            return each.symbol.toLowerCase().includes(searchTextInput.value.toLowerCase())
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
        
        searchMicBtn.addEventListener("click", e => {
            console.log("listening...")
            recognition.start()
            searchMicBtn.classList.add("listening")
        })
        
        recognition.onresult = function(e) {
            searchTextInput.value = e.results[0][0].transcript // includes its thinking process
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
            searchMicBtn.blur()
            searchMicBtn.classList.remove("listening")
        }
        
        recognition.onerror = function(event) {
            console.log('Stopped listening due to error: ' + event.error)
            recognition.stop()
            searchMicBtn.blur()
            searchMicBtn.classList.remove("listening")
        }
    } catch (error) {
        console.warn("Microphone was removed due to lack of browser support. ERR:", error)
        searchMicBtn.remove()
    }
    


    // #endregion
}

// #endregion

/*

todo;
button sliders
refresh API button
about page
what is 2nd page?

*/