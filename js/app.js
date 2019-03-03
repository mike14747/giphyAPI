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
var defaultGiphyArray = ["sun", "moon", "earth", "mars", "jupiter", "rocket", "asteroid", "space shuttle", "comet", "galaxy"];

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
            document.getElementById("search_text").innerHTML = "Showing " + response.data.length + " results for '" + giphy + "'";
        } else {
            document.getElementById("search_text").classList.add("text-danger");
            document.getElementById("search_text").innerHTML = "0 results found for: '" + giphy + "'";
        }
        // make a counter loop through which column to add the images to
        columnCounter = 1;
        for (var i = 0; i < response.data.length; i++) {
            if (columnCounter == 7) {
                columnCounter = 1;
            }
            newImg = document.createElement("img");
            var imgId = "img-" + i;
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

function submitFunction(event) {
    event.preventDefault();
    newGiphy = document.getElementById("giphyInput").value.trim();
    if (newGiphyCounter == 0) {
        document.getElementById("addedBtnDiv").innerHTML = "<p>Added Buttons:</p>";
    }
    if (newGiphy.length > 0) {
        document.getElementById("giphyInput").value = "";
        document.getElementById("removeText").classList.remove("display_none");
        newBtn = document.createElement("button");
        textNode = document.createTextNode(newGiphy);
        newBtn.appendChild(textNode);
        newBtn.setAttribute("id", "addedBtn" + newGiphyCounter);
        newBtn.setAttribute("class", "addedBtn mr-2 mb-2 giphyBtn");
        newBtn.setAttribute("value", newGiphy);
        newBtn.setAttribute("onclick", "clickFunction(this.value)");
        document.getElementById("addedBtnDiv").appendChild(newBtn);
        newGiphyCounter++;
    }
}

function removeFunction(arg) {
    if (arg == 1) {
        document.getElementById("addedBtnDiv").innerHTML = "";
        newGiphyCounter = 0;
    } else if (arg == 2) {
        var idIndex = newGiphyCounter - 1;
        document.getElementById("addedBtn" + idIndex).remove();
        newGiphyCounter--;
    }
    if (newGiphyCounter == 0) {
        document.getElementById("addedBtnDiv").innerHTML = "";
        document.getElementById("removeText").classList.add("display_none");
    }
}

function transitionImg(cur) {
    // if the img-type==still, make it img-type=motion and vise-versa
    var curState = document.getElementById(cur).getAttribute("img-type");
    if (curState == "still") {
        document.getElementById(cur).setAttribute("img-type", "motion");
        curImgSrc = document.getElementById(cur).getAttribute("src");
        newImgSrc = curImgSrc.replace("_s", "_d");
        console.log(newImgSrc);
        document.getElementById(cur).setAttribute("src", newImgSrc);
    } else if (curState == "motion") {
        document.getElementById(cur).setAttribute("img-type", "still");
        curImgSrc = document.getElementById(cur).getAttribute("src");
        newImgSrc = curImgSrc.replace("_d", "_s");
        document.getElementById(cur).setAttribute("src", newImgSrc);
    }
}

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