/* game functions */

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

let gameArea = {
	ground: 100,
	frame: 0,
	start: function() {
		// console.log("start was called");
		window.requestAnimationFrame(update);
		// setInterval(update, 1000);
	},

	clear: function() {
		// console.log("clear was called");
		gameArea.frame += 1;
		// context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(stage, 0, 0, 300, 150);
		// print megaman
		// context.fillStyle = "blue";
		// context.fillRect(megaman.x, megaman.y, 10, 20);

		if (megaman.isShooting && megaman.y < 100) {
			context.drawImage(megamanShootingAir, megaman.x - 1, megaman.y - 5);
		} else if (megaman.isShooting) {
			context.drawImage(megamanShooting, megaman.x, megaman.y);
		} else if (megaman.y === 100) {
			context.drawImage(megamanNormal, megaman.x, megaman.y);
		} else {
			context.drawImage(megamanJumping, megaman.x - 1, megaman.y - 5);
		}

		// print boss
		// context.fillStyle = "red";
		// context.fillRect(wily.x, wily.y, 20, 40);
		context.drawImage(wilyNomral, wily.x, wily.y, 65, 75);
	}
};

/* classes */

// generic character

class Character {
	constructor(health, attackDamage, x, y) {
		this.health = health;
		this.attackDamage = attackDamage;
		this.isJumping = false;
		this.isShooting = false;
		this.maxJumpHigh = 60;
		this.x = x;
		this.y = y;
		this.speedX = 1;
		this.speedY = 1;
	}

	receiveDamage(damage) {
		console.log("receiveDamage was called");
		this.health -= damage;
	}
	shoot(shooter) {
		console.log("shoot was called");
		shots.unshift(new Shot(shooter, this.attackDamage, this.x + 35, this.y + 11));
	}
}

// playable character

class Player extends Character {
	constructor() {
		super(100, 1, 60, 0);
	}

	jumpUpdate() {
		if (this.y > this.maxJumpHigh && this.isJumping === true) {
			this.y -= 1;
		} else {
			this.isJumping = false;
		}
		if (this.y < gameArea.ground && this.isJumping === false) {
			this.y += 1;
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
		shots.unshift(
			new Shot(
				shooter,
				this.attackDamage,
				this.x,
				this.y + 20 + 40 * Math.floor(Math.random() * 2)
			)
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
let shots = [];

function update() {
	// console.log("update was called");
	megaman.jumpUpdate();
	gameArea.clear();
	shotUpdate();
	if (gameArea.frame % 90 === 0) wily.shoot("wily");
	window.requestAnimationFrame(update);
}

function shotUpdate() {
	shots.forEach(shot => {
		if (shot.shooter === "megaman") {
			if (shot.x <= wily.x) {
				context.fillStyle = "white";
				context.beginPath();
				context.arc(shot.x, shot.y, 3, 0, 2 * Math.PI);
				context.fill();
				context.strokeStyle = "black";
				context.stroke();
				shot.x += 2;
				if (shots.length > 0 && shots[0].x > megaman.x + 60) {
					megaman.isShooting = false;
				}
			}
			if (shot.x === wily.x - 1) {
				wily.receiveDamage(megaman.attackDamage);
				console.log(wily.health);
			}
		} else {
			if (shot.x >= megaman.x + 20 || shot.y <= megaman.y - 5 || shot.y >= megaman.y + 24 ) {
				context.fillStyle = "red";
				context.beginPath();
				context.arc(shot.x, shot.y, 3, 0, 2 * Math.PI);
				context.fill();
				context.strokeStyle = "black";
				context.stroke();
				shot.x -= 2;
			}
			if (shot.x === megaman.x + 20 && shot.y >= megaman.y - 5 && shot.y <= megaman.y + 24) {
				megaman.receiveDamage(wily.attackDamage);
				console.log(megaman.health);
			}
		}
	});
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
			console.log(shots);
			break;
	}
};
