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
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let shotsMegaman = [];
let shotsWily = [];
let requestId = null;

/* game functions */

let gameArea = {
	ground: 100,
	frame: 0,
	start: function() {
		// console.log("start was called");
		// setInterval(update, 1000);
		update();
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
			if (shot.x === wily.x - 1) {
				shotsMegaman.pop();
				wily.receiveDamage(this.attackDamage);
				console.log(wily.health);
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
		console.log("shoot was called");
		shotsWily.unshift(
			new Shot(shooter, this.attackDamage, this.x, this.y + 20 + 40 * Math.floor(Math.random() * 2))
		);
	}

	drawWilyPower(shot) {
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
			if (
				shot.x > megaman.x + 20 ||
				(shot.x < megaman.x && shot.x > 10) ||
				shot.y > megaman.y + 24 ||
				shot.y < megaman.y
			) {
				this.drawWilyPower(shot);
				shot.x -= 2;
			} else if (shot.x === megaman.x + 20 && shot.y <= megaman.y + 24 && shot.y >= megaman.y) {
				shotsWily.splice(i, 1);
				megaman.receiveDamage(this.attackDamage);
				console.log(megaman.health);
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
	// console.log("update was called");
	if (gameArea.checkGameOver()) {
		gameArea.clear();
		cancelAnimationFrame(update);
		console.log("Fim do jogo");
	} else {
		gameArea.clear();
		megaman.jumpUpdate();
		megaman.shotUpdate();
		wily.shotUpdate();
		if (gameArea.frame % 80 === 0) wily.shoot("wily"); // wily shot interval
		console.log(shotsWily);
		console.log(shotsMegaman);
		window.requestAnimationFrame(update);
	}
	// gameArea.checkGameOver();
}

document.onkeydown = function(e) {
	switch (e.keyCode) {
		case 38: // <== up arrow
			if (megaman.y === 100) {
				megaman.isJumping = true;
			}
			break;
		case 39: // <== right arrow
			megaman.shoot("megaman");
			megaman.isShooting = true;
			break;
		case 13: // <== enter
			gameArea.start();
			break;
	}
};
