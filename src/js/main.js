const $ = require('jquery');
const sudoku  = require('./sudoku');
jQuery = $
require('bootstrap');

let main = (function(){
	const selectors = {
		boardContainer:'.js-board-container'
	};
	function init(){
		$(selectors.boardContainer).append(sudoku.generateGUI());
	}
	//public interface
	return{
		init
	}
})();

main.init();