const $ = require('jquery');
const sudoku  = require('./sudoku');
jQuery = $
require('bootstrap');

let main = (function(){
	const selectors = {
		boardContainer:'.js-board-container'
	};
	function init(){
		sudoku.init({
			mask: true,
			level: 1
		});
		$(selectors.boardContainer).append(sudoku.generateGUI());
	}
	//public interface
	return{
		init
	}
})();

main.init();
window.sudoku = sudoku;