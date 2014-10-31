// app.js: our main javascript file for this app
"use strict";

var prevImg;
var currentImg;
var currentTile;
var prevTile;

var tiles = [];
var idx;

for (idx = 1; idx <= 32; ++idx) {
    tiles.push({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
} //for each tile

//console.log(tiles);

//when document is ready..
$(document).ready(function() {
    $('#start-game').click(function(){
       console.log('start-game button clicked');
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0,8);
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));

        });
        tilePairs = _.shuffle(tilePairs);
        console.log(tilePairs);

        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex){
            if(elemIndex > 0 && 0 == elemIndex % 4) {
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
        });
        gameBoard.append(row);

        //get starting milliseconds
        var startTime = Date.now();
        window.setInterval(function() {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            if(elapsedSeconds == 1){
                $('#elapsed-seconds').text(elapsedSeconds + ' second');
            }
            else {
                $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
            }
        }, 1000);

        $('#game-board img').click(function(){
            currentImg = $(this);
            currentTile = currentImg.data('tile');

            if(!prevTile){
                prevTile = currentTile;
                prevImg = currentImg;
            }
            else if (currentTile === prevTile) {
                return;
            }
            else {
                console.log(prevImg);
                checkMatch();
                console.log('this is second click');
            }
            flipTile(currentTile, currentImg);
        });
    }); //start game button click
}); //document ready function

function checkMatch(){

    if(currentTile != prevTile){
        console.log('not the same');
        console.log(currentTile);
        console.log(prevTile);
        flipTile(currentTile, currentImg);
        flipTile(prevTile, prevImg);
        prevImg = null;
        prevTile = null;
    }
}

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if(tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        }
        else{
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });

}