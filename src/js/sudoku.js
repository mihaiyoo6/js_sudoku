'use strict';
const $ = require('jquery');
let board = [];
let digits = [1,2,3,4,5,6,7,8,9];
let letters = ['A','B','C','D','E','F','G','H','I'];
let selectors = {
	input : '.js-value-input'
};
module.exports = {
	generateGUI,
	generateBoard
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

			let cell = $('<div />',
				{"class": cellClass,
				text: board[letters[i]+digits[j]],
				"data-possition": letters[i]+digits[j],
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

function generateBoard(){

	let boardLen = 0;

	for(let i = 0; i < letters.length; i++){
		for(let j = 0; j < digits.length; j++){
			let randomVal = Math.floor(Math.random() * 8);
			board[letters[i]+digits[j]] = digits[randomVal];
			boardLen ++;
		}
	}

	return board;
}


function checkRow(){}
function checkColumn(){}
function check3X3Square(){}

