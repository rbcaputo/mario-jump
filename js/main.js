const gameBoard = document.querySelector('.game-board');
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const powUp = document.querySelector('.power-up');
const clouds = document.querySelector('.clouds');
const gameOverScr = document.querySelector('.game-over');
const play = document.querySelector('.play');

let isMounted = false;
document.addEventListener('keydown', (ev) => {
	if (ev.code == 'Space') {
		if (!isMounted) {
			mario.classList.add('mario-jump');
			setTimeout(() => {
				mario.classList.remove('mario-jump');
			}, 750);
		} else {
			mario.classList.add('yoshi-jump');
			setTimeout(() => {
				mario.classList.remove('yoshi-jump');
			}, 750);
		}
	}
});

function swapSprites() {
	isMounted = true;
	mario.src = '../img/yoshi.gif';
	mario.style.bottom = '-3px';
	setTimeout(() => {
		isMounted = false
		mario.src = '../img/mario.gif';
		mario.style.bottom = '0';
	}, 5000);
}

let isFilled = false;
function emptyPowUp() {
	powUp.style.backgroundImage = '';
}

function fillPowUp() {
	let crrDegree = 0;
	const startTime = Date.now();
	const fillInterval = setInterval(() => {
		const elapsedTime = Date.now() - startTime;
		crrDegree = Math.floor((elapsedTime / 10000) * 360);
		if (crrDegree >= 360) {
			clearInterval(fillInterval);
		} else {
			crrDegree++;
			powUp.style.backgroundImage = `conic-gradient(#fff ${crrDegree}deg, transparent ${crrDegree}deg)`;
		}
	}, 50);
	setTimeout(() => {
		isFilled = true;
		powUp.style.opacity = '1';
		powUp.style.animation = 'powup-animation-glow 1s infinite';
		powUp.addEventListener('click', function click() {
			swapSprites();
			emptyPowUp();
			powUp.style.opacity = '0.5';
			powUp.style.animation = 'none';
			powUp.removeEventListener('click', click);
			fillPowUp();
		});
	}, 10000);
};
fillPowUp();

function setGameOver() {
	const marioPos = mario.offsetLeft;
	const pipePos = pipe.offsetLeft; 
	const cloudsPos = clouds.offsetLeft;
	mario.src = './img/game-over.png';
	mario.style.width = '65px';
	mario.style.bottom = `${marioPos}px`;
	mario.style.animation = 'mario-animation-dead 1s linear forwards';
	pipe.style.animation = 'none';
	pipe.style.left = `${pipePos}px`;
	clouds.style.animation = 'none';
	mario.style.marginLeft = '25px';
	clouds.style.left = `${cloudsPos}px`;
	clearInterval(updatePositions);
	setTimeout(() => {
		gameBoard.style.borderColor = '#000';
		mario.style.display = 'none';
		pipe.style.display = 'none';
		powUp.style.display = 'none';
		clouds.style.display = 'none';
		gameOverScr.src = './img/game-over-screen.png';
		gameOverScr.style.opacity = '1';
	}, 2000);
	setTimeout(() => {
		play.style.display = 'block';
		play.addEventListener('click', () => {
			location.reload();
		});
	}, 4000);
}

function checkCollision(marioPos, pipePos) {
	const marioLeft = marioPos.left + 60;
	const marioRight = marioPos.left + (marioPos.width - 50);
	const marioTop = marioPos.top;
	const marioBottom = marioPos.top + marioPos.height;
	const pipeLeft = pipePos.left;
	const pipeRight = pipePos.left + pipePos.width;
	const pipeTop = pipePos.top;
	const pipeBottom = pipePos.top + pipePos.height;
	if (marioRight >= pipeLeft && marioLeft <= pipeLeft && marioBottom > pipeTop && marioTop < pipeBottom ||
		marioBottom >= pipeTop && marioTop <= pipeTop && marioRight > pipeLeft && marioLeft < pipeRight ||
		marioLeft <= pipeRight && marioRight >= pipeRight && marioBottom > pipeTop && marioTop < pipeBottom) {
		setGameOver();
	}
}

const updatePositions = setInterval(() => {
	const marioPos = mario.getBoundingClientRect();
	const pipePos = pipe.getBoundingClientRect();
	checkCollision(marioPos, pipePos);
}, 10);