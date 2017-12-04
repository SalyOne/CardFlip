var signNameList = [
	"aries",
	"aquarius",
	"cancer",
	"capricon",
	"gemini",
	"leo",
	"libra",
	"pisces",
	"scorpion",
	"sigittarius",
	"taurus",
	"virgo"
];
var board=[];
var dim=4;
var lastClickedIndex = null;
var lastFoundTime = 0;
var timeRange = 5;
var score = 0;
var bestScore = 0;
var $gameContainer = $('.GameContainer');
var $scoreboard = $gameContainer.find('.Scoreboard');
var $cards = $gameContainer.find('.Cards');

function createCardByIndex(index){
	var el = document.createElement("div");
	var sign = document.createElement("div");
	el.setAttribute("class", "Card");
	sign.setAttribute("class", signNameList[index]);
	el.appendChild(sign);

	return el;
}

function resetBoard(){
	board.length = 0;
	for(var i = 0, l = dim * dim / 2; i < l; i++) {
		var rand = parseInt(Math.round(Math.random() * (signNameList.length - 1)));
		board.push(rand);
		board.push(rand);
	}

	board = shuffle(board);
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function showBoard(){
	$cards.html('');
	for(var i of board) {
		$cards.append(createCardByIndex(i));
	}
}

function runGame(){
	resetBoard();
	showBoard();

	$scoreboard.find('.Score').text(score = 0);
};

function isGameOver(){
	return !$cards.find('.Card:not(.deactivated)').length;
}

function gameOver(){
	swal({
		title: 'Game Over!',
		html: "Your Score: " + score + "<br/>Best Score: " + bestScore,
		type: 'success',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'No you have 20 points',
		confirmButtonText: 'Play Again'
	}).then(function(result) {
		if (result.value) {
			runGame();
			swal(
				'Okey',
				'Game is ready!'
			);
		} else {
			swal(
				'WoW!',
				'Thank you very much.',
				'success'
			);
		}
	})
}

function timestamp(){
	return Math.floor(Date.now() / 1000);
}

$cards.on('click', '.Card:not(.deactivated)', function(){
	var $target = $(this);
	var clickedIndex = $target.index();

	if(lastClickedIndex === clickedIndex) {
		$target.removeClass('active');
		lastClickedIndex = null;
		return ;
	}

	if(lastClickedIndex !== null) {
		if(!isMistake(clickedIndex)) {
			applyFoundData();
			runFoundTimeout(lastClickedIndex, clickedIndex);
		} else {
			runMistakeTimeout(lastClickedIndex, clickedIndex);
		}

		lastClickedIndex = null;
	} else {
		lastClickedIndex = clickedIndex;
	}

	$target.addClass('active');
});

$gameContainer.on('click', '.StartNewGame', runGame);

function applyFoundData(){
	var foundTime = timestamp();
	score += (foundTime - lastFoundTime) < timeRange ? score : 10;
	lastFoundTime = foundTime;
	
	if(bestScore < score) {
		bestScore = score;
	}

	$scoreboard.find('.Score').text(score);
	$scoreboard.find('.BestScore').text(bestScore);
}

function isMistake(index){
	return signNameList[board[lastClickedIndex]] !== signNameList[board[index]];
}

function runFoundTimeout(i1, i2){
	setTimeout(function(){
		$cards.children().eq(i1).addClass('deactivated');
		$cards.children().eq(i2).addClass('deactivated');
		if(isGameOver()) {
			gameOver();
		}
	}, 600);
}

function runMistakeTimeout(i1, i2) {
	setTimeout(function(){
		$cards.children().eq(i1).removeClass('active');
		$cards.children().eq(i2).removeClass('active');
	}, 600);
}


runGame();
