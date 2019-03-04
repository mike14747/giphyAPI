"use strict"

// initialize all variables in the global scope
var apiKey = "EOX2BdHYfrp5hZ1U88xnOrA3II3NTEid";
var queryURL = "";
var newImg = "";
var newBtn = "";
var textNode = "";
var startColCounter = 1;
var columnCounter = 1;
var columnId = 1;
var rowId = 1;
var newGiphyCounter = 0;
var newGiphy = "";
var curImgSrc = "";
var newImgSrc = "";
var newImageCounter = 0;
var newRatingP = "";
var newResultsP = "";
var newResultsRow = "";
var newResultsDiv = "";
var pText = "";
var imgURL = "";
var downloadBtn = "";
var downloadText = "";
var imgId = "";
var idIndex = 0;
var curState = "";
var isChecked = false;
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
    }
}

function downloadGif(curId) {
    imgURL = "https://media.giphy.com/media/" + curId + "/giphy.gif";
    window.open(imgURL);
}

// make an ajax call based upon the button that was clicked
function clickFunction(giphy) {
    // determine if the checkbox is checked
    if (document.getElementById("appendToInput").checked) {
        isChecked = true;
    } else {
        isChecked = false;
        rowId = 1;
    }
    queryURL = "https://api.giphy.com/v1/gifs/search?q=" + giphy + "&api_key=" + apiKey + "&limit=12";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // clear all the images from the 6 image columns if the checkbox is not checked
        if (!isChecked) {
            document.getElementById("search_results").innerHTML = "";
            newImageCounter = 0;
        }
        document.getElementById("instructions").innerHTML = "";
        if (response.data.length > 0) {
            document.getElementById("appendToDiv").classList.remove("display_none");
            // make the row and columns for the images
            newResultsRow = document.createElement("div");
            newResultsRow.setAttribute("class", "row border-bottom flex-wrap img_row mx-auto py-4");
            newResultsRow.setAttribute("id", "row" + rowId);
            newResultsDiv = document.createElement("div");
            newResultsDiv.setAttribute("class", "w-100 text-center mb-2");
            newResultsP = document.createElement("p");
            newResultsP.classList.remove("text-danger");
            newResultsP.innerHTML = "Showing " + response.data.length + " results for '<b>" + giphy + "'</b>... click on an image to toggle it between a still and animated GIF.";
            newResultsDiv.appendChild(newResultsP);
            newResultsRow.appendChild(newResultsDiv);
            document.getElementById("search_results").appendChild(newResultsRow);
            startColCounter = columnId;
            for (var c = 1; c <= 6; c++) {
                newResultsDiv = document.createElement("div");
                newResultsDiv.setAttribute("class", "column");
                newResultsDiv.setAttribute("id", "column-" + columnId);
                newResultsRow.append(newResultsDiv);
                columnId++;
            }
            for (var i = 0; i < response.data.length; i++) {
                if (columnCounter == startColCounter + 6) {
                    columnCounter = startColCounter;
                }
                // ratings P
                newRatingP = document.createElement("p");
                if (response.data[i].rating == "g" || response.data[i].rating == "y") {
                    newRatingP.setAttribute("class", "text-success rating_p");
                } else if (response.data[i].rating == "pg" || response.data[i].rating == "pg-13") {
                    newRatingP.setAttribute("class", "text-warning rating_p");
                } else if (response.data[i].rating == "r") {
                    newRatingP.setAttribute("class", "text-danger rating_p");
                }
                pText = document.createTextNode("Rating: " + response.data[i].rating.toUpperCase());
                newRatingP.appendChild(pText);
                document.getElementById("column-" + columnCounter).appendChild(newRatingP);
                // image
                newImg = document.createElement("img");
                imgId = "img-" + newImageCounter;
                newImg.setAttribute("id", imgId);
                newImg.setAttribute("class", "w-100");
                newImg.setAttribute("img-type", "still");
                newImg.setAttribute("src", response.data[i].images.fixed_width_still.url);
                newImg.setAttribute("onclick", "transitionImg(this.id)");
                document.getElementById("column-" + columnCounter).appendChild(newImg);
                // download button
                downloadBtn = document.createElement("button");
                downloadBtn.setAttribute("id", response.data[i].id);
                downloadBtn.setAttribute("onclick", "downloadGif(this.id)");
                downloadBtn.setAttribute("class", "btn_download");
                downloadText = document.createTextNode("Download");
                downloadBtn.appendChild(downloadText);
                document.getElementById("column-" + columnCounter).appendChild(downloadBtn);
                columnCounter++;
                newImageCounter++;
            }
            rowId++;
        } else {
            newResultsRow = document.createElement("div");
            newResultsRow.setAttribute("class", "row border-bottom flex-wrap img_row mx-auto my-4");
            newResultsRow.setAttribute("id", "rowId");
            newResultsDiv = document.createElement("div");
            newResultsDiv.setAttribute("class", "w-100 text-center mb-2");
            newResultsP = document.createElement("p");
            newResultsP.setAttribute("class", "text-danger");
            newResultsP.innerHTML = "0 results found for: '<b>" + giphy + "</b>'";
            newResultsDiv.appendChild(newResultsP);
            newResultsRow.appendChild(newResultsDiv);
            document.getElementById("search_results").appendChild(newResultsRow);
            rowId++;
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