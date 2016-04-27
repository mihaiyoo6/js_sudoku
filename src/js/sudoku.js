'use strict';
const $ = require('jquery');
module.exports = {
	generateGUI
};

function generateGUI(){
	let board = [];
	for(let i = 0; i < 9; i++){
		let cells =[];
		let rowClass =['board-row', ['js-row', i+1].join('-')].join(' ');
		if(i !== 0 && i % 3 == 0){
			rowClass += ' big-border';
		}
		let row = $('<div />',{"class": rowClass});

		for(let j = 0; j < 9; j++){
			let cellClass =['board-cell', ['s-cell',i+1, j+1].join('-')].join(' ');
			if(j !== 0 && j % 3 == 0){
				cellClass += ' big-border';
			}
			let cell =$('<div />',
				{"class": cellClass,
				click: clickCell});
			cells.push( cell );
		}

		row.append(cells);
		board.push(row);
	}

	return board;
}

function clickCell(){
	console.log(arguments);
}