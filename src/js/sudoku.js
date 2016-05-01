'use strict';
const $ = require('jquery');
const sudoku = require('sudoku-engine');
let boardGenerated = [];
let board = [];
let boardLen = null;
let positions = [];
let mask = [];
let answers = null;
let gConfig = {};
let previousPos = null;
let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

let blocks = [
	['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'],
	['A4', 'A5', 'A6', 'B4', 'B5', 'B6', 'C4', 'C5', 'C6'],
	['A7', 'A8', 'A9', 'B7', 'B8', 'B9', 'C7', 'C8', 'C9'],

	['D1', 'D2', 'D3', 'E1', 'E2', 'E3', 'F1', 'F2', 'F3'],
	['D4', 'D5', 'D6', 'E4', 'E5', 'E6', 'F4', 'F5', 'F6'],
	['D7', 'D8', 'D9', 'E7', 'E8', 'E9', 'F7', 'F8', 'F9'],

	['G1', 'G2', 'G3', 'H1', 'H2', 'H3', 'I1', 'I2', 'I3'],
	['G4', 'G5', 'G6', 'H4', 'H5', 'H6', 'I4', 'I5', 'I6'],
	['G7', 'G8', 'G9', 'H7', 'H8', 'H9', 'I7', 'I8', 'I9']
];
let selectors = {
	finishedContainer: '.js-finished-game-container',
	gameProgress: '.js-game-progress',
	cell: '.js-cell',
	row: '.js-row',
	col: '.js-col'
};
module.exports = {
	init,
	generateGUI,
	autoSolve
};
/**
 * init game based on config
 * @param config - Object
 */
function init (config) {
	console.log('sudoku:init:config', config);
	gConfig = config;
	boardGenerated = sudoku.generateSolution();
	boardLen = boardGenerated.length;
	positions = _generatePosArr();
	previousPos = null;
	mask = config.mask ? _generateMask(config.level) : mask;
	answers = mask.length;
	_updateGameStatus(answers);

}

/**
 * generatest User interface for game
 * @returns {Array}
 */
function generateGUI () {
	let boardUI = [];
	let p = 0;
	$(selectors.finishedContainer).fadeOut();
	for (let i = 0; i < letters.length; i++) {

		let cells = [];
		let rowClass = 'board-row';

		if (i !== 0 && i % 3 == 0) {
			rowClass += ' big-border js-big-border';
		}

		let row = $('<div />', {"class": rowClass});

		for (let j = 0; j < digits.length; j++) {
			let cellClass = ['board-cell', 'js-cell', ['js-row', letters[i]].join('-'), ['js-col', digits[j]].join('-'), ['js-cell', letters[i], digits[j]].join('-')].join(' ');

			if (j !== 0 && j % 3 == 0) {
				cellClass += ' big-border js-big-border';
			}
			let position = letters[i] + digits[j];
			let isMaks = _inArray(p, mask);
			board[position] = isMaks ? '' : boardGenerated[p];

			let cell = $('<input />', {
				"class": cellClass,
				"value": board[position],
				"data-position": position,
				"data-value": boardGenerated[p],
				"data-toggle": "tooltip",
				"data-placement": "top",
				"title": gConfig.devMode ? boardGenerated[p] : '',
				"disabled": !isMaks,
				"maxlength": 1,
				"change": _checkValue,
				"keydown": _removeValue,
				"keypress": (e)=> {
					//force only numbers & overite value if new value is number
					if (e.charCode >= 49 && e.charCode <= 57) {
						e.target.value = String.fromCharCode(e.which);
						_checkValue(e);
					} else {
						return false;
					}
				},
				'blur': (e)=> {
					if (!e.target.value) {
						$(e.target).removeClass('board-input-invalid');
					}

					_resetUi();
				}
			});
			p++;
			cells.push(cell);
		}

		row.append(cells);
		boardUI.push(row);
	}

	return boardUI;
}

/**
 * used when user remove a value
 * @param e
 * @private
 */
function _removeValue (e) {
	if (e.keyCode == 8) {
		_resetUi();

		let position = $(e.target).data('position');
		board[position] = null;
		answers = previousPos === position ? answers : answers + 1;
		_updateGameStatus(answers);
	}
}

/**
 * check user inputed value
 * @param e
 * @private
 */
function _checkValue (e) {

	let target = $(e.target);
	let value = parseInt(target.val());
	let position = target.data('position');
	let isColValid = _checkLine(position, value).col.valid;
	let isRowValid = _checkLine(position, value).row.valid;
	let isBlockValid = _checkBlock(position, value).block.valid;
	board[position] = null;

	_resetUi();

	if (!isRowValid) {
		let row = _getRow(position);
		row.each((index, rowItem) => {
			$(rowItem).addClass("board-cell-item-invalid");
		});
	}

	if (!isColValid) {
		let col = _getCol(position);
		col.each((index, colItem) => {
			$(colItem).addClass("board-cell-item-invalid");
		});
	}

	if (!isBlockValid) {
		let block = _getBlock(position);
		for (let i = 0; i < block.length; i++) {
			$(block[i]).addClass("board-cell-item-invalid");
		}
	}
	if (!isColValid || !isRowValid || !isBlockValid) {
		target.addClass('board-input-invalid');
	} else {
		console.log('answers', answers);
		target.removeClass('board-input-invalid');
		board[position] = value;
		answers = previousPos === position ? answers : answers - 1;
		previousPos = position;
	}

	_updateGameStatus(answers);
}

/**
 * update game status & progress
 * @param answers - integer
 * @private
 */
function _updateGameStatus (answers) {
	if (answers < 0) {
		answers = 0;
	}
	let maskLen = mask.length;
	let procent = (maskLen - answers) * 100 / maskLen;
	if (procent < 0) {
		procent = 0;
	}
	procent += '%';
	$(selectors.gameProgress).css('width', procent);

	if (answers == 0) {
		gameFinished();
	}
}

/**
 * handles Ui when games is finished
 */
function gameFinished () {
	$(selectors.cell).prop('disabled', 'disabled');
	$(selectors.cell).addClass('finished');

	setTimeout(()=> {
		$(selectors.finishedContainer).fadeIn();
	}, 750);

}

/**
 * based on position check if value exist on line (row or col)
 * @param position
 * @param value
 * @returns {{row: {valid: boolean, values: Array}, col: {valid: boolean, values: Array}}}
 * @private
 */
function _checkLine (position, value) {

	let row = [];
	let col = [];
	let rowIdentifier = position.charAt(0);
	let colIdentifier = position.charAt(1);
	let i = 0;
	while (i < boardLen) {

		if (positions[i].indexOf(rowIdentifier) !== -1) {
			row.push(board[positions[i]]);
		}
		if (positions[i].indexOf(colIdentifier) !== -1) {
			col.push(board[positions[i]]);
		}
		i++
	}
	return {
		"row": {
			"valid": !_inArray(value, row),
			"values": row
		},
		"col": {
			"valid": !_inArray(value, col),
			"values": col
		}
	}
}
/**
 * check if value is in block
 * @param position
 * @param value
 * @returns {{block: {valid: boolean, block: Array}}}
 * @private
 */
function _checkBlock (position, value) {
	let block = [];
	for (let i = 0; i < blocks.length; i++) {
		let foundBlock = blocks[i];
		if (_inArray(position, foundBlock)) {
			for (let j = 0; j < foundBlock.length; j++) {
				block.push(board[foundBlock[j]]);
			}
		}
	}

	return {
		block: {
			"valid": !_inArray(value, block),
			"block": block
		}
	};
}

/**
 * reset visual feedback
 * @private
 */
function _resetUi () {
	$(selectors.cell).each((index, cellItem)=> {
		$(cellItem).removeClass('board-cell-item-invalid')
	});
}
/**
 * based on position returns one row
 * @param position
 * @returns {*|jQuery|HTMLElement}
 * @private
 */
function _getRow (position) {
	let selector = [selectors.row, position.charAt(0)].join('-');
	return $(selector)

}

/**
 * based on position returns one col
 * @param position
 * @returns {*|jQuery|HTMLElement}
 * @private
 */
function _getCol (position) {
	let selector = [selectors.col, position.charAt(1)].join('-');
	return $(selector)
}

/**
 * based on position returns block
 * @param position
 * @returns {Array}
 * @private
 */
function _getBlock (position) {
	let block = [];

	for (let i = 0; i < blocks.length; i++) {
		let foundBlock = blocks[i];
		if (_inArray(position, foundBlock)) {
			for (let j = 0; j < foundBlock.length; j++) {
				let selector = [selectors.cell, foundBlock[j].charAt(0), foundBlock[j].charAt(1)].join('-');
				block.push($(selector));
			}
		}
	}
	return block;
}

/**
 * based on level generates random mask
 * @param level
 * @returns {Array}
 * @private
 */
function _generateMask (level) {
	//on level 3(hard) we show only 17 cells minimum to have a unique solution http://www.math.ie/McGuire_V1.pdf
	if (level > 3) {
		level = 3;
	}
	let emptyCells = 13 + 17 * level;
	if (gConfig.devMode && gConfig.devEmptyCells) {
		emptyCells = gConfig.devEmptyCells;
	}
	let emptyCellsPos = [];

	while (emptyCells > 0) {

		let randomBool = Math.random() >= 0.5;
		let randomInt = _getRandomInt(0, 81);

		if (randomBool && emptyCellsPos.length === 0) {
			emptyCellsPos.push(randomInt);
			emptyCells--;
		} else if (randomBool && !_inArray(randomInt, emptyCellsPos)) {
			emptyCellsPos.push(randomInt);
			emptyCells--;
		}
	}

	return emptyCellsPos;
}

/**
 * auto solve game
 */
function autoSolve () {
	let firstEmptyCell = _getFirstEmptyCell();
	let cellSelector = "";
	try {
		cellSelector = [selectors.cell, firstEmptyCell.charAt(0), firstEmptyCell.charAt(1)].join('-');
	} catch (e) {
		$(selectors.gameProgress).css('width', '100%');
		gameFinished();
	}

	let cell = $(cellSelector);
	let correctValue = cell.data('value');
	doSetTimeout(cell, 1, correctValue);

}

/**
 * add some time between change values on autosolve
 * @param cell
 * @param tries
 * @param correctValue
 */
function doSetTimeout (cell, tries, correctValue) {
	if (tries <= correctValue) {
		setTimeout(()=> {
			cell.val(tries);
			cell.change();
			if (tries === correctValue && answers > 0) {
				autoSolve();
			}
			tries++;
			doSetTimeout(cell, tries, correctValue);
		}, 20);
	}
}

/**
 * return first empty cell position
 * @returns {*}
 * @private
 */
function _getFirstEmptyCell () {
	let firstEmptyCell = null;
	for (let i = 0; i < boardLen; i++) {
		if (board[positions[i]] === "") {

			firstEmptyCell = positions[i];
			break;
		}
	}
	return firstEmptyCell;
}

/**
 * helper: check if value in array
 * @param value
 * @param arr
 * @returns {boolean}
 * @private
 */
function _inArray (value, arr) {
	return $.inArray(value, arr) !== -1;
}

/**
 * helper: returns an random number
 * @param min
 * @param max
 * @returns {number}
 * @private
 */
function _getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * generates array with all positions
 * @returns {Array}
 * @private
 */
function _generatePosArr () {
	let arr = [];
	for (let i = 0; i < letters.length; i++) {
		for (let j = 0; j < digits.length; j++) {
			arr.push(letters[i] + digits[j]);
		}
	}
	return arr;
}
