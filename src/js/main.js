const $ = require('jquery');
const sudoku  = require('./sudoku');
jQuery = $;
require('bootstrap');
let devMode = true;
let main = (function(){
	const selectors = {
		boardContainer:'.js-board-container'
	};
	function init(){
		sudoku.init({
			mask: true,
			level: 1,
			devMode: devMode
		});
		$(selectors.boardContainer).append(sudoku.generateGUI());
		if(devMode){
			$('[data-toggle="tooltip"]').tooltip();
		}
	}
	//public interface
	return{
		init
	}
})();

main.init();
window.sudoku = sudoku;