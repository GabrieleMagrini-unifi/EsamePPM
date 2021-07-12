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