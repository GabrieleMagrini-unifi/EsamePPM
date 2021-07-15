var nArticles = 0;
var nAuthors = 0;
var count1 = 0;
var count2 = 0;
var nAccordion = 6;

var addCols = function (){

    var myCol = $('<div class="form-group col-md-6"><label>Language:</label><select class="form-select" aria-label="Default select example"><option selected>Choose</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option></select></div>');

    myCol.appendTo('#filter-content-languages');

};

$(document).ready(function(){
    addCols();
    return false;
});

$(document).ready(function() {
  $("#btnGen").click(function() {
      addCols();
      return false;
  });
});

$(document).ready(function() {
 $("#btnFilter").click(function() {

    var myDiv = document.getElementById('filter-panel');

    if (myDiv.style.display == 'block') {
      myDiv.style.display = 'none';
    } else {
      myDiv.style.display = 'block';
    }
 });
});

$(window).resize(function() {
  if ($(window).width() > 576) {
     var myDiv = document.getElementById('filter-panel');
     myDiv.style.display = 'block';
  }
  if ($(window).width() <= 576) {
       var myDiv = document.getElementById('filter-panel');
       myDiv.style.display = 'none';
    }
});

$(document).ready(function() {
var checkList = document.getElementById('languages-filter');
checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
  if (checkList.classList.contains('visible'))
    checkList.classList.remove('visible');
  else
    checkList.classList.add('visible');
}
});

$(document).ready(function() {
 $("#btnHome").click(function() {

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

$(document).ready(function() {
 $("#btnAut").click(function() {

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

$(document).ready(function() {

    var count1 = $("#accordionFlushExample .accordion-item").length
    document.getElementById("counterArticles").textContent = count1;

    var count2 = $("#accordionFlushAutExample .accordion-item").length
    document.getElementById("counterAuthors").textContent = count2;

});

$(document).ready(function() {

    count1 = $("#accordionFlushExample .accordion-item").length;
    document.getElementById("counter").textContent = count1;

    count2 = $("#accordionFlushAutExample .accordion-item").length;
    document.getElementById("counter2").textContent = count2;

    checkVisibility();

});

var checkVisibility = function (){

    $("#accordionFlushExample .accordion-item").slice(nArticles-nAccordion, nArticles).hide();
    $("#accordionFlushAutExample .accordion-item").slice(nAuthors-nAccordion, nAuthors).hide();

    $("#accordionFlushExample .accordion-item").slice(nArticles+nAccordion, nArticles+2*nAccordion).hide();
    $("#accordionFlushAutExample .accordion-item").slice(nAuthors+nAccordion, nAuthors+2*nAccordion).hide();

    $("#accordionFlushExample .accordion-item").slice(nArticles, nArticles+nAccordion).show();
    $("#accordionFlushAutExample .accordion-item").slice(nAuthors, nAuthors+nAccordion).show();



};

$(document).ready(function() {
   $("#btnPrevResArt").click(function() {

      nArticles -= 6;
      if(nArticles < 0){
         nArticles = 0;
      }
      checkVisibility();
   });

   $("#btnNextResArt").click(function() {
       if(count1 > 6 && nArticles < count1-6){
         nArticles += 6;
       }
       checkVisibility();
   });

   $("#btnPrevResAut").click(function() {

      nAuthors -= 6;
      if(nAuthors < 0){
         nAuthors = 0;
      }
      checkVisibility();
   });
   $("#btnNextResAut").click(function() {
       if(count2 > 6 && nAuthors < count2-6){
         nAuthors += 6;
       }
       checkVisibility();
   });



});