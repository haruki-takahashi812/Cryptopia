const main = document.querySelector("main")
let coinsData;
let currentPage = 1
let coinsPerPage = 100

$(".fetchBtn").click(() => {
    fetchData()
})

function fetchData() {
    // const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&page=1&per_page=10"
    const url = "https://api.coingecko.com/api/v3/coins/list"
    $.get(url, (data) => {
        coinsData = data
        console.log(coinsData)
        clearMain()
        createPagination()
        renderCoins()
    })
}


function createPagination() {
    const totalPages = Math.floor(coinsData.length / coinsPerPage)    
    $("main").append(`<div class="pagination"></div>`)
    for (let i = 1; i < totalPages + 1; i++) {
        if (i == currentPage) {
            $(".pagination").append(`<div class="pageNumber currentPage">${i}</div>`)
            continue
        }
        $(".pagination").append(`<div onclick="pageChange(event)" class="pageNumber">${i}</div>`)
    }
    console.log("finished rendering pagination")
}

function renderCoins() {
    console.log("rendering coins")
    indexStart = coinsPerPage * (currentPage - 1)
    indexEnd = coinsPerPage * currentPage
    $("main").prepend(`<div class="cardsContainer"></div>`)
    for (let i = indexStart; i < indexEnd; i++) {
        // if 100 per page, currentpage 1: index will loop 0-99 , currentpage 2: index will loop 100-199
        console.log(i)
        $(".cardsContainer").append(`
            <div class="card">
                <h2>${i + 1}. ${coinsData[i].symbol}</h2>
                <h3>${coinsData[i].name}</h3>
                <button>More Info</button>
                <input type="checkbox" id="checkbox${i}" />
                <label for="checkbox${i}"></label>
            </div>
        `)

    }
}

function pageChange(e) {
    currentPage = e.target.innerText
    clearMain()
    createPagination()
    renderCoins()
}

function clearMain() {
    $(main).html("");
}

