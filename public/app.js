$(document).ready(function() {

  $(".button-collapse").sideNav();

  $(document).on("click", ".scrapeButton", function() {

    $.ajax({
      method: "GET",
      url: "/scrape",
      // success: function() {
      //   window.location.href = "/";
      // }
    }).done(function() {
      console.log("hello");
        window.location.href = "/";
    });

  });

  $('.modal').modal();

});

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  if (data.length !== 0) {
    // $("#heading").hide();
    // $("#nav-mobile").append('<li><a href="/scrape"><i class="fa fa-book" aria-hidden="true"></i> Scrape Articles</a></li>');
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class = 'col s9'>" +
        "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + "</div>" + "<div class = 'col s3'>" + "<button class='save waves-effect waves-light btn blue' id='" + data[i]._id + "'>Save Article</button>" + "</div>");
    }
  } else {
    var noArticles = $("#articles").append("<h3>UH OH! Looks like we don't have any articles.</h3>");
  }
});

// Grab the articles as a json
$.getJSON("/saved", function(data) {
  if (data.length !== 0) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#savedArticles").append("<div class = 'col s9'>" +
        "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + "</div>" + "<div class = 'col s3'>" + "<a data-id='" + data[i]._id + "' class='note waves-effect waves-light btn modal-trigger center blue' id='" + data[i]._id + "' href='#modal" + data[i]._id + "'>Add a Note</a>" + "<div id='modal" + data[i]._id + "' class='modal'>" + "<div class='modal-content'>" + "<h4>Notes For Article: " + data[i].title + "<h4>" + "<div class='row'>" + "<form class='col s12'>" + "<div class='row'>" + "<div class='input-field col s12'>" + "<textarea id='titleInput' name='title' class='materialize-textarea'></textarea>" + "<label for='titleInput'>Title</label>" + "</div>" + "<div class='input-field col s12'>" + "<textarea id='bodyInput' name='body' class='materialize-textarea'></textarea>" + "<label for='bodyInput'>Enter Note</label>" + "</div>" + "</div>" + "</form>" + "</div>" + "</div>" + "<div class='modal-footer'>" + "<a data-id='" + data[i]._id + "' href='#!' id='savenote' class='modal-action modal-close waves-effect waves-green btn-flat'>Save Note</a>" + "</div>" + "</div>");
    }
  } else {
    var noArticles = $("#savedArticles").append("<h3>UH OH! Looks like we don't have any articles.</h3>");
  }
});


// $.getJSON("/saved", function(data){
//
//   for (var i=0; i<data.length; i++){
//     $("#savedArticles").append("<p data-id='" + data[i]._id + "'>" + data[i].title +"<button class='note' id='"+data[i]._id+"'>Note</button>"+ "<br />" + data[i].link + "</p>");
//   }
// });

$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title +"<button class='save' id='"+data[i]._id+"'>Save Article</button>"+ "<br />" + data[i].link + "</p>");
  }
});


$(document).on("click", ".save", function() {
  var thisId = $(this).attr("id");
  $.ajax({
    method: "POST",
    url: "/saved" + thisId
  }).done(function(data) {
    $("#modalSaved").modal("open");
    // location.reload();
  });
});

// Whenever someone clicks a p tag
$(document).on("click", ".note", function() {
  // Empty the notes from the note section
  // $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("id");
  console.log("id = " + thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/savedArticles/" + thisId
  })
  // With that done, add the note information to the page
    .done(function(data) {
    console.log(data);
    // The title of the article
    // $("#notes").append("<h2>" + data.title + "</h2>");
    // An input to enter a new title
    // $("#notes").append("<input id='titleinput' name='title' placeholder='Title' >");
    // A textarea to add a new note body
    // $("#notes").append("<textarea id='bodyinput' placeholder='Add note here' name='body'></textarea>");
    // A button to submit a new note, with the id of the article saved to it
    // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

    // If there's a note in the article
    if (data.note) {
      // Place the title of the note in the title input
      $("#titleInput").val(data.note.title);
      // Place the body of the note in the body textarea
      $("#bodyInput").val(data.note.body);
    }
  });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  console.log("hello, I've been clicked");
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("Data-Id: " + thisId);
  console.log("Data " + $("#titleInput").val());
  console.log("Data " + $("#bodyInput").val());

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/savedArticles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleInput").val(),
      // Value taken from note textarea
      body: $("#bodyInput").val()
    }
  })
  // With that done
    .done(function(data) {
    // Log the response
    console.log("DATA: " + data);
    // Empty the notes section
    $("#notes").empty();
  });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".savedArticlesButton", function() {

  $.ajax({
    method: "GET",
    url: "/saved",
    success: function(data) {
      window.location.href = "/savedArticles";
    }
  });
});
