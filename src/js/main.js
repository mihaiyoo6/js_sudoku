const $ = require('jquery');
const sudoku = require('./sudoku');
jQuery = $;
require('bootstrap');
let sudokuConfig = {
	devMode: false,
	showDevHints: false,
	devEmptyCells: null,
	level: 1,
	mask: true
};
let main = (function () {
	const selectors = {
		boardContainer: '.js-board-container',
		saveDev: '.js-devSettings-save',
		newGame: '.js-new-game',
		levelSelected: '.js-level-selected',
		autoSolve: '.js-auto-solve'
	};

	/**
	 * bind events for main program
	 */
	function bindEvents () {
		$(selectors.newGame).click(()=> {
			generateGame(sudokuConfig);
		});
		$(selectors.saveDev).click(()=> {
			sudokuConfig.devMode = $("[name='devMode']").bootstrapSwitch('state');
			sudokuConfig.showDevHints = $("[name='devHint']").bootstrapSwitch('state');
			sudokuConfig.mask = true;
			sudokuConfig.devEmptyCells = parseInt($("[name='devLevels']:checked").val());
			generateGame(sudokuConfig);
			$('#devModal').modal('hide');
		});
		$(selectors.levelSelected).click(()=> {
			sudokuConfig.level = parseInt($("[name='gameLevels']:checked").val());
			generateGame(sudokuConfig);
			$('#levelModal').modal('hide');
		});
		$(selectors.autoSolve).click(()=> {
			sudoku.autoSolve();
		});
	}

	/**
	 * reads settings form devSettings modal
	 */
	function readDevSettings () {
		$("[name='devMode']").on('switchChange.bootstrapSwitch', function (event, state) {
			$("[name='devHint']").bootstrapSwitch('toggleDisabled');


			$("[name='devLevels']").each((index, item)=> {
				let method = state ? 'removeAttribute' : 'setAttribute';
				item[method]('disabled', state);
			});
		});
	}

	/**
	 * used to init main program
	 */
	function init () {
		bindEvents();
		readDevSettings();
		generateGame(sudokuConfig);
		$("[name='devHint']").bootstrapSwitch();
		$("[name='devMode']").bootstrapSwitch();
		autoPlayYouTubeModal();
	}

	/**
	 *  generate game from sudoku api
	 * @param config - Object
	 */
	function generateGame (config) {

		sudoku.init(config);
		let game = sudoku.generateGUI();
		$(selectors.boardContainer).html('').append(game);
		if (sudokuConfig.devMode && config.showDevHints) {
			$('[data-toggle="tooltip"]').tooltip();
		}
	}


	/**
	 * add functionality to autoplay and stop youtube video in mdoal
	 */
	function autoPlayYouTubeModal () {
		var trigger = $("body").find('[data-toggle="modal"]');
		trigger.click(function () {
			var theModal = $(this).data("target"),
				videoSRC = $(this).attr("data-theVideo"),
				videoSRCauto = videoSRC + "?autoplay=1";
			$(theModal + ' iframe').attr('src', videoSRCauto);
			$(theModal + ' button.close').click(function () {
				$(theModal + ' iframe').attr('src', videoSRC);
			});
			$('.modal').click(function () {
				$(theModal + ' iframe').attr('src', videoSRC);
			});
		});
	}

	//public interface
	return {
		init
	}
})();

$(document).ready(()=> {
	main.init();
});
