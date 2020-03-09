/* images */

let stage = new Image();
stage.src = "./images/stage.png";
let megamanNormal = new Image();
megamanNormal.src = "./images/megaman_normal.png";
let megamanJumping = new Image();
megamanJumping.src = "./images/megaman_jumping.png";
let megamanShooting = new Image();
megamanShooting.src = "./images/megaman_shooting.png";
let megamanShootingAir = new Image();
megamanShootingAir.src = "./images/megaman_shooting_air.png";
let wilyNomral = new Image();
wilyNomral.src = "./images/wily.png";

/* game functions */
let gameArea = {
	ground: 100,
	frame: 0,
	start: function() {
		// console.log("start was called");
		// setInterval(update, 1000);
		let requestId = window.requestAnimationFrame(update);
	},

	clear: function() {
		gameArea.frame += 1;
		context.drawImage(stage, 0, 0, 300, 150); // <== print stage

		if (megaman.isShooting && megaman.y < 100) {
			// print megaman shooting in the air
			context.drawImage(megamanShootingAir, megaman.x - 1, megaman.y - 5);
		} else if (megaman.isShooting) {
			// print megaman shooting
			context.drawImage(megamanShooting, megaman.x, megaman.y);
		} else if (megaman.y === 100) {
			// print megaman in the ground
			context.drawImage(megamanNormal, megaman.x, megaman.y);
		} else {
			// print megaman in the air
			context.drawImage(megamanJumping, megaman.x - 1, megaman.y - 5);
		}

		context.drawImage(wilyNomral, wily.x, wily.y, 65, 75); // <== print wily

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
		if (megaman.health <= 0 || wily.health <= 0) {
			gameArea.clear();
			window.cancelAnimationFrame(requestId);
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
		// this.speedX = 1;
		// this.speedY = 1;
	}

	receiveDamage(damage) {
		console.log("receiveDamage was called");
		this.health -= damage;
	}
	shoot(shooter) {
		console.log("shoot was called");
		shotsMegaman.unshift(new Shot(shooter, this.attackDamage, this.x + 35, this.y + 11));
	}
}

// playable character

class Player extends Character {
	constructor() {
		super(100, 1, 60, 0);
	}

	jump() {
		if (this.y === 100) {
			this.isJumping = true;
		}
	}
}

// not playable character

class Boss extends Character {
	constructor(health, attackDamage, x, y) {
		super(health, attackDamage, x, y);
	}
	shoot(shooter) {
		console.log("shoot was called");
		shotsWily.unshift(
			new Shot(shooter, this.attackDamage, this.x, this.y + 20 + 40 * Math.floor(Math.random() * 2))
		);
	}
}

/* object to colid */

class Shot {
	constructor(shooter, damage, x, y) {
		this.shooter = shooter;
		this.damage = damage;
		this.x = x;
		this.y = y;
	}
}

/* game match */

gameArea.start();

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let megaman = new Player();
let wily = new Boss(100, 25, 190, 48);
let shotsMegaman = [];
let shotsWily = [];

function update() {
	// <== game engine
	// console.log("update was called");
	gameArea.clear();
	jumpUpdate();
	shotUpdate();
	if (gameArea.frame % 80 === 0) wily.shoot("wily"); // wily shot interval
	gameArea.checkGameOver();
	window.requestAnimationFrame(update);
}

function jumpUpdate() {
	if (megaman.y > megaman.maxJumpHigh && megaman.isJumping === true) {
		megaman.y -= 2;
	} else {
		megaman.isJumping = false;
	}
	if (megaman.y < gameArea.ground && megaman.isJumping === false) {
		megaman.y += 2;
	}
}

function drawMegamanPower(shot) {
	context.lineWidth = 1;
	context.fillStyle = "white";
	context.beginPath();
	context.arc(shot.x, shot.y, 3, 0, 2 * Math.PI);
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
}

function drawWilyPower(shot) {
	context.lineWidth = 2;
	context.fillStyle = "red";
	context.beginPath();
	context.arc(shot.x, shot.y, 4, 0, 2 * Math.PI);
	context.fill();
	context.strokeStyle = "white";
	context.stroke();
}

function shotUpdate() {
	shotsMegaman.forEach(shot => {
		if (shot.shooter === "megaman") {
			if (shot.x <= wily.x) {
				drawMegamanPower(shot);
				shot.x += 2;
				// set time to reset normal position image
				if (shotsMegaman.length > 0 && shotsMegaman[0].x > megaman.x + 60) {
					megaman.isShooting = false;
				}
			}
			if (shot.x === wily.x - 1) {
				wily.receiveDamage(megaman.attackDamage);
				console.log(wily.health);
			}
		}
	});
	shotsWily.forEach(shot => {
		if (shot.shooter === "wily") {
			if (shot.x > megaman.x + 20 || shot.x < megaman.x || shot.y > megaman.y + 24 || shot.y < megaman.y) {
				drawWilyPower(shot);
				shot.x -= 2;
			} else if (
				shot.x <= megaman.x + 20 &&
				shot.x >= megaman.x &&
				shot.y <= megaman.y + 24 &&
				shot.y >= megaman.y
			) {
				shotsWily.shift(shot);
				megaman.receiveDamage(wily.attackDamage);
				console.log(megaman.health);
			}
		}
	});
}

document.onkeydown = function(e) {
	switch (e.keyCode) {
		case 38: // <== up arrow
			megaman.jump();
			break;
		case 39: // <== right arrow
			megaman.shoot("megaman");
			megaman.isShooting = true;
			console.log(shots);
			break;
	}
};
