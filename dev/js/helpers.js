function routHelper(pages) {
    let btn = $(`<button>Меню</button>`)
    let menuContainer = $(`<div class="d-none"><ul></ul></div>`)
    btn.css({'z-index': 999, position: 'fixed', top: 0})
    menuContainer.css({
        'z-index': 999,
        position: 'fixed',
        top: '50px',
        'min-width': '200px',
        'background-color': '#F2F2F2',
        'overflow-y': 'scroll',
        'padding': '20px',
        'font-size': '40px',
        'max-height': '80vh'
    })
    btn.click(function () {
        menuContainer.toggleClass('d-none')
    })
    $.each(pages, function (k, v) {
        menuContainer.find('ul').append(`<li class="mt-4 "><a class="text-uppercase c-link c-link_events" href="http://localhost:3000/${v}">${v}</a></li>`)

    })
    $('body').append(btn).append(menuContainer)
}
$(document).ready(function () {
    routHelper([
        'news-detail',
        'about',
        'news'
    ])
})