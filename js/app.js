"use strict"

// initialize all variables in the global scope
var apiKey = "EOX2BdHYfrp5hZ1U88xnOrA3II3NTEid";
var queryURL = "";
var newImg = "";
var newBtn = "";
var textNode = "";
var columnCounter = 1;
var newGiphyCounter = 0;
var newGiphy = "";
var curImgSrc = "";
var newImgSrc = "";
var newRatingSpan = "";
var spanText = "";
var imgId = "";
var idIndex = 0;
var curState = "";
var defaultGiphyArray = ["sun", "moon", "earth", "mars", "jupiter", "hubble", "asteroid", "space shuttle", "comet", "galaxy"];
var addedGiphyArray = [];

function addGiphyButton(newG) {
    if (newGiphyCounter == 0) {
        document.getElementById("addedBtnDiv").innerHTML = "<p>Added Buttons:</p>";
    }
    document.getElementById("giphyInput").value = "";
    document.getElementById("removeText").classList.remove("display_none");
    newBtn = document.createElement("button");
    textNode = document.createTextNode(newG);
    newBtn.appendChild(textNode);
    newBtn.setAttribute("id", "addedBtn" + newGiphyCounter);
    newBtn.setAttribute("class", "addedBtn mr-2 mb-2 giphyBtn");
    newBtn.setAttribute("value", newG);
    newBtn.setAttribute("onclick", "clickFunction(this.value)");
    document.getElementById("addedBtnDiv").appendChild(newBtn);
    addedGiphyArray.push(newG);
    localStorage.clear();
    localStorage.setItem("addedButtons", JSON.stringify(addedGiphyArray));
    newGiphyCounter++;
}

// load any added giphy button from local storage
var parsedArray = JSON.parse(localStorage.getItem("addedButtons"));
if (parsedArray) {
    for (var i = 0; i < parsedArray.length; i++) {
        addGiphyButton(parsedArray[i]);
        console.log(parsedArray[i]);
    }
}

// make an ajax call based upon the button that was clicked
function clickFunction(giphy) {
    queryURL = "https://api.giphy.com/v1/gifs/search?q=" + giphy + "&api_key=" + apiKey + "&limit=24";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // clear all the images from the 6 image columns
        for (var c = 1; c <= 6; c++) {
            document.getElementById("column-" + c).innerHTML = ("");
        }
        // set search_text with number of results
        if (response.data.length > 0) {
            document.getElementById("search_text").classList.remove("text-danger");
            document.getElementById("search_text").innerHTML = "Showing " + response.data.length + " results for '" + giphy + "'... click on an image to toggle it between a still and animated GIF.";
        } else {
            document.getElementById("search_text").classList.add("text-danger");
            document.getElementById("search_text").innerHTML = "0 results found for: '" + giphy + "'";
        }
        // reset counter and loop through which column to add the images to
        columnCounter = 1;
        for (var i = 0; i < response.data.length; i++) {
            if (columnCounter == 7) {
                columnCounter = 1;
            }
            newRatingSpan = document.createElement("span");
            if (response.data[i].rating == "g" || response.data[i].rating == "y") {
                newRatingSpan.setAttribute("class", "text-success font-weight-bolder");
            } else if (response.data[i].rating == "pg" || response.data[i].rating == "pg-13") {
                newRatingSpan.setAttribute("class", "text-warning font-weight-bolder");
            } else if (response.data[i].rating == "r") {
                newRatingSpan.setAttribute("class", "text-danger font-weight-bolder");
            }
            spanText = document.createTextNode("Rating: " + response.data[i].rating.toUpperCase());
            newRatingSpan.appendChild(spanText);
            document.getElementById("column-" + columnCounter).appendChild(newRatingSpan);
            newImg = document.createElement("img");
            imgId = "img-" + i;
            newImg.setAttribute("id", imgId);
            newImg.setAttribute("class", "w-100");
            newImg.setAttribute("img-type", "still");
            newImg.setAttribute("src", response.data[i].images.fixed_width_still.url);
            newImg.setAttribute("onclick", "transitionImg(this.id)");
            document.getElementById("column-" + columnCounter).appendChild(newImg);
            columnCounter++;
        }
    });
}

// add buttons the user inputs, show the Added Buttons text and show the remove buttons
function submitFunction(event) {
    event.preventDefault();
    newGiphy = document.getElementById("giphyInput").value.trim();
    if (newGiphy.length > 0) {
        addGiphyButton(newGiphy);
    }
}

// remove added buttons (last or all)
function removeFunction(arg) {
    localStorage.clear();
    if (arg == 1) {
        document.getElementById("addedBtnDiv").innerHTML = "";
        addedGiphyArray = [];
        newGiphyCounter = 0;
    } else if (arg == 2) {
        idIndex = newGiphyCounter - 1;
        document.getElementById("addedBtn" + idIndex).remove();
        addedGiphyArray.splice(idIndex, 1);
        newGiphyCounter--;
    }
    if (newGiphyCounter == 0) {
        document.getElementById("addedBtnDiv").innerHTML = "";
        document.getElementById("removeText").classList.add("display_none");
    } else {
        localStorage.setItem("addedButtons", JSON.stringify(addedGiphyArray));
    }
}

// transition gifs from still to motion and vise-versa
function transitionImg(cur) {
    curState = document.getElementById(cur).getAttribute("img-type");
    if (curState == "still") {
        document.getElementById(cur).setAttribute("img-type", "motion");
        curImgSrc = document.getElementById(cur).getAttribute("src");
        newImgSrc = curImgSrc.replace("_s", "_d");
        document.getElementById(cur).setAttribute("src", newImgSrc);
    } else if (curState == "motion") {
        document.getElementById(cur).setAttribute("img-type", "still");
        curImgSrc = document.getElementById(cur).getAttribute("src");
        newImgSrc = curImgSrc.replace("_d", "_s");
        document.getElementById(cur).setAttribute("src", newImgSrc);
    }
}

// dynamically add the default buttons from defaultGiphyArray
for (var i = 0; i < defaultGiphyArray.length; i++) {
    newBtn = document.createElement("button");
    textNode = document.createTextNode(defaultGiphyArray[i]);
    newBtn.appendChild(textNode);
    newBtn.setAttribute("id", "defaultBtn" + i);
    newBtn.setAttribute("class", "defaultBtn mr-2 mb-2 giphyBtn");
    newBtn.setAttribute("value", defaultGiphyArray[i]);
    newBtn.setAttribute("onclick", "clickFunction(this.value)");
    document.getElementById("defaultBtnDiv").appendChild(newBtn);
}