'use strict';
const $ = require('jquery');
let board = {};
let positions = [];
let digits = [1,2,3,4,5,6,7,8,9];
let letters = ['A','B','C','D','E','F','G','H','I'];
let selectors = {
	input : '.js-value-input'
};
module.exports = {
	generateEmptyBoard,
	populateBoard,
	generateGUI
};

function generateGUI(){
	let boardUI = [];

	for(let i = 0; i < letters.length; i++){

		let cells =[];
		let rowClass =['board-row', ['js-row', letters[i]].join('-')].join(' ');

		if(i !== 0 && i % 3 == 0){
			rowClass += ' big-border';
		}

		let row = $('<div />',{"class": rowClass});

		for(let j = 0; j < digits.length; j++){
			let cellClass =['board-cell', ['s-cell',letters[i], digits[j]].join('-')].join(' ');

			if(j !== 0 && j % 3 == 0){
				cellClass += ' big-border';
			}
			let position = letters[i]+digits[j];
			let cell = $('<div />',
				{"class": cellClass,
				text: board[position],
				"data-position": position,
				click: clickCell});

			cells.push( cell );
		}

		row.append(cells);
		boardUI.push(row);
	}

	return boardUI;
}

function clickCell(e){

	let  input = $(selectors.input, e.target);

	if( !input.length ) {
		input = $('<input/>', {
			"class": ['value-input', selectors.input.substring(1)].join(' ')
		});
		$(e.target).append(input);
	}

	input.blur(()=>{input.remove()});

	input.keyup(()=>{
		console.log('change');
	});

	input.focus();

}

function generateEmptyBoard(callback){
	let boardLen = 0;

	for(let i = 0; i < letters.length; i++){
		for(let j = 0; j < digits.length; j++){
			board[letters[i]+digits[j]] = null;
			boardLen ++;
		}
	}
	positions = Object.keys(board);
	if(typeof callback ==='function'){
		callback();
	}
	return board;
}

function populateBoard(){
	for(let i = 0; i < letters.length; i++){
		for(let j = 0; j < digits.length; j++){

			let position = letters[i]+digits[j];
			board[position] = generateValue(position);
		}
	}
	return board;
}
function generateValue(position){
	let value = Math.floor(Math.random() * (9 - 1 + 1) + 1);
	if(checkLine(position, value)){
		return value;
	}else{
		return generateValue(position);
	}
}

function checkLine(position, value){
	let row = [];
	let col = [];
	let rowIdentifier = position.charAt(0);
	let colIdentifier = position.charAt(1);
	let boardLen = positions.length;
	for(var i = 0; i < boardLen; i++){

		if(positions[i].indexOf(rowIdentifier) !== -1){
			row.push(board[positions[i]]);
		}
		//if(positions[i].indexOf(colIdentifier) !== -1){
		//	col.push(board[positions[i]]);
		//}
	}
	return ($.inArray(value, row) === -1) && ($.inArray(value, col) === -1);
}

function check3X3Square(){
	return true
}

