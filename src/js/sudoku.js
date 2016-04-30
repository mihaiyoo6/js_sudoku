'use strict';
const $ = require('jquery');
const sudoku = require('sudoku-engine');
let boardGenerated = [];
let board = [];
let boardLen = null;
let positions = [];
let mask = [];
let digits = [1,2,3,4,5,6,7,8,9];
let letters = ['A','B','C','D','E','F','G','H','I'];

let blocks = [
	['A1','A2','A3','B1','B2','B3','C1','C2','C3'],
	['A4','A5','A6','B4','B5','B6','C4','C5','C6'],
	['A7','A8','A9','B7','B8','B9','C7','C8','C9'],

	['D1','D2','D3','E1','E2','E3','F1','F2','F3'],
	['D4','D5','D6','E4','E5','E6','F4','F5','F6'],
	['D7','D8','D9','E7','E8','E9','F7','F8','F9'],

	['G1','G2','G3','H1','H2','H3','I1','I2','I3'],
	['G4','G5','G6','H4','H5','H6','I4','I5','I6'],
	['G7','G8','G9','H7','H8','H9','I7','I8','I9']
];
let selectors = {
	input : '.js-value-input'
};
module.exports = {
	init,
	generateGUI,
};
function init(config){

	boardGenerated = sudoku.generateSolution();
	boardLen = boardGenerated.length;
	positions = _generatePosArr();

	mask =config.mask ? _generateMask(config.level) : mask;
}
function generateGUI(){
	let boardUI = [];
	let p = 0;
	for(let i = 0; i < letters.length; i++){

		let cells =[];
		let rowClass =['board-row', ['js-row', letters[i]].join('-')].join(' ');

		if(i !== 0 && i % 3 == 0){
			rowClass += ' big-border';
		}

		let row = $('<div />',{"class": rowClass});

		for(let j = 0; j < digits.length; j++){
			let cellClass =['board-cell','js-cell', ['js-cell',letters[i], digits[j]].join('-')].join(' ');

			if(j !== 0 && j % 3 == 0){
				cellClass += ' big-border';
			}
			let position = letters[i]+digits[j];
			let isMaks = _inArray(p, mask);
			board[position] = isMaks ? '' : boardGenerated[p];

			let cell = $('<input />',{
				"class": cellClass,
				"value": board[position],
				"data-position": position,
				"data-value": boardGenerated[p],
				"disabled": !isMaks,
				"maxlength": 1,
				"keypress": function(){
					//force only numbers
					return event.charCode >= 48 && event.charCode <= 57;
				},
				"keyup": _checkValue
			});
			p++;
			cells.push( cell );
		}

		row.append(cells);
		boardUI.push(row);
	}

	return boardUI;
}

function _checkValue(e){

	let target = $(e.target);
	let value = target.val();
	let position = target.data('position');

	console.log('position', position,'Value', value);
	console.log('validation line',_checkLine(position, value));
	console.log('validation block', _checkBlock(position, value));
}

function _checkLine(position, value){

	let row = [];
	let col = [];
	let rowIdentifier = position.charAt(0);
	let colIdentifier = position.charAt(1);
	let i = 0;
	while( i < boardLen ){

		if(positions[i].indexOf(rowIdentifier) !== -1){
			row.push(board[positions[i]]);
		}
		if(positions[i].indexOf(colIdentifier) !== -1){
			col.push(board[positions[i]]);
		}
		i++
	}
	return {
			"row": {
				"valid": !_inArray(value, row),
				"values":row
			},
			"col":{
				"valid": !_inArray(value, col),
				"values":col
			}
	}
}

function _checkBlock(position, value){

}

function _getRow(position){

}
function _getCol(position){

}

function _getBlock(position){

}

function _generateMask(level){
	//on level 3(hard) we show only 17 cells minimum to have a unique solution http://www.math.ie/McGuire_V1.pdf
	if(level > 3) {
		level = 3;
	}
	let emptyCells = 13 + 17 * level;
	let emptyCellsPos = [];

	while(emptyCells > 0){

		let randomBool = Math.random() >= 0.5;
		let randomInt = _getRandomInt(0,81);

		if(randomBool  && emptyCellsPos.length === 0 ){
			emptyCellsPos.push(randomInt);
			emptyCells--;
		}else if(randomBool && !_inArray(randomInt, emptyCellsPos) ){
			emptyCellsPos.push(randomInt);
			emptyCells--;
		}
	}

	return emptyCellsPos;
}


function _inArray(value, arr){
	return $.inArray(value, arr) !== -1;
}

function _compareArrs(arr1, arr2){
	return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0
}

function _getRandomInt(min, max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

function _intToPos(int){
	let comp = 0;
	for(let i=0; i< letters.length; i++){
		for (let j = 0; j < digits.length; j++){
			if(int === comp){
				return letters[i]+digits[j];
			}
			comp+=1;
		}
	}
}

function _generatePosArr(){
	let arr = [];
	for(let i=0; i< letters.length; i++){
		for (let j = 0; j < digits.length; j++){
			arr.push(letters[i]+digits[j]);
		}
	}
	return arr;
}
