var nArticles = 0;
var nAuthors = 0;
var count1 = 0;
var count2 = 0;
var nAccordion = 0;

var addCols = function (num) {
    for (var i = 1; i <= num; i++) {
        var myCol = $('<div class="accordion-item"> <h2 class="accordion-header" id="flush-heading' + i + '"> <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' + i + '" aria-expanded="false" aria-controls="flush-collapseOne' + i + '">Title ' + i + ' </button></h2><div id="flush-collapse' + i + '" class="accordion-collapse collapse" aria-labelledby="flush-heading' + i + '" data-bs-parent="#accordionFlushExample"><div class="accordion-body">Tutto il resto </div></div></div>');

        myCol.appendTo('#accordionFlushExample');
    }
};


var addCols2 = function (num) {
    for (var i = 1; i <= num; i++) {
        var myCol = $('<div class="accordion-item"> <h2 class="accordion-header" id="flush-heading' + i + '"> <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' + i + '" aria-expanded="false" aria-controls="flush-collapseOne' + i + '">Title ' + i + ' </button></h2><div id="flush-collapse' + i + '" class="accordion-collapse collapse" aria-labelledby="flush-heading' + i + '" data-bs-parent="#accordionFlushAutExample"><div class="accordion-body">Tutto il resto </div></div></div>');

        myCol.appendTo('#accordionFlushAutExample');
    }
};


$(document).ready(function () {
    var accordionHeight = $(".accordion-item").height();
    var height = $('#results').height() - accordionHeight * 2;
    nAccordion = Math.floor(height / accordionHeight);
});

$(document).ready(function () {
    $("#btnGen").click(function () {
        addCols();
        return false;
    });
});

$(document).ready(function () {
    $("#btnFilter").click(function () {

        var myDiv = document.getElementById('filter-panel');

        if (myDiv.style.display == 'block') {
            myDiv.style.display = 'none';
        } else {
            myDiv.style.display = 'block';
        }
    });
});

$(window).resize(function () {
    if ($(window).width() > 576) {
        var myDiv = document.getElementById('filter-panel');
        myDiv.style.display = 'block';
    }
    if ($(window).width() <= 576) {
        var myDiv = document.getElementById('filter-panel');
        myDiv.style.display = 'none';
    }
});

$(document).ready(function () {
    var checkList = document.getElementById('languages-filter');
    checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
        if (checkList.classList.contains('visible'))
            checkList.classList.remove('visible');
        else
            checkList.classList.add('visible');
    }
});

$(document).ready(function () {
    $("#btnHome").click(function () {

        var myDiv = document.getElementById('home');
        var myDiv2 = document.getElementById('users');

        if (myDiv.style.display != 'block') {
            myDiv.style.display = 'block';
            myDiv2.style.display = 'none';
            this.classList.add("active");
            document.getElementById("btnAut").classList.remove("active");
        }
    });
});

$(document).ready(function () {
    $("#btnAut").click(function () {

        var myDiv = document.getElementById('users');
        var myDiv2 = document.getElementById('home');

        if (myDiv.style.display != 'block') {
            myDiv.style.display = 'block';
            myDiv2.style.display = 'none';
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

var checkVisibility = function () {

    $("#accordionFlushExample .accordion-item").slice(nArticles - nAccordion, nArticles).hide();
    $("#accordionFlushAutExample .accordion-item").slice(nAuthors - nAccordion, nAuthors).hide();

    $("#accordionFlushExample .accordion-item").slice(nArticles + nAccordion, nArticles + 2 * nAccordion).hide();
    $("#accordionFlushAutExample .accordion-item").slice(nAuthors + nAccordion, nAuthors + 2 * nAccordion).hide();

    $("#accordionFlushExample .accordion-item").slice(nArticles, nArticles + nAccordion).show();
    $("#accordionFlushAutExample .accordion-item").slice(nAuthors, nAuthors + nAccordion).show();


};

$(document).ready(function () {
    $("#btnPrevResArt").click(function () {

        nArticles -= nAccordion;
        if (nArticles < 0) {
            nArticles = 0;
        }
        checkVisibility();
    });

    $("#btnNextResArt").click(function () {
        if (count1 > nAccordion && nArticles < count1 - nAccordion) {
            nArticles += nAccordion;
        }
        checkVisibility();
    });

    $("#btnPrevResAut").click(function () {

        nAuthors -= nAccordion;
        if (nAuthors < 0) {
            nAuthors = 0;
        }
        checkVisibility();
    });
    $("#btnNextResAut").click(function () {
        if (count2 > nAccordion && nAuthors < count2 - nAccordion) {
            nAuthors += nAccordion;
        }
        checkVisibility();
    });

});

function search() {

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

        // resources
        const xhttpResources = new XMLHttpRequest();
        xhttpResources.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("accordionFlushExample").innerHTML =
                    this.responseText;
            }
        };

        // resources
        const xhttpAuthors = new XMLHttpRequest();
        xhttpAuthors.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("accordionFlushAutExample").innerHTML =
                    this.responseText;
            }
        };
        xhttpResources.open("GET", "resources" + searched + min_date + max_date + author + publisher + languages, true);
        xhttpAuthors.open("GET", "authors" + searched, true);

        document.getElementById("accordionFlushExample").innerHTML = "Caricamento..."
        document.getElementById("accordionFlushAutExample").innerHTML = "Caricamento..."

        nArticles = 0;
        nAuthors = 0;

        xhttpResources.send();
        xhttpAuthors.send();
    }
}

$(document).keyup(function(event) {
    if (event.which === 13) {
        search();
    }
});