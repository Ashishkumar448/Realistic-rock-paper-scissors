const State = {
	Starting: "Starting",
	Playing: "Playing",
	Done: "Done"
};

const Result = {
	Win: "Win",
	Lose: "Lose",
	Draw: "Draw",
	Invalid: "Invalid"
};

const INITIAL_TIME = 4000;

let currentState = undefined;

let playerHandNumber = 0;
let opponentHandNumber = 0;
let score = 0;

const playerHand = player.querySelector(".hand");
const opponentHand = opponent.querySelector(".hand");
const timerCircle = timer.querySelector("circle");

const updateImage = (el, index) => {
	el.style.backgroundPositionY = `${-100 * index}%`;
};

const flipFinger = (value) => {
	playerHandNumber = playerHandNumber ^ value;
	updateImage(playerHand, playerHandNumber);
};

thumb.addEventListener("click", () => flipFinger(1));
index.addEventListener("click", () => flipFinger(2));
middle.addEventListener("click", () => flipFinger(4));
ring.addEventListener("click", () => flipFinger(8));
pinky.addEventListener("click", () => flipFinger(16));

updateImage(playerHand, playerHandNumber);

const validHands = [0, 6, 31]; // rock, scissors, paper

const changeState = (state) => {
	currentState = state;
	document.body.dataset.state = state;
};

const showRandomHand = (el) => {
	const randomNumber = Math.floor(Math.random() * 32);
	updateImage(el, randomNumber);
	return randomNumber;
};

const startMatch = async () => {
	if (
		document.body.dataset.result === Result.Lose ||
		document.body.dataset.result === Result.Invalid
	) {
		resetScore();
	}

	changeState(State.Starting);
	document.body.dataset.result = "";

	let playerHandNumberTemp = 0;
	for (let i = 0; i < 8; i++) {
		showRandomHand(opponentHand);
		playerHandNumberTemp = showRandomHand(playerHand);

		await new Promise((resolve) => setTimeout(resolve, 150));
	}

	playerHandNumber = playerHandNumberTemp;

	opponentHandNumber = validHands[Math.floor(Math.random() * validHands.length)];
	updateImage(opponentHand, opponentHandNumber);

	startPlaying();
};

const determineWinner = () => {
	if (!validHands.includes(playerHandNumber)) {
		return Result.Invalid;
	}

	if (playerHandNumber === opponentHandNumber) {
		return Result.Draw;
	}

	const playerHandIndex = validHands.indexOf(playerHandNumber);
	const opponentHandIndex = validHands.indexOf(opponentHandNumber);

	if ((playerHandIndex + 1) % validHands.length === opponentHandIndex) {
		score++;
		updateScore();
		return Result.Win;
	}

	return Result.Lose;
};

const startPlaying = () => {
	const time = Math.max(Math.round(INITIAL_TIME - 500 * Math.sqrt(score)), 1000);

	timerCircle.style.animationDuration = `${time / 1000}s`;
	changeState(State.Playing);

	setTimeout(() => {
		changeState(State.Done);
		document.body.dataset.result = determineWinner();
	}, time);
};

const updateScore = () => {
	scoreCount.innerHTML = score;
};

const resetScore = () => {
	score = 0;
	updateScore();
};

const toggleModal = () => {
	modalWrapper.classList.toggle("visible");
};

restart.addEventListener("click", startMatch);

rules.addEventListener("click", toggleModal);
modalWrapper.addEventListener("click", toggleModal);

startMatch();