var nArticles = 0;
var nAuthors = 0;
var count1 = 0;
var count2 = 0;

var nAccordionAut = 0;
var nAccordionArt = 0;
var articlePageNumber = 1;
var authorPageNumber = 1;

var articleCounter;
var authorCounter;


function setAccordionNumber() {
    let artHeight = $("#accordionFlushExample .accordion-header").height();
    let autHeight = $("#accordionFlushAutExample .accordion-header").height();
    let accordionHeight = artHeight > autHeight ? artHeight : autHeight;
    let height = $('#results').height() - accordionHeight * 3;
    nAccordionAut = nAccordionArt = Math.floor(height / accordionHeight);
    if(isNaN(nAccordionArt)) nAccordionAut = nAccordionArt = 10;

}


$(document).ready(function () {
    $("#btnFilter").click(function () {

        let myDiv = document.getElementById('filter-panel');

        if (myDiv.style.display == 'block') {
            myDiv.style.display = 'none';
        } else {
            myDiv.style.display = 'block';
        }
    });
});

$(window).resize(function () {
    let myDiv;
    if ($(window).width() > 576) {
        let myDiv4 = document.getElementById('results');
        myDiv = document.getElementById('filter-panel');
        myDiv.style.display = 'block';
        if (myDiv4.classList.contains('col-md-12')) {
            myDiv.style.display = 'none';
        }
    }
    if ($(window).width() <= 576) {
        myDiv = document.getElementById('filter-panel');
        myDiv.style.display = 'none';
    }
});

$(document).ready(function () {
    let checkList = document.getElementById('languages-filter');
    checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
        if (checkList.classList.contains('visible'))
            checkList.classList.remove('visible');
        else
            checkList.classList.add('visible');
    }
});

function openArticles() {

    let myDiv = document.getElementById('home');
    let myDiv2 = document.getElementById('users');
    let myDiv3 = document.getElementById('filter-panel');
    let myDiv4 = document.getElementById('results');
    if (myDiv.style.display != 'block') {
        myDiv.style.display = 'block';
        myDiv2.style.display = 'none';
        myDiv3.style.display = 'block';
        myDiv4.classList.remove('col-md-12');
        myDiv4.classList.add('col-md-7');
        document.getElementById('btnHome').classList.add("active");
        document.getElementById("btnAut").classList.remove("active");
    }
}

$(document).ready(function () {
    $("#btnHome").click(openArticles);

});

$(document).ready(function () {
    $("#btnAut").click(function () {
        let myDiv = document.getElementById('users');
        let myDiv2 = document.getElementById('home');
        let myDiv3 = document.getElementById('filter-panel');
        let myDiv4 = document.getElementById('results');

        if (myDiv.style.display != 'block') {
            myDiv.style.display = 'block';
            myDiv2.style.display = 'none';
            myDiv3.style.display = 'none';
            myDiv4.classList.remove('col-md-7');
            myDiv4.classList.add('col-md-12');
            this.classList.add("active");
            document.getElementById("btnHome").classList.remove("active");
            renderAuthorsAccordions();
        }
    });
});

$(document).ready(function () {
    count1 = $("#accordionFlushExample .accordion-item").length;
    document.getElementById("counter").textContent = count1;
    count2 = $("#accordionFlushAutExample .accordion-item").length;
    document.getElementById("counter2").textContent = count2;
});


function renderAuthorsAccordions() {
    let accordions = $("#accordionFlushAutExample .accordion-item");
    let offset = nAccordionAut * (authorPageNumber - 1);
    accordions.hide();
    console.log("Numero di pagina: " + authorPageNumber);
    console.log("#accordion: " + nAccordionAut);
    console.log("Offset: " + offset);
    console.log("Elementi attivi: ");
    for (let i = offset; i <= offset + nAccordionAut; i++) {
        accordions.eq(i).show();
        console.log(i);

    }
    document.getElementById("author-page").innerText = authorPageNumber;
    if(authorCounter > 0) document.getElementsByClassName("page-navigator")[1].style.display = 'flex';
    else document.getElementsByClassName("page-navigator")[1].style.display = 'none'


}

function renderArticleAccordions() {
    console.log("Numero di pagina: " + articlePageNumber);
    let accordions = $("#accordionFlushExample .accordion-item");
    let offset = nAccordionArt * (articlePageNumber - 1);
    console.log("#accordion: " + nAccordionArt);
    console.log("Offset: " + offset);
    console.log("Elementi attivi: ");
    accordions.hide();
    for (let i = offset; i <= offset + nAccordionArt; i++) {
        console.log(i);
        accordions.eq(i).show();
    }
    document.getElementById("article-page").innerText = articlePageNumber
    if(articleCounter > 0) document.getElementsByClassName("page-navigator")[0].style.display = 'flex';
    else document.getElementsByClassName("page-navigator")[0].style.display = 'none'
}

$(document).ready(function () {
    $("#btnPrevResArt").click(function () {
        articlePageNumber -= 1;
        if (articlePageNumber < 1)
            articlePageNumber = 1;
        renderArticleAccordions();
    });
    $("#btnNextResArt").click(function () {
        if (articlePageNumber * nAccordionArt < articleCounter)
            articlePageNumber += 1;
        renderArticleAccordions();
    });
    $("#btnPrevResAut").click(function () {
        authorPageNumber -= 1;
        if (authorPageNumber < 1)
            authorPageNumber = 1;
        renderAuthorsAccordions();
    });
    $("#btnNextResAut").click(function () {
        if (authorPageNumber * nAccordionAut < authorCounter) {
            authorPageNumber += 1;
        }
        renderAuthorsAccordions();
    });
});

function search() {
    let myDiv = document.getElementById('welcome_info');


    if (myDiv.style.display !== 'none') {
        myDiv.style.display = 'none';
    }
    let searched = "?input=" + document.getElementById('search-input').value;
    if (searched.length > 7) {
        let min_date = "&min_date=" + document.getElementById('min_date').value;
        if (min_date.length <= 10) min_date = "";
        let max_date = "&max_date=" + document.getElementById('max_date').value;
        if (max_date.length <= 10) max_date = "";
        let author = "&author" + document.getElementById('author').value;
        if (author.length <= 7) author = "";
        let publisher = "&publisher" + document.getElementById('publisher').value;
        if (publisher.length <= 10) publisher = "";

        let languages = "&languages="
        $('input[type=checkbox]').each(function () {
            languages += (this.checked ? $(this).val() + "%20" : "");
        });
        languages = languages.slice(0, languages.length - 3)
        if (languages.length <= 9) languages = ""

        const xhttpResources = new XMLHttpRequest();
        xhttpResources.onreadystatechange = function () {
            /*if (this.readyState === 4 && this.status === 200) {
                document.getElementById("accordionFlushExample").innerHTML =
                    this.responseText;
                articleCounter = $("#accordionFlushExample").children().length;
                document.getElementById("counter").innerHTML = articleCounter;
                articlePageNumber = 1;
                setAccordionNumber();
                renderArticleAccordions()
            }*/
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("accordionFlushExample").innerHTML =
                    this.responseText;
                articleCounter = $("#accordionFlushExample").children().length;
                document.getElementById("counter").innerHTML = articleCounter;
                if (articleCounter > 0) {
                    $('#btnPrevResArt').css('display', 'block');
                    $('#btnNextResArt').css('display', 'block');
                } else {
                    $('#btnPrevResArt').css('display', 'none');
                    $('#btnNextResArt').css('display', 'none');
                }
                articlePageNumber = 1;
                setAccordionNumber();
                renderArticleAccordions()
            }
        };
        const xhttpAuthors = new XMLHttpRequest();
        xhttpAuthors.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("accordionFlushAutExample").innerHTML =
                    this.responseText;
                authorCounter = $("#accordionFlushAutExample").children().length;
                document.getElementById("counter2").innerHTML = authorCounter;
                if (authorCounter > 0) {
                    $('#btnPrevResAut').css('display', 'block');
                    $('#btnNextResArt').css('display', 'block');
                } else {
                    $('#btnPrevResAut').css('display', 'none');
                    $('#btnNextResArt').css('display', 'none');
                }
                authorPageNumber = 1;
                setAccordionNumber();
                renderAuthorsAccordions();
            }
        };
        xhttpResources.open("GET", "resources" + searched + min_date + max_date + author + publisher + languages, true);
        xhttpAuthors.open("GET", "authors" + searched, true);
        document.getElementById("counter").innerText = "Loading";
        document.getElementById("counter2").innerHTML = "Loading";

        document.getElementsByClassName("page-navigator")[0].style.display = 'none';
        document.getElementsByClassName("page-navigator")[1].style.display = 'none';

        xhttpResources.send();
        document.getElementById("accordionFlushExample").innerHTML =
            "<div class='lds-dual-ring'></div>";
        xhttpAuthors.send();
        document.getElementById("accordionFlushAutExample").innerHTML =
            "<div class='lds-dual-ring'></div>";
    }
}

$(document).keyup(function (event) {
    if (event.which === 13) {
        search();
    }
});

function help() {
    let myDiv = document.getElementById('welcome_info');
    if (myDiv.style.display != 'none') {
        myDiv.style.display = 'none';
    } else if (myDiv.style.display != 'block') {
        myDiv.style.display = 'block';
    }
}

function newSearch(id) {
    console.log(id);
    const xhttpResources = new XMLHttpRequest();
    xhttpResources.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("accordionFlushExample").innerHTML =
                this.responseText;
            articleCounter = $("#accordionFlushExample").children().length;
            document.getElementById("counter").innerHTML = articleCounter;
            articlePageNumber = 1;
            setAccordionNumber();
            openArticles();
            renderArticleAccordions();

            // let myDiv = document.getElementById('home');
            // let myDiv2 = document.getElementById('users');
            // let myDiv3 = document.getElementById('filter-panel');
            // let myDiv4 = document.getElementById('results');
            // if (myDiv.style.display != 'block') {
            //     myDiv.style.display = 'block';
            //     myDiv2.style.display = 'none';
            //     myDiv3.style.display = 'block';
            //     myDiv4.classList.remove('col-md-12');
            //     myDiv4.classList.add('col-md-7');
            //     myDiv.classList.add("active");
            //     document.getElementById("btnAut").classList.remove("active");
            // }
        }
    }
    xhttpResources.open("GET", "resource_link?code=" + id, true);
    document.getElementById("counter").innerText = "Loading";
    xhttpResources.send();
    document.getElementById("accordionFlushArtExample").innerHTML =
        "<div class='lds-dual-ring'></div>"
}

function bootstrap(activePage) {
    if (activePage === "author") {
        $('#btnAut').addClass('active');
        $('#users').addClass('active');
        let myDiv = document.getElementById('users');
        let myDiv2 = document.getElementById('home');
        let myDiv3 = document.getElementById('filter-panel');
        let myDiv4 = document.getElementById('results');
        if (myDiv.style.display != 'block') {
            myDiv.style.display = 'block';
            myDiv2.style.display = 'none';
            myDiv2.style.display = 'none';
            myDiv3.style.display = 'none';
            myDiv4.classList.remove('col-md-7');
            myDiv4.classList.add('col-md-12');
            this.classList.add("active");
            document.getElementById("btnHome").classList.remove("active");
        }
    } else {
        $('#btnHome').addClass('active');
        $('#home').addClass('active');
    }
    $('#bootstrap').css('opacity', '0');
    $('#navbar').css('opacity', '100%');
    $('#main-body').css('display', 'block');
    $('#search-input').focus();
    setTimeout(function () {
        $('#bootstrap').css('z-index', -1);
    }, 1000);
}

function load_data(author_name, id, target) {
    if (document.getElementById(target).getElementsByClassName('accordion-body')[0].innerHTML === "") {
        const accordionXhttp = new XMLHttpRequest();
        accordionXhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById(target).getElementsByClassName('accordion-body')[0].innerHTML =
                    this.responseText;
            }
        }
        document.getElementById(target).getElementsByClassName('accordion-body')[0].innerHTML =
            "<div class='lds-dual-ring'></div>";
        accordionXhttp.open("GET", "details?name=" + author_name + "&id=" + id, true);
        accordionXhttp.send();
    }
}