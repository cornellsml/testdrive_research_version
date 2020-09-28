function onPrint(){

  $(".insertPrint").empty();
  $(".insertPrint").css('display','block');

  $(".insertPrint").append("<h4>Question 1 for the reflection section.</h4>");
  var responseOne = document.getElementById("eval_responseOne").value;
  $(".insertPrint").append(responseOne);

  $(".insertPrint").append("<h4>Question 2 for the reflection section.</h4>");
  var responseTwo = document.getElementById("eval_responseTwo").value;
  $(".insertPrint").append(responseTwo);

  window.print();

  $(".insertPrint").css('display','none');
}
