'use strict';
const $ = require('jquery');
let board = {};
let positions = [];
let digits = [1,2,3,4,5,6,7,8,9];
let letters = ['A','B','C','D','E','F','G','H','I'];
let values = [];
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
	let i = 0;
	let boardLen = positions.length;
	while(0 < i < boardLen){
		let position = positions[i];
		let generatedValue = generateValue(position);

		if(generatedValue.back){
			console.log('goBack');
			i--cd;
			for(let j = i; j < boardLen; j++){
				board[positions[j]] = null;
			}
			generatedValue = generateValue(position);
		}else{
			board[position] = generatedValue.value;
			i++;
		}
	}
	return board;
}
function generateValue(position){
	let result = {};
	let value = Math.floor(Math.random() * (9 - 1 + 1) + 1);

	//push unique
	if( ($.inArray(value, values) === -1) ){
		values.push(value);
	}

	if(_compareArrs(values, digits)){
		result.back = true;
		result.value = null;
		values = [];
	}else{
		if(checkLine(position, value)){
			result.value = value;
			result.back = false;
			values = [];
		}else{
			//push unique
			if( ($.inArray(value, values) === -1) ){
				values.push(value);
			}
			return generateValue(position);
		}
	}

	return result;
}

function checkLine(position, value){
	let row = [];
	let col = [];
	let rowIdentifier = position.charAt(0);
	let colIdentifier = position.charAt(1);
	let boardLen = positions.length;
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
	return ($.inArray(value, row) === -1) && ($.inArray(value, col) === -1);
}

function check3X3Square(){
	return true
}

function _compareArrs(arr1, arr2){
	return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0
}