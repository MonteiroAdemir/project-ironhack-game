/* images */

let stage = new Image();
stage.src = "./images/stage3.jpg";
let result = new Image();
result.src = "./images/final.jpg";
let megamanNormal = new Image();
megamanNormal.src = "./images/megaman_normal.png";
let megamanJumping = new Image();
megamanJumping.src = "./images/megaman_jumping.png";
let megamanShooting = new Image();
megamanShooting.src = "./images/megaman_shooting.png";
let megamanShootingAir = new Image();
megamanShootingAir.src = "./images/megaman_shooting_air.png";
let walkingCounter = 1;
let megamanWalking1 = new Image();
megamanWalking1.src = "./images/megaman_walking1.png";
let megamanWalking2 = new Image();
megamanWalking2.src = "./images/megaman_walking2.png";
let megamanWalking3 = new Image();
megamanWalking3.src = "./images/megaman_walking3.png";
let megamanWalkingback1 = new Image();
megamanWalkingback1.src = "./images/megaman_walkingback1.png";
let megamanWalkingback2 = new Image();
megamanWalkingback2.src = "./images/megaman_walkingback2.png";
let megamanWalkingback3 = new Image();
megamanWalkingback3.src = "./images/megaman_walkingback3.png";
let wilyNormal = new Image();
wilyNormal.src = "./images/wily.png";
let backgroundCanvas = new Image();
backgroundCanvas.src = "./images/megaman_title.jpg";
let backgroundLose = new Image();
backgroundLose.src = "./images/megaman_bw.jpg";

/* audios */

let audio5 = new Audio();
audio5.src = "./audios/audio5.mp3";
audio5.volume = 1;
let audio2 = new Audio();
audio2.src = "./audios/audio2.mp3";
let audio3 = new Audio();
audio3.src = "./audios/audio4.mp3";
let jumpAudio = new Audio();
jumpAudio.src = "./audios/jump_audio.wav";
let shotAudio = new Audio();
shotAudio.src = "./audios/shot_audio.wav";

/* canvas and global variables*/
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let shotsMegaman = [];
let shotsWily = [];
let requestId = null;
let startedGame = false;

window.onload = () => {
	context.fillStyle = "white";
	context.fillText("Press Enter to Start", 107, 110);
	context.drawImage(backgroundCanvas, 75, 15, 150, 75);
};

/* game functions */

let gameArea = {
	ground: 100,
	frame: 0,
	start: function() {
		startedGame = true;
		update();
	},

	clear: function() {
		gameArea.frame += 1;
		context.drawImage(stage, 0, 0, 300, 150); // <== print stage

		for (let i = 1; i <= megaman.health; i += 1) {
			if (i % 25 === 0) {
				context.lineWidth = 4;
				context.fillStyle = "blue";
				context.strokeStyle = "white";
				context.strokeRect(5 + 1 * i, 10, 22, 4);
				context.fillRect(5 + 1 * i, 10, 22, 4);
			}
		}

		for (let i = 1; i < wily.health; i += 25) {
			context.lineWidth = 4;
			context.fillStyle = "red";
			context.strokeStyle = "white";
			context.strokeRect(250 - 1 * i, 10, 22, 4);
			context.fillRect(250 + -1 * i, 10, 22, 4);
		}
	},
	checkGameOver: function() {
		if (megaman.health <= 0) {
			return true;
		} else {
			return false;
		}
	},
	checkWin: function() {
		if (wily.health <= 0) {
			return true;
		} else {
			return false;
		}
	}
};

/* classes */

class Character {
	// <== genereic character
	constructor(health, attackDamage, x, y) {
		this.health = health;
		this.attackDamage = attackDamage;
		this.x = x;
		this.y = y;
		this.isJumping = false;
		this.maxJumpHigh = 50;
		this.isShooting = false;
		this.isWalking = false;
		this.direction = "right";
		this.speedX = 0;
	}

	receiveDamage(damage) {
		this.health -= damage;
	}
	shoot(shooter) {
		shotsMegaman.unshift(new Shot(shooter, this.attackDamage, this.x + 35, this.y + 11));
	}
}

// playable character

class Player extends Character {
	constructor() {
		super(100, 1, 60, 0);
	}

	newPos() {
		if (this.x < 0) this.x = 0;
		if (this.x > 280) this.x = 280;
		this.x += this.speedX;
	}

	jumpUpdate() {
		if (this.y > this.maxJumpHigh && this.isJumping === true) {
			this.y -= 2;
		} else {
			this.isJumping = false;
		}
		if (this.y < gameArea.ground && this.isJumping === false) {
			this.y += 2;
		}
	}

	drawMegaman() {
		if (walkingCounter === 16) {
			walkingCounter = 1;
		}
		if (this.isWalking && this.y === 100 && walkingCounter <= 5 && this.direction === "left") {
			// print this walking 1
			context.drawImage(megamanWalkingback1, this.x - 1, this.y + 2);
			walkingCounter += 1;
		} else if (this.isWalking && this.y === 100 && walkingCounter >= 6 && walkingCounter <= 10 && this.direction === "left") {
			// print this walking 2
			context.drawImage(megamanWalkingback2, this.x - 1, this.y + 2);
			walkingCounter += 1;
		} else if (this.isWalking && this.y === 100 && walkingCounter >= 11 && walkingCounter <= 15 && this.direction === "left") {
			// print this walking 2
			context.drawImage(megamanWalkingback3, this.x - 1, this.y + 2);
			walkingCounter += 1;
		} else if (this.isWalking && this.y === 100 && walkingCounter <= 5 && this.direction === "right") {
			// print this walking 1
			context.drawImage(megamanWalking1, this.x - 1, this.y + 2);
			walkingCounter += 1;
		} else if (this.isWalking && this.y === 100 && walkingCounter >= 6 && walkingCounter <= 10 && this.direction === "right") {
			// print this walking 2
			context.drawImage(megamanWalking2, this.x - 1, this.y + 2);
			walkingCounter += 1;
		} else if (this.isWalking && this.y === 100 && walkingCounter >= 11 && walkingCounter <= 15 && this.direction === "right") {
			// print this walking 2
			context.drawImage(megamanWalking3, this.x - 1, this.y + 2);
			walkingCounter += 1;
		} else if (this.isShooting && this.y < 100) {
			// print this shooting in the air
			context.drawImage(megamanShootingAir, this.x - 1, this.y - 5);
		} else if (this.isShooting) {
			// print this shooting
			context.drawImage(megamanShooting, this.x, this.y);
		} else if (this.y === 100) {
			// print this in the ground
			context.drawImage(megamanNormal, this.x, this.y);
		} else {
			// print this in the air
			context.drawImage(megamanJumping, this.x - 1, this.y - 5);
		}
	}

	drawMegamanPower(shot) {
		context.lineWidth = 1;
		context.fillStyle = "white";
		context.beginPath();
		context.arc(shot.x, shot.y, 3, 0, 2 * Math.PI);
		context.fill();
		context.strokeStyle = "black";
		context.stroke();
	}

	shotUpdate() {
		shotsMegaman.forEach(shot => {
			if (shot.x <= wily.x) {
				this.drawMegamanPower(shot);
				shot.x += 2;
				// set time to reset normal position image
				if (shotsMegaman.length > 0 && shotsMegaman[0].x > megaman.x + 60) {
					megaman.isShooting = false;
				}
			}
			if (shot.x === wily.x - 1 || shot.x === wily.x - 2) {
				shotsMegaman.pop();
				wily.receiveDamage(this.attackDamage);
			}
		});
	}
}

// not playable character

class Boss extends Character {
	constructor(health, attackDamage, x, y) {
		super(health, attackDamage, x, y);
	}

	shoot(shooter) {
		shotsWily.unshift(new Shot(shooter, this.attackDamage, this.x, this.y + 20 + 40 * Math.floor(Math.random() * 2)));
	}

	drawBoss() {
		context.drawImage(wilyNormal, wily.x, wily.y, 65, 75);
	}

	drawBossPower(shot) {
		context.lineWidth = 2;
		context.fillStyle = "red";
		context.beginPath();
		context.arc(shot.x, shot.y, 4, 0, 2 * Math.PI);
		context.fill();
		context.strokeStyle = "white";
		context.stroke();
	}

	shotUpdate() {
		shotsWily.forEach((shot, i) => {
			if (shot.x > megaman.x + 20 || (shot.x < megaman.x && shot.x > 1) || shot.y > megaman.y + 24 || shot.y < megaman.y) {
				this.drawBossPower(shot);
				shot.x -= 2;
			} else if (shot.x < megaman.x + 40 && shot.x > megaman.x - 10 && shot.y < megaman.y + 30 && shot.y > megaman.y - 20) {
				shotsWily.splice(i, 1);
				megaman.receiveDamage(this.attackDamage);
			} else {
				shotsWily.splice(i, 1);
			}
		});
	}
}

class Shot {
	constructor(shooter, damage, x, y) {
		this.shooter = shooter;
		this.damage = damage;
		this.x = x;
		this.y = y;
	}
}

let megaman = new Player();
let wily = new Boss(100, 25, 190, 48);

function update() {
	// <== game engine
	if (gameArea.checkGameOver()) {
		audio3.pause();
		cancelAnimationFrame(update);
		audio2.play();
		context.fillStyle = "black";
		context.fillRect(0, 0, 1000, 1000);
		context.fillStyle = "white";
		context.font = "20px Arial";
		context.drawImage(backgroundLose, 30, 25, 100, 100);
		context.fillText("You Lose!", 150, 78);
		setInterval(() => window.location.reload(), 6000);
	} else if (gameArea.checkWin()) {
		audio3.pause();
		cancelAnimationFrame(update);
		audio5.play();
		context.drawImage(result, 0, 0, 300, 150);
		context.fillStyle = "white";
		context.font = "20px Arial";
		context.fillText("You Win!", 60, 78);
		setInterval(() => window.location.reload(), 6000);
	} else {
		audio3.play();
		megaman.newPos();
		gameArea.clear();
		megaman.drawMegaman();
		wily.drawBoss();
		megaman.jumpUpdate();
		megaman.shotUpdate();
		wily.shotUpdate();
		if (wily.health > 75) {
			if (gameArea.frame % 90 === 0) wily.shoot("wily");
		} else if (wily.health > 50) {
			if (gameArea.frame % 75 === 0) wily.shoot("wily");
		} else if (wily.health > 25) {
			if (gameArea.frame % 60 === 0) wily.shoot("wily");
		} else {
			if (gameArea.frame % 45 === 0) wily.shoot("wily");
		}
		window.requestAnimationFrame(update);
	}
	// gameArea.checkGameOver();
}

document.onkeydown = function(e) {
	switch (e.keyCode) {
		case 38: // <== up arrow
		case 87:
			if (megaman.y === 100) {
				megaman.isJumping = true;
				if (!gameArea.checkGameOver() && !gameArea.checkWin()) jumpAudio.play();
			}
			break;
		case 37: // <== left arrow
		case 65:
			megaman.speedX = -1;
			megaman.isWalking = true;
			megaman.direction = "left";
			break;
		case 39: // <== right arrow
		case 68:
			megaman.speedX = 1;
			megaman.isWalking = true;
			megaman.direction = "right";
			break;
		case 32: // <== space bar
			if (shotsMegaman.length < 3) {
				if (!gameArea.checkGameOver() && !gameArea.checkWin()) shotAudio.play();
				megaman.shoot("megaman");
				megaman.isShooting = true;
			}
			break;
		case 13: // <== enter
			if (!startedGame) gameArea.start();
			break;
	}
};

document.onkeyup = function(e) {
	megaman.speedX = 0;
	megaman.isWalking = false;
};
