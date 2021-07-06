
var addCols = function (){

    var myCol = $('<div class="form-group col-md-6"><label>Language:</label><select class="form-select" aria-label="Default select example"><option selected>Choose</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option></select></div>');

    myCol.appendTo('#filter-content-languages');



    $('.close').on('click', function(e){
      e.stopPropagation();
          var $target = $(this).parents('.col-sm-6');
          $target.hide('slow', function(){ $target.remove(); });
    });
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