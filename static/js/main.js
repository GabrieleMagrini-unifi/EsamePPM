var nArticles = 0;
var nAuthors = 0;
var count1 = 0;
var count2 = 0;

var nAccordion = 0;
var articlePageNumber = 1;
var authorPageNumber = 1;

var articleCounter;
var authorCounter;



function setAccordionNumber() {
    let accordionHeight = $(".accordion-item").height();
    let height = $('#results').height() - accordionHeight * 3;
    nAccordion = Math.floor(height / accordionHeight);
}


$(document).ready(function () {
    setAccordionNumber();
});


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
        if (myDiv4.classList.contains('col-md-12')){
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

$(document).ready(function () {
    $("#btnHome").click(function () {

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
            this.classList.add("active");
            document.getElementById("btnAut").classList.remove("active");
        }
    });
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
        }
    });
});

$(document).ready(function () {
    count1 = $("#accordionFlushExample .accordion-item").length;
    document.getElementById("counter").textContent = count1;
    count2 = $("#accordionFlushAutExample .accordion-item").length;
    document.getElementById("counter2").textContent = count2;
    checkVisibility();
});

function checkVisibility() {
    $("#accordionFlushExample .accordion-item").slice(nArticles, nArticles + nAccordion).show();
    $("#accordionFlushAutExample .accordion-item").slice(nAuthors, nAuthors + nAccordion).show();

}

function renderAuthorsAccordions() {
let accordions = $("#accordionFlushAutExample .accordion-item");
    let offset = nAccordion * (authorPageNumber - 1);
    accordions.hide();
    for (let i = offset; i <= offset + nAccordion; i++) {
        accordions.eq(i).show();
    }
}

function renderArticleAccordions() {
    let accordions = $("#accordionFlushExample .accordion-item");
    let offset = nAccordion * (articlePageNumber - 1);
    accordions.hide();
    for (let i = offset; i <= offset + nAccordion; i++) {
        accordions.eq(i).show();
    }
}

$(document).ready(function () {
    $("#btnPrevResArt").click(function () {
        nArticles -= nAccordion;
        articlePageNumber -= 1;
        if(articlePageNumber < 1)
            articlePageNumber = 1;
        if (nArticles < 0) {
            nArticles = 0;
        }
        renderArticleAccordions();
    });
    $("#btnNextResArt").click(function () {
        if(articlePageNumber * nAccordion < articleCounter)
            articlePageNumber += 1;
        if (count1 > nAccordion) {
            nArticles += nAccordion;
        }
        renderArticleAccordions();
    });
    $("#btnPrevResAut").click(function () {
        authorPageNumber -= 1;
        if(authorPageNumber < 1)
            authorPageNumber = 1;
        renderAuthorsAccordions();
    });
    $("#btnNextResAut").click(function () {
        if(authorPageNumber * nAccordion < authorCounter) {
            authorPageNumber += 1;
        }
        renderAuthorsAccordions();
    });
});
function search() {
    let myDiv = document.getElementById('welcome_info');
    let myDiv2 = document.getElementById('btnPrevResArt');
    let myDiv3 = document.getElementById('btnNextResArt');
    let myDiv4 = document.getElementById('btnPrevResAut');
    let myDiv5 = document.getElementById('btnNextResAut');

    if(myDiv.style.display != 'none'){
       myDiv.style.display  = 'none';
       myDiv2.style.display = 'block';
       myDiv3.style.display = 'block';
       myDiv4.style.display = 'block';
       myDiv5.style.display = 'block';
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
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("accordionFlushExample").innerHTML =
                    this.responseText;
                articleCounter = $("#accordionFlushExample").children().length;
                document.getElementById("counter").innerHTML = articleCounter;
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
                authorPageNumber = 1;
                setAccordionNumber();
                renderAuthorsAccordions();
            }
        };
        xhttpResources.open("GET", "resources" + searched + min_date + max_date + author + publisher + languages, true);
        xhttpAuthors.open("GET", "authors" + searched, true);
        document.getElementById("counter").innerText = "Loading";
        document.getElementById("counter2").innerHTML = "Loading";
        xhttpResources.send();
        xhttpAuthors.send();
    }
}
$(document).keyup(function(event) {
    if (event.which === 13) {
        search();
    }
});