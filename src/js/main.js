const $ = require('jquery');

let count = 0;
let countHolder = $('#count');

$('#test').click( ()=>{

	count++;
	countHolder.text(count +' clicks ');
});
