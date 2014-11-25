// app.js: our main javascript file for this app
"use strict";

var currentImg;
var currentTile;
var prevTile;
var prevImg;
var matches;
var missed;
var remaining;;
var idx;
var tiles;
var timer;

//when document is ready..
$(document).ready(function() {
    $('#start-game').click(function(){
        tiles = [];
        for (idx = 1; idx <= 32; ++idx) {
            tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg',
            flipped: false,
            matched: false
        });
    } 

    window.clearInterval(timer);
    var gameBoard = $('#game-board');
    gameBoard.empty();
    
    // first tile shuffle
    tiles = _.shuffle(tiles);

    // first 8 tiles selected
    var selectedTiles = tiles.slice(0,8);
    var tilePairs = [];

    // selected 8 are on board
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));

}); 
    tilePairs = _.shuffle(tilePairs);

    var row = $(document.createElement('div'));
    var img;

    // tiles are organized in rows of 4
    _.forEach(tilePairs, function(tile, elemIndex){
        if(elemIndex > 0 && 0 == (elemIndex % 4)) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }

       img = $(document.createElement('img'));
        img.attr({
           src: 'img/tile-back.png',
           alt: 'tile ' + tile.tileNum
        });

        img.data('tile', tile);
        row.append(img);
    }); // end of forEach
    gameBoard.append(row);


    //get starting milliseconds
    var startTime = Date.now();
    timer = window.setInterval(function() {
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        elapsedSeconds = Math.floor(elapsedSeconds);
        if(elapsedSeconds == 1){
            $('#elapsed-seconds').text(elapsedSeconds + ' second');
        }
        else {
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }
    }, 1000);
    matches = 0;
    missed = 0;
    remaining = 8;
    update();

    $('#game-board img').click(function(){
        currentImg = $(this);
        currentTile = currentImg.data('tile');

        if(currentTile.flipped) {
            console.log('same tile clicked');
            return;
        }
        flipTile(currentTile, currentImg);
        if(!prevTile){
            console.log('first click');

            prevTile = currentTile;
            prevImg = currentImg;
            console.log(currentTile);
        }
        else{
            console.log('this is second click');
            checkMatch(currentTile, currentImg);
        }
        update();
    });
}); //start game button click
}); //document ready function

function flipTile(tile, img) {
    img.fadeOut(100, function() {
    if(tile.flipped) {
        if(!tile.matched) {
            img.attr('src', 'img/tile-back.png');
        }
    }
    else{
        img.attr('src', tile.src);
    }
    tile.flipped = !tile.flipped;
    img.fadeIn(100);
}); //end of flipTile
}

function checkMatch(tile, img){
    if(currentTile.tileNum == prevTile.tileNum){
        matches++;
        remaining--;
        update();
        
        currentTile.matched = true;
        prevTile.matched = true;
       
        if(remaining == 0){
            console.log('I am finished!');
            window.setTimeout(function(){
                window.clearInterval(timer);
                alert("Congrats! You Won!");
            }, 250);
        }
        currentTile = null;
        currentImg = null;
        prevTile = null;
        prevImg = null;   
    }

    else{
        console.log('not the same');
        missed++;

        setTimeout(function(){
            flipTile(currentTile, currentImg);
            flipTile(prevTile, prevImg);
            currentTile = null;
            currentImg = null;
            prevTile = null;
            prevImg = null;
        }, 1000);
        
    }

    update();
}

function update(){
    $('#matches-made').text(matches);
    $('#overall-missed').text(missed);
    $('#overall-remaining').text(remaining);
}

