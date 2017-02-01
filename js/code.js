var canvas = document.getElementById('myCanvas');
document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/Title.jpg)";
var ctx = myCanvas.getContext('2d');
var music = document.getElementById('music');
var ready = document.getElementById('ready');
var playerAction = document.getElementById('playerAction');

music.setAttribute("src", "resources/audio/music/Title.mp3");
music.currentTime = 0;
music.volume = 1;
music.play();
var gamemode = 0; //Determines whether player is in menu, on field, or in battle
var debug = false; //Debug mode's only changes are displaying enemy stamina and MP instead of only hp.

//transition things
var transCount = 1;
var transCheck = true;

//Menu things
var cursor = {
	x: 0,
	y: 0,
	size: 30,
	position: 1,
	posX: 0,
	posY: 0,
}

var sticky = false;

//Field things
var Char = {
	class: 0, //characters class, vital variable
	//field things
	x: 0,
	y: 0,
	size: 100,
	speed: 1.5,

	//Battle things
	//stats
	maxhp: 100,
	hp: 100,
	maxmp: 50,
	mp: 50,
	str: 10,
	dex: 10,
	def: 10,
	spd: 10,
	spatk: 10,
	spdef: 10,

  exp: 0, //used for leveling up
	expNext: 100, //exp needed for next level, scales exponentially
	level: 1,
	//variables
	stamina: 0,

};

var monster = {
	//monster type, determines which monster
	type: 0,
	//monster default stats
	maxhp: 100,
	hp: 100,
	maxmp: 50,
	mp: 50,
	str: 10,
	dex: 0,
	def: 10,
	spd: 10,
	spatk: 10,
	spdef: 10,

	//variables
	stamina: 0,
	exp: 100, //amount of exp the monster is worth
	int: 100, //determines range for rng to attack after stamina is full. The larger the number, the dumber the monster.
}

//victory things
var victoryCounter = monster.exp;
var victoryNext = 0;

var encounter = 0;
var monAI = 0; //used to determine when monster attacks
//Battle things

var playerDamageDealt = 0;
var enemyDamageDealt = 0;

var defending = false; //whether or not the player is defending.
var battleMenu = 0; //determines which screen to draw in the menu

var enemyVampire = 0; //used for the final bosses health drain skill

var tombImage = new Image();
tombImage.src = "resources/images/gui/tombstone.png";

var monImage = new Image();
monImage.src = "resources/images/placeholder.png";

var battleArrow = new Image();
battleArrow.src = "resources/images/gui/battleArrow.png";

//Global Things
var pauseCheck = 0; //Determines what mode you were in when you unpause

var bossDefeated = 0; //checks how many bosses you've beaten, used for game progression.
var bossCheck = false; //used for boss transitions

var charImage = new Image();
charImage.src = "resources/images/placeholder.png";

//Keyboard Detection
var keysDown = {};
var mouseUpdate = false;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
	//sticky variables keep events from running more than once
		sticky = false;
		sticky2 = false;
	  stickyMonsterAttack = false;
}, false);

function randomRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.round(Math.random() * (max - min)) + min;
};

// Checks current key and does action depending on key on main menu
function updateMenu() {
	if ((87 in keysDown && cursor.position > 1) && sticky == false) { // Player holding w
		cursor.position -= 1;
		sticky = true;
	}
	if ((83 in keysDown && cursor.position < 5) && sticky == false) { // Player holding s
		cursor.position += 1;
		sticky = true;
	}
	if ((38 in keysDown && cursor.position > 1) && sticky == false) { // Player holding up
		cursor.position -= 1;
		sticky = true;
	}

	if ((40 in keysDown && cursor.position < 5) && sticky == false) { // Player holding down
		cursor.position += 1;
		sticky = true;
	}
	if ((54 in keysDown && cursor.position < 5) && sticky == false) { // Player holding 6
		cursor.position = 6;
		sticky = true;
	}
	if ((68 in keysDown && cursor.position < 5) && sticky == false) { // Player holding d
		debug = true;
		sticky = true;
	}
	// When enter is pressed, it uses the cursor position to select your classes image and starting stats
	if (13 in keysDown && sticky == false) {
	gamemode = 1;
	Char.size = 100;
	Char.level = 1;
	Char.expNext = 100;
	Char.exp = 0;
	music.pause();
	music.setAttribute("src", "resources/audio/music/Field.mp3");
	music.currentTime = 0;
	music.volume = 1;
	music.play();
	document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/field.png)";
	  switch(cursor.position) {
		case 1:
		charImage.src = "resources/images/class/Knight.png";
		Char.class = 1
		Char.maxhp = 125
		Char.hp = 125
		Char.maxmp = 18
		Char.mp = 18
		Char.str = 16
		Char.dex = 7
		Char.def = 30
		Char.spd = 8
		Char.spatk = 3
		Char.spdef = 15
		break;
		case 2:
		charImage.src = "resources/images/class/Archer.png";
		Char.class = 2
		Char.maxhp = 80
		Char.hp = 80
		Char.maxmp = 25
		Char.mp = 25
		Char.str = 8
		Char.dex = 20
		Char.def = 20
		Char.spd = 14
		Char.spatk = 10
		Char.spdef = 20
		break;
		case 3:
		charImage.src = "resources/images/class/Wizard.png";
		Char.class = 3
		Char.maxhp = 75
		Char.hp = 75
		Char.maxmp = 80
		Char.mp = 80
		Char.str = 7
		Char.dex = 15
		Char.def = 15
		Char.spd = 10
		Char.spatk = 16
		Char.spdef = 30
		break;
		case 4:
		charImage.src = "resources/images/class/Pirate.png";
		Char.class = 4
		Char.maxhp = 150
		Char.hp = 150
		Char.maxmp = 10
		Char.mp = 10
		Char.str = 15
		Char.dex = 12
		Char.def = 25
		Char.spd = 9
		Char.spatk = 6
		Char.spdef = 20
		break;
		case 5:
		charImage.src = "resources/images/class/Tourist.png";
		Char.class = 5
		Char.maxhp = 50
		Char.hp = 50
		Char.maxmp = 20
		Char.mp = 20
		Char.str = 5
		Char.dex = 5
		Char.def = 15
		Char.spd = 12
		Char.spatk = 25
		Char.spdef = 15
		break;
		case 6:
		charImage.src = "resources/images/class/Santa.png";
		Char.class = 6
		Char.maxhp = 200
		Char.hp = 200
		Char.maxmp = 200
		Char.mp = 200
		Char.str = 35
		Char.dex = 15
		Char.def = 25
		Char.spd = 15
		Char.spatk = 50
		Char.spdef = 100
		break;
		default:
		charImage.src = "resources/images/placeholder.png";
		Char.class = 7
		Char.maxhp = 100
		Char.hp = 100
		Char.maxmp = 50
		Char.mp = 50
		Char.str = 10
		Char.dex = 10
		Char.def = 15
		Char.spd = 10
		Char.spatk = 10
		Char.spdef = 15
		break;
	  }
	}
}

// Checks current key and does action depending on key in field
function updateField() {
	if (Char.level >= (5+bossDefeated*5) && !bossCheck) { //player fights a boss every five levels
			Char.size = 200
			bossCheck = true;
			music.pause();
			music.currentTime = 0;
		switch (bossDefeated) {
			case 0:
				monImage.src = "resources/images/enemies/boss1.png";
				monster.type = 100;
				monster.maxhp = 500;
				monster.maxmp = 50;
				monster.str = 22;
				monster.dex = 13;
				monster.def = 25;
				monster.spd = 9;
				monster.spatk = 23;
				monster.spdef = 15;
				monster.exp = 300;
				monster.int = 50;

				music.setAttribute("src", "resources/audio/music/Firstboss.mp3");
				music.volume = 0.6;
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossOne.jpg)";
			break;
			case 1:
				monImage.src = "resources/images/enemies/boss2.png";
				monster.type = 200;
				monster.maxhp = 400;
				monster.maxmp = 20;
				monster.str = 32;
				monster.dex = 25;
				monster.def = 45;
				monster.spd = 12;
				monster.spatk = 33;
				monster.spdef = 35;
				monster.exp = 850;
				monster.int = 25;

				music.setAttribute("src", "resources/audio/music/Secondboss.mp3");
				music.volume = 1;
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossTwo.jpg)";
			break;
			case 2:
				monImage.src = "resources/images/enemies/boss3.png";
				monster.type = 300;
				monster.maxhp = 1000;
				monster.maxmp = 250;
				monster.str = 10;
				monster.dex = 45;
				monster.def = 25;
				monster.spd = 16;
				monster.spatk = 45;
				monster.spdef = 35;
				monster.exp = 1666;
				monster.int = 120;

				music.setAttribute("src", "resources/audio/music/Thirdboss.mp3");
				music.volume = 1;
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossThree.jpg)";
			break;
			case 3:
				monImage.src = "resources/images/enemies/bossFinal.png";
				monster.type = 400;
				monster.maxhp = 2500;
				monster.maxmp = 500;
				monster.str = 50;
				monster.dex = 70;
				monster.def = 40;
				monster.spd = 21;
				monster.spatk = 60;
				monster.spdef = 55;
				monster.exp = 9999;
				monster.int = 10;

				music.setAttribute("src", "resources/audio/music/Finalboss.mp3");
				music.volume = 0.6;
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossFinal.jpg)";
			break;
			default:
			break;
		};
		monster.hp = monster.maxhp;
		monster.mp = monster.maxmp;
		victoryCounter = monster.exp
		victoryNext = 0;
		cursor.position = 0;
		if (monster.type >= 300) {
			if (monster.type == 400) {
				setTimeout(function() {music.play();}, 2500);
			} else {
					setTimeout(function() {music.play();}, 6200);
				};
		} else {
		music.play();
		};
		gamemode = 2
	} else if (encounter == 50) { //Player encounters an enemy
		Char.size = 200
		monster.type = randomRange(1 + (bossDefeated*3),3 + (bossDefeated*3));
		switch (monster.type) {
			case 1:
			monImage.src = "resources/images/enemies/dog.png";
			monster.maxhp = 100;
			monster.maxmp = 5;
			monster.str = 12;
			monster.dex = 2;
			monster.def = 12;
			monster.spd = 13;
			monster.spatk = 4;
			monster.spdef = 2;
			monster.exp = 50;
			monster.int = 250;
			break;
			case 2:
			monImage.src = "resources/images/enemies/bandit.png";
			monster.maxhp = 110;
			monster.maxmp = 20;
			monster.str = 10;
			monster.dex = 12;
			monster.def = 11;
			monster.spd = 18;
			monster.spatk = 14;
			monster.spdef = 3;
			monster.exp = 130;
			monster.int = 55;
			break;
			case 3:
			monImage.src = "resources/images/enemies/slime.png";
			monster.maxhp = 60;
			monster.maxmp = 30;
			monster.str = 4;
			monster.dex = 2;
			monster.def = 80;
			monster.spd = 18;
			monster.spatk = 15;
			monster.spdef = 6;
			monster.exp = 90;
			monster.int = 180;
			break;
			case 4:
			monImage.src = "resources/images/enemies/ghost.png";
			monster.maxhp = 80;
			monster.maxmp = 60;
			monster.str = 6;
			monster.dex = 5;
			monster.def = 100;
			monster.spd = 16;
			monster.spatk = 15;
			monster.spdef = 5;
			monster.exp = 150;
			monster.int = 70;
			break;
			case 5:
			monImage.src = "resources/images/enemies/puma.png";
			monster.maxhp = 70;
			monster.maxmp = 40;
			monster.str = 12;
			monster.dex = 15;
			monster.def = 10;
			monster.spd = 21;
			monster.spatk = 18;
			monster.spdef = 15;
			monster.exp = 130;
			monster.int = 70;
			break;
			case 6:
			monImage.src = "resources/images/enemies/chicken.png";
			monster.maxhp = 200;
			monster.maxmp = 60;
			monster.str = 20;
			monster.dex = 7;
			monster.def = 22;
			monster.spd = 14;
			monster.spatk = 20;
			monster.spdef = 10;
			monster.exp = 175;
			monster.int = 175;
			break;
			case 7:
			monImage.src = "resources/images/enemies/monk.png";
			monster.maxhp = 250;
			monster.maxmp = 90;
			monster.str = 22;
			monster.dex = 37;
			monster.def = 25;
			monster.spd = 25;
			monster.spatk = 30;
			monster.spdef = 20;
			monster.exp = 300;
			monster.int = 55;
			break;
			case 8:
			monImage.src = "resources/images/enemies/horseknight.png";
			monster.maxhp = 450;
			monster.maxmp = 20;
			monster.str = 40;
			monster.dex = 15;
			monster.def = 35;
			monster.spd = 15;
			monster.spatk = 10;
			monster.spdef = 20;
			monster.exp = 350;
			monster.int = 100;
			break;
			case 9:
			monImage.src = "resources/images/enemies/lizard.png";
			monster.maxhp = 350;
			monster.maxmp = 20;
			monster.str = 10;
			monster.dex = 35;
			monster.def = 25;
			monster.spd = 35;
			monster.spatk = 20;
			monster.spdef = 20;
			monster.exp = 275;
			monster.int = 100;
			break;
			case 10:
			monImage.src = "resources/images/enemies/owl.png";
			monster.maxhp = 400;
			monster.maxmp = 40;
			monster.str = 15;
			monster.dex = 45;
			monster.def = 25;
			monster.spd = 30;
			monster.spatk = 40;
			monster.spdef = 20;
			monster.exp = 575;
			monster.int = 80;
			break;
			case 11:
			monImage.src = "resources/images/enemies/gangster.png";
			monster.maxhp = 550;
			monster.maxmp = 50;
			monster.str = 30;
			monster.dex = 55;
			monster.def = 15;
			monster.spd = 20;
			monster.spatk = 40;
			monster.spdef = 10;
			monster.exp = 600;
			monster.int = 100;
			break;
			case 12:
			monImage.src = "resources/images/enemies/angelknight.png";
			monster.maxhp = 900;
			monster.maxmp = 100;
			monster.str = 30;
			monster.dex = 30;
			monster.def = 30;
			monster.spd = 10;
			monster.spatk = 30;
			monster.spdef = 30;
			monster.exp = 725;
			monster.int = 25;
			break;
			default:
			monImage.src = "resources/images/placeholder.png";
			monster.maxhp = 100;
			monster.maxmp = 50;
			monster.str = 10;
			monster.dex = 10;
			monster.def = 15;
			monster.spd = 10;
			monster.spatk = 10;
			monster.spdef = 15;
			monster.exp = 500;
			monster.int = 100;
			break;
		}; // end of switch monster type
		monster.hp = monster.maxhp;
		monster.mp = monster.maxmp;
		victoryCounter = monster.exp
		victoryNext = 0;
		cursor.position = 0;
		music.pause();
		switch(bossDefeated) {
			case 0:
				music.volume = 0.4;
				music.setAttribute("src", "resources/audio/music/Battle.mp3");
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battle.jpg)";
			break;
			case 1:
				music.volume = 1;
				music.setAttribute("src", "resources/audio/music/battleTwo.mp3");
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleTwo.jpg)";
			break;
			case 2:
				music.volume = 1;
				music.setAttribute("src", "resources/audio/music/battleThree.mp3");
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleThree.jpg)";
			break;
			case 3:
				music.volume = 1;
				music.setAttribute("src", "resources/audio/music/battleFinal.mp3");
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleFinal.jpg)";
			break;
		};
		music.currentTime = 0;
		music.play();
		gamemode = 2
	};
	if (87 in keysDown && Char.y-Char.size/1000 > 0) { // Player holding w
		Char.y -= Char.speed;
		encounter = Math.random() * 100;
		encounter = Math.ceil(encounter);
	}
	if (83 in keysDown && Char.y+Char.size < canvas.height) { // Player holding s
		Char.y += Char.speed;
		encounter = Math.random() * 100;
		encounter = Math.ceil(encounter);
	}
	if (65 in keysDown && Char.x-Char.size/1000 > 0) { // Player holding a
		Char.x -= Char.speed;
		encounter = Math.random() * 100;
		encounter = Math.ceil(encounter);
	}
	if (68 in keysDown && Char.x+Char.size < canvas.width) { // Player holding d
		Char.x += Char.speed;
		encounter = Math.random() * 100;
		encounter = Math.ceil(encounter);
	}
	if (27 in keysDown && sticky == false) { // Player presses escape
		music.volume = (music.volume/2);
		document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/pause.jpg)";
		pauseCheck = gamemode;
		gamemode = 3;
		sticky = true;
	}
	if (80 in keysDown && sticky == false) { // Player presses p
		music.volume = (music.volume/2);
		document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/pause.jpg)";
		pauseCheck = gamemode;
		gamemode = 3;
		sticky = true;
	};
};
//checks key inputs and updates the battle, checks if you have lost or won
function updateBattle() {
	if (27 in keysDown && sticky == false) { // Player presses escape
		music.volume = (music.volume/2);
		document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/pause.jpg)";
		pauseCheck = gamemode;
		gamemode = 3;
		sticky = true;
	}
	if (80 in keysDown && sticky == false) { // Player presses p
		music.volume = (music.volume/2);
		document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/pause.jpg)";
		pauseCheck = gamemode;
		gamemode = 3;
		sticky = true;
	}

	if (monster.hp < 1) {
		if (defending) {
			Char.def = Char.def/5;
			Char.spdef = Char.spdef/5;
			defending = false;
		};
		if (monster.type >= 100) {
			bossDefeated++;
		};
		if (bossDefeated != 4) {
		monster.stamina = 0;
		monster.hp = 0;
		Char.stamina = 0;
		encounter = 0;
		music.pause();
		music.setAttribute("src", "resources/audio/music/Victory.mp3");
		music.currentTime = 0;
		music.volume = 1;
		music.play();
		document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/victory.jpg)";
		gamemode = 4;
		} else {
			music.pause();
			music.setAttribute("src", "resources/audio/music/gameComplete.mp3");
			music.currentTime = 0;
			music.volume = 1;
			music.play();
			document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/finalVictory.png)";
			gamemode = 7;
		}
	};

	if (Char.hp < 1) {
		Char.stamina = 0;
		Char.hp = 0;
		music.pause();
		music.setAttribute("src", "resources/audio/music/Gameover.mp3");
		music.currentTime = 0;
		music.volume = 1;
		music.play();
		document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/gameover.jpg)";
		gamemode = 5;
	};

	if (Char.stamina < 200) {
	Char.stamina = Char.stamina + Char.spd/17;
	sticky2 = true;
	battleMenu = 0;
	} else if (sticky2) {
		sticky2 = false;
		switch (Char.class) { //plays a sound when your character's stamina is full.
			case 1:
				ready.setAttribute("src", "resources/audio/sound/knightReady.wav")
				ready.volume = 0.4;
			break;
			case 2:
				ready.setAttribute("src", "resources/audio/sound/archerReady.wav")
				ready.volume = 1;
			break;
			case 3:
				ready.setAttribute("src", "resources/audio/sound/wizardReady.wav")
				ready.volume = 1;
			break;
			case 4:
				ready.setAttribute("src", "resources/audio/sound/pirateReady.wav")
				ready.volume = 1;
			break;
			case 5:
				ready.setAttribute("src", "resources/audio/sound/touristReady.wav")
				ready.volume = 1;
			break;
			case 6:
				ready.setAttribute("src", "resources/audio/sound/santaReady.wav")
				ready.volume = 0.5;
			break;
			default:
			break;
		};
		ready.currentTime = 0;
		ready.play();
		if (defending) {
			Char.def = Char.def/5;
			Char.spdef = Char.spdef/5;
			defending = false;
	  };
	} else { if ((87 in keysDown && cursor.posY > 0) && sticky == false) { // Player holding w
		cursor.posY -= 1;
		sticky = true;
	}
	//key inputs
	if ((83 in keysDown && cursor.posY < 1) && sticky == false) { // Player holding s
		cursor.posY += 1;
		sticky = true;
	}
	if ((65 in keysDown && cursor.posX > 0) && sticky == false) { // Player holding a
		cursor.posX -= 1;
		sticky = true;
	}
	if ((68 in keysDown && cursor.posX < 2) && sticky == false) { // Player holding d
		cursor.posX += 1;
		sticky = true;
	}
	if (13 in keysDown && sticky == false) { //player presses enter to select an option
			if (cursor.posY == 0) {
				switch(cursor.posX) {
					case 0:
					sticky = true;
						switch(Char.class) { //checks which class you are before attacking
							case 1: //knight attack is purely strength
							Char.stamina = 0;
							playerAction.setAttribute("src", "resources/audio/sound/knightAttack.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 0.5;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-(Char.str/(monster.def/10))) {
								monster.hp = monster.hp-(Char.str/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 100);
							break;
							case 2: //archer attack is purely dexterity
							Char.stamina = 0;
							playerAction.setAttribute("src", "resources/audio/sound/archerAttack.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-(Char.dex/(monster.def/10))) {
								monster.hp = monster.hp-(Char.str/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 100);
							break;
							case 3: //wizard attack is purely strength (only a last resort, meditate instead!)
							Char.stamina = 0;
							playerAction.setAttribute("src", "resources/audio/sound/wizardAttack.ogg");
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-(Char.str/(monster.def/10))) {
								monster.hp = monster.hp-(Char.str/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 100);
							break;
							case 4: //Pirate attack is purely dexterity with slight defense pierce
							Char.stamina = 0;
							playerAction.setAttribute("src", "resources/audio/sound/pirateAttack.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 0.6;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-(Char.dex/(monster.def/20))) {
								monster.hp = monster.hp-(Char.str/(monster.def/20));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 100);
							break;
							case 5: //tourist attack is strength and dex
							Char.stamina = 0;
							playerAction.setAttribute("src", "resources/audio/sound/touristAttack.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 0.5;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-(((Char.str+Char.dex)/2)/(monster.def/10))) {
									monster.hp > monster.hp-(((Char.str+Char.dex)/2)/(monster.def/10))
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 100);
							break;
							case 6: //santa's attack is pure special attack
							Char.stamina = 0;
							playerAction.setAttribute("src", "resources/audio/sound/santaAttack.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-(Char.spatk/(monster.def/10))) {
								monster.hp = monster.hp-(Char.spatk/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 100);
							break;
						};
					break;
					case 1:
					sticky = true;
					Char.stamina = 0;
						switch (Char.class) {
							case 1: //knight's skill halves monster's physical defense.
							playerAction.setAttribute("src", "resources/audio/sound/knightSkill.mp3");
							playerAction.currentTime = 0;
							playerAction.volume = 0.5;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-((Char.str/1.5)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.str/1.5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 100)
							if (Char.mp > 0) {
								Char.mp = Char.mp - 2;
								monster.def = monster.def/2;
								if (Char.mp < 0) {
									Char.mp = 0;
								};
							};
							break;
							case 2: //Archers skill reduces monster speed slightly and ignores defense
							playerAction.setAttribute("src", "resources/audio/sound/archerSkill.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-(Char.dex/2)) {
									monster.hp = monster.hp-(Char.dex/2);
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 1600)
							if (Char.mp > 0) {
								Char.mp = Char.mp - 3;
								monster.spd = monster.spd/1.2;
								if (Char.mp < 0) {
									Char.mp = 0;
								};
							};
							break;
							case 3: //Wizards skill has two hits; one weak with pure dex, another strong with pure special attack, dmg spdef
							playerAction.setAttribute("src", "resources/audio/sound/wizardSkill.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-(Char.dex/1.5)) {
									monster.hp = monster.hp-(Char.dex/1.5); };
							} , 50)
							if (Char.mp > 0) {
								Char.mp = Char.mp - 20;
								setTimeout (function() { if (monster.hp > monster.hp-(Char.spatk*2)) {
										monster.hp = monster.hp-(Char.spatk*2); };
								} , 800)
								monster.spdef = monster.spdef/1.2;
								if (Char.mp < 0) {
									Char.mp = 0;
								};
							} else {
								setTimeout (function() {playerAction.volume = 0;} , 200)
							};
							break;
							case 4: //Pirates's skill is multiple small dex damage attacks followed by a strong dex/spatk that ignores defense
							playerAction.setAttribute("src", "resources/audio/sound/pirateSkill.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-((Char.dex/7)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.dex/5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 10);
							setTimeout (function() { if (monster.hp > monster.hp-((Char.dex/7)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.dex/5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 500);
							setTimeout (function() { if (monster.hp > monster.hp-((Char.dex/7)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.dex/5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 800);
							setTimeout (function() { if (monster.hp > monster.hp-((Char.dex/7)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.dex/5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 1200);
							setTimeout (function() { if (monster.hp > monster.hp-((Char.dex/7)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.dex/5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 1500);
							setTimeout (function() { if (monster.hp > monster.hp-((Char.dex/7)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.dex/5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 1700);
							setTimeout (function() { if (monster.hp > monster.hp-((Char.dex/7)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.dex/5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} ,1900);
							setTimeout (function() { if (monster.hp > monster.hp-((Char.dex/7)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.dex/5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 2100);
							if (Char.mp > 0) {
								Char.mp = Char.mp - 1;
								setTimeout (function() { if (monster.hp > monster.hp-(Char.dex)) {
										monster.hp = monster.hp-(Char.dex);
																				} else {
																					playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																					playerAction.currentTime = 0;
																					playerAction.volume = 1;
																					playerAction.play();
																				};
								} , 2400);
								if (Char.mp < 0) {
									Char.mp = 0;
								};
							};
							break;
							case 5: //Tourist's skill deals spatk damage, resets their stamina and heals the player by their level
							playerAction.setAttribute("src", "resources/audio/sound/touristSkill.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 0.6;
							playerAction.play();
							setTimeout (function() { if (monster.hp > monster.hp-((Char.spatk/1.5)/(monster.def/10))) {
									monster.hp = monster.hp-((Char.spatk/1.5)/(monster.def/10));
																			} else {
																				playerAction.setAttribute("src", "resources/audio/sound/block.wav");
																				playerAction.currentTime = 0;
																				playerAction.volume = 1;
																				playerAction.play();
																			};
							} , 100)
							if (Char.mp > 0) {
								Char.mp = Char.mp - 5;
								monster.stamina = 0;
								Char.hp = Char.hp + (50 + Char.level*5);
								if (Char.hp > Char.maxhp) {
									Char.hp = Char.maxhp;
								};
								if (Char.mp < 0) {
									Char.mp = 0;
								};
							};
							break;
							case 6: //Santa's skill recovers his hp by a significant amount in three bursts
							playerAction.setAttribute("src", "resources/audio/sound/santaSkill.wav");
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
							if (Char.mp > 0) {
								Char.mp = Char.mp - 50;
								Char.hp = Char.hp + Char.maxhp/10;
								setTimeout (function() {Char.hp = Char.hp + Char.maxhp/15}, 300);
								setTimeout (function() {Char.hp = Char.hp + Char.maxhp/20}, 600);
								if (Char.mp < 0) {
									Char.mp = 0;
								};
							};
							break;
							default:
							break;
						}
					break;
					case 2:
							sticky = true;
							Char.stamina = 0;
							if (Char.maxhp > (Char.hp = Char.hp + Char.maxhp/10)) {
								Char.hp = Char.hp + Char.maxhp/10;
							} else {
								Char.hp = Char.maxhp;
							};
							if (Char.maxmp > (Char.mp = Char.mp + Char.maxmp/5)) {
								Char.mp = Char.mp + Char.maxmp/5;
							} else {
								Char.mp = Char.maxmp;
							};
							playerAction.setAttribute("src", "resources/audio/sound/meditate.wav")
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
					break;
					default: sticky = true; break;
				};
			}
			else {
				switch(cursor.posX) {
					case 0:
						sticky = true;
						switch (Char.class) {
							case 3:
								if (Char.mp > 10) {
								Char.stamina = 0;
								Char.mp = Char.mp - 10;
									if (monster.hp > monster.hp-(Char.spatk-(monster.spdef/10))) {
										monster.hp = monster.hp-(Char.spatk-(monster.spdef/10))
										playerAction.setAttribute("src", "resources/audio/sound/magic.wav")
										playerAction.currentTime = 0;
										playerAction.volume = 1;
										playerAction.play();
									} else
										playerAction.setAttribute("src", "resources/audio/sound/block.wav")
										playerAction.currentTime = 0;
										playerAction.volume = 1;
										playerAction.play();
								} else {
									playerAction.setAttribute("src", "resources/audio/sound/noMagic.wav")
									playerAction.currentTime = 0;
									playerAction.volume = 1;
									playerAction.play();
								}
							break;
							case 5:
								if (Char.mp > 5) {
								Char.stamina = 0;
								Char.mp = Char.mp - 5;
									if (monster.hp > monster.hp-((Char.spatk*2)-(monster.spdef/10))) {
										monster.hp = monster.hp-((Char.spatk*2)-(monster.spdef/10))
										playerAction.setAttribute("src", "resources/audio/sound/magic.wav")
										playerAction.currentTime = 0;
										playerAction.volume = 1;
										playerAction.play();
									} else
										playerAction.setAttribute("src", "resources/audio/sound/block.wav")
										playerAction.currentTime = 0;
										playerAction.volume = 1;
										playerAction.play();
								} else {
									playerAction.setAttribute("src", "resources/audio/sound/noMagic.wav")
									playerAction.currentTime = 0;
									playerAction.volume = 1;
									playerAction.play();
								}
							break;
							case 6:
								if (Char.mp > 25) {
								Char.stamina = 0;
								Char.mp = Char.mp - 25;
									if (monster.hp > monster.hp-((Char.spatk*1.5)-(monster.spdef/10))) {
										monster.hp = monster.hp-((Char.spatk*1.5)-(monster.spdef/10))
										playerAction.setAttribute("src", "resources/audio/sound/magic.wav")
										playerAction.currentTime = 0;
										playerAction.volume = 1;
										playerAction.play();
									} else
										playerAction.setAttribute("src", "resources/audio/sound/block.wav")
										playerAction.currentTime = 0;
										playerAction.volume = 1;
										playerAction.play();
								} else {
									playerAction.setAttribute("src", "resources/audio/sound/noMagic.wav")
									playerAction.currentTime = 0;
									playerAction.volume = 1;
									playerAction.play();
								}
							break;
							default:
							playerAction.setAttribute("src", "resources/audio/sound/noMagic.wav")
							playerAction.currentTime = 0;
							playerAction.volume = 1;
							playerAction.play();
							break;
						};
					break;
					case 1:
					  sticky = true;
						Char.stamina = 0;
						defending = true;
						Char.def = Char.def*5;
						Char.spdef = Char.spdef*5;
					break;
					case 2: sticky = true;
					Char.stamina = 0;
					var escapeChance = randomRange(1,((100-Char.spd)+monster.spd));
					if (escapeChance <= 50) {
						gamemode = 1
						music.pause();
						music.currentTime = 0;
						switch (bossDefeated) {
							case 0:
								document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/field.png";
								music.setAttribute("src", "resources/audio/music/Field.mp3");
								music.volume = 1;
							break;
							case 1:
								document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldTwo.jpg";
								music.setAttribute("src", "resources/audio/music/fieldTwo.mp3");
								music.volume = 1;
							break;
							case 2:
								document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldThree.png";
								music.setAttribute("src", "resources/audio/music/fieldThree.mp3");
								music.volume = 1;
							break;
							case 3:
								document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldFinal.jpg";
								music.setAttribute("src", "resources/audio/music/fieldFinal.mp3");
								music.volume = 1;
							break;
						};
						music.play();
						Char.size = 100;
					} else {
						playerAction.setAttribute("src", "resources/audio/sound/runFail.wav");
						playerAction.currentTime = 0;
						playerAction.volume = 1;
						playerAction.play();
					};
					break;
					default: sticky = true; break;
				};
			};
		};
}; // end of else
	if (monster.stamina < 200) {
	monster.stamina = monster.stamina + monster.spd/25;
	}
	else {
  monAI = Math.random() * monster.int;
	monAI = Math.ceil(monAI);
	if (monAI == 2 && stickyMonsterAttack == false) {
		stickyMonsterAttack = true;
		monster.stamina = 0;
		switch (monster.type) {
			case 1:
				if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
					Char.hp = Char.hp-(monster.str-(Char.def/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			break;
			case 2:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 5;
				if (Char.hp > Char.hp-(monster.dex-((Char.spdef+Char.def)/10))) {
				Char.hp = Char.hp-(monster.dex-((Char.spdef+Char.def)/10));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
				Char.hp = Char.hp-(monster.str-(Char.def/5));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 3:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 5;
				if (Char.hp > Char.hp-(monster.spatk-(Char.spdef/5))) {
				Char.hp = Char.hp-(monster.spatk-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
				Char.hp = Char.hp-(monster.str-(Char.def/5));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 4:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 5;
				if (Char.hp > Char.hp-(monster.spatk-(Char.spdef/5))) {
				Char.hp = Char.hp-(monster.spatk-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
				Char.hp = Char.hp-(monster.str-(Char.def/5));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 5:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 10;
				if (Char.hp > Char.hp-(monster.spatk-(Char.spdef/5))) {
				Char.hp = Char.hp-(monster.spatk-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.dex-(Char.def/5))) {
				Char.hp = Char.hp-(monster.dex-(Char.def/5));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 6:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 5;
				if (Char.hp > Char.hp-((monster.spatk+monster.str)/2-(Char.spdef/5))) {
				Char.hp = Char.hp-((monster.spatk+monster.str)/2-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.str*1.5-(Char.def/5))) {
				Char.hp = Char.hp-(monster.str*1.5-(Char.def/5));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 7:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 10;
				if (Char.hp > Char.hp-(monster.spatk*2-(Char.spdef/5))) {
				Char.hp = Char.hp-(monster.spatk*2-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-((monster.str+monster.dex)/2-(Char.def/5))) {
				Char.hp = Char.hp-((monster.str+monster.dex)/2-(Char.def/5));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 8:
			if (monster.mp > 0) {
				monster.mp = 0;
				if (Char.hp > Char.hp-((monster.str*monster.spatk)/3-(Char.spdef/5))) {
				Char.hp = Char.hp-((monster.str*monster.spatk)/3-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
				Char.hp = Char.hp-(monster.str-(Char.def/5));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 9:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 5;
				if (Char.hp > Char.hp-(monster.dex*1.5-(Char.spdef/5))) {
				Char.hp = Char.hp-(monster.dex*1.5-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.dex-(Char.def/5))) {
				Char.hp = Char.hp-(monster.dex-(Char.def/5));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 10:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 5;
				if (Char.hp > Char.hp-((monster.spatk+monster.dex)/2-(Char.spdef/5))) {
				Char.hp = Char.hp-((monster.spatk+monster.dex)/2-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.dex*1.5-(Char.def/5))) {
				Char.hp = Char.hp-(monster.dex*1.5-(Char.def/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 11:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 20;
				if (Char.hp > Char.hp-((monster.spatk+monster.dex)/2-(Char.def/5))) {
				Char.hp = Char.hp-((monster.spatk+monster.dex)/2-(Char.def/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-(monster.str*1.5-(Char.def/5))) {
				Char.hp = Char.hp-(monster.str*1.5-(Char.def/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			case 12:
			if (monster.mp > 0) {
				monster.mp = monster.mp - 15;
				if (Char.hp > Char.hp-((monster.spatk+monster.str)/1.5-(Char.spdef/5))) {
				Char.hp = Char.hp-((monster.spatk+monster.str)/1.5-(Char.spdef/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			} else {
				if (Char.hp > Char.hp-((monster.dexk+monster.str)/2-(Char.def/5))) {
				Char.hp = Char.hp-((monster.dexk+monster.str)/2-(Char.def/5));
				} else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			};
			break;
			//BOSS ATTACKS BOSS ATTACKS BOSS ATTACKS BOSS ATTACKS BOSS ATTACKS BOSS ATTACKS BOSS ATTACKS
			case 100: //Judge's skill reduces your stamina, his base attack hits twice for decent damage.
				monAI = Math.round(randomRange(15, 5));
				if (monAI < 8) {
					if (monster.mp > 0) {
						monster.mp = monster.mp - 5;
						enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossOneSkill.wav");
						enemyAction.currentTime = 0;
						enemyAction.volume = 1;
						enemyAction.play();
						if (Char.hp > Char.hp-((monster.spatk*2)-(Char.spdef/5))) {
							Char.hp = Char.hp-((monster.spatk*2)-(Char.spdef/5));
							Char.stamina = Char.stamina-75;
						if (Char.stamina < 0) {
							Char.stamina = 0;
						};
						} else {
					 			enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 			enemyAction.currentTime = 0;
					 			enemyAction.volume = 1;
					 			enemyAction.play();
						};
					} else {
							if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
								enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossOneAttack.wav");
								enemyAction.currentTime = 0;
								enemyAction.volume = 1;
								enemyAction.play();
								Char.hp = Char.hp-(monster.str-(Char.def/5));
								setTimeout(function() {Char.hp = Char.hp-(monster.str/2-(Char.def/5));}, 800);
							} else {
					 				enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 				enemyAction.currentTime = 0;
					 				enemyAction.volume = 1;
					 				enemyAction.play();
								};
						};
				} else {
						if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
							enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossOneAttack.wav");
							enemyAction.currentTime = 0;
							enemyAction.volume = 1;
							enemyAction.play();
							Char.hp = Char.hp-(monster.str-(Char.def/5));
							setTimeout(function() {Char.hp = Char.hp-(monster.str-(Char.def/5));}, 800);
						} else {
				 				enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
				 				enemyAction.currentTime = 0;
				 				enemyAction.volume = 1;
				 				enemyAction.play();
							};
					};
			break;
			case 200: //robots attacks, skill is really powerful, attack is three strong strength based attacks
			monAI = Math.round(randomRange(15, 5));
				if (monAI < 8) {
						if (monster.mp > 0) {
							monster.mp = monster.mp - 10;
							enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossTwoSkill.wav");
							enemyAction.currentTime = 0;
							enemyAction.volume = 1;
							enemyAction.play();
							if (Char.hp > Char.hp-((monster.spatk*2.5)-(Char.spdef/5))) {
								Char.hp = Char.hp-((monster.spatk*2.5)-(Char.spdef/5));
									if (Char.stamina < 0) {
										Char.stamina = 0;
									};
							} else {
					 				enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 				enemyAction.currentTime = 0;
					 				enemyAction.volume = 1;
					 				enemyAction.play();
								};
						} else {
								if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
									enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossTwoAttack.wav");
									enemyAction.currentTime = 0;
									enemyAction.volume = 1;
									enemyAction.play();
									Char.hp = Char.hp-(monster.str/1.5-(Char.def/5));
									setTimeout(function() {Char.hp = Char.hp-(monster.str/1.5-(Char.def/5));}, 220);
									setTimeout(function() {Char.hp = Char.hp-(monster.str/2-(Char.def/5));}, 500);
								} else {
					 					enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 					enemyAction.currentTime = 0;
					 					enemyAction.volume = 1;
					 					enemyAction.play();
									};
							};
				} else {
				if (Char.hp > Char.hp-(monster.str-(Char.def/5))) {
					enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossTwoAttack.wav");
					enemyAction.currentTime = 0;
					enemyAction.volume = 1;
					enemyAction.play();
					Char.hp = Char.hp-(monster.str/1.5-(Char.def/5));
					setTimeout(function() {Char.hp = Char.hp-(monster.str/1.5-(Char.def/5));}, 150);
					setTimeout(function() {Char.hp = Char.hp-(monster.str/2-(Char.def/5));}, 500);
				} else {
				 		enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
				 		enemyAction.currentTime = 0;
				 		enemyAction.volume = 1;
				 		enemyAction.play();
					};
					};
			break;
			case 300: //Edgelord's skill and attack are both simply really powerful dexterity/ special attack based attacks.
				monAI = Math.round(randomRange(15, 5));
				if (monAI < 8) {
					if (monster.mp > 0) {
						monster.mp = monster.mp - 25;
						enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossThreeSkill.wav");
						enemyAction.currentTime = 0;
						enemyAction.volume = 1;
						enemyAction.play();
						if (Char.hp > Char.hp-((monster.spatk*3)-(Char.spdef/5))) {
							setTimeout(function() {Char.hp = Char.hp-((monster.spatk*3)-(Char.spdef/5));}, 3000);
						} else {
					 			enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 			enemyAction.currentTime = 0;
					 			enemyAction.volume = 1;
					 			enemyAction.play();
							};
						} else {
								if (Char.hp > Char.hp-((monster.dex*2)-(Char.def/5))) {
									enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossThreeAttack.ogg");
									enemyAction.currentTime = 0;
									enemyAction.volume = 1;
									enemyAction.play();
									Char.hp = Char.hp-((monster.dex*2)-(Char.def/5));
								} else {
							 			enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
							 			enemyAction.currentTime = 0;
							 			enemyAction.volume = 1;
							 			enemyAction.play();
									};
							};
						}  else {
								if (Char.hp > Char.hp-((monster.dex*2)-(Char.def/5))) {
									enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossThreeAttack.ogg");
									enemyAction.currentTime = 0;
									enemyAction.volume = 1;
									enemyAction.play();
									Char.hp = Char.hp-((monster.dex*2)-(Char.def/5));
								} else {
							 			enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
							 			enemyAction.currentTime = 0;
							 			enemyAction.volume = 1;
							 			enemyAction.play();
									};
								};

			break;
			case 400: //Shutter Angel's skill deals spatk damage and heals, his base attack is a combination of all stats; packs a punch.
				monAI = Math.round(randomRange(15, 5));
				if (monAI < 8) {
					if (monster.mp > 0) {
						monster.mp = monster.mp - 15;
						enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossFinalSkill.wav");
						enemyAction.currentTime = 0;
						enemyAction.volume = 1;
						enemyAction.play();
						if (Char.hp > Char.hp-((monster.spatk*2)-(Char.spdef/5))) {
							Char.hp = Char.hp-((monster.spatk*2)-(Char.spdef/5));
							enemyVampire = Char.hp-((monster.spatk*2)-(Char.spdef/5));
							setTimeout(function() {monster.hp = monster.hp + enemyVampire;}, 600);
						} else {
					 			enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 			enemyAction.currentTime = 0;
					 			enemyAction.volume = 1;
					 			enemyAction.play();
						};
					} else {
							if (Char.hp > Char.hp-((monster.str+monster.dex+monster.spatk)/3-((Char.def+Char.spdef)/20))) {
								enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossFinalAttack.wav");
								enemyAction.currentTime = 0;
								enemyAction.volume = 1;
								enemyAction.play();
								Char.hp = Char.hp-(((monster.str+monster.dex+monster.spatk)/3)-((Char.def+Char.spdef)/20));
							} else {
					 				enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 				enemyAction.currentTime = 0;
					 				enemyAction.volume = 1;
					 				enemyAction.play();
								};
						};
				} else {
						if (Char.hp > Char.hp-(((monster.str+monster.dex+monster.spatk)/3)-((Char.def+Char.spdef)/20))) {
							enemyAction.setAttribute("src", "resources/audio/sound/enemy sounds/bossFinalAttack.wav");
							enemyAction.currentTime = 0;
							enemyAction.volume = 1;
							enemyAction.play();
							Char.hp = Char.hp-(((monster.str+monster.dex+monster.spatk)/3)-((Char.def+Char.spdef)/20));
						} else {
				 				enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
				 				enemyAction.currentTime = 0;
				 				enemyAction.volume = 1;
				 				enemyAction.play();
							};
					};
			break;
			default:
				if (Char.hp > Char.hp-(((monster.str+monster.dex+monster.spatk)/3)-((Char.def+Char.spdef)/20))) {
				Char.hp = Char.hp - (((monster.str+monster.dex+monster.spatk)/3)-((Char.def+Char.spdef)/20));
			  } else {
					 enemyAction.setAttribute("src", "resources/audio/sound/block.wav");
					 enemyAction.currentTime = 0;
					 enemyAction.volume = 1;
					 enemyAction.play();
				};
			break;
		};
	} else if (stickyMonsterAttack == true) {
		setTimeout( function() {stickyMonsterAttack = false;} , 100);
	  };
  }
};
//draws objects in battlefield
function drawBattle() {
	//draws images
	ctx.beginPath();
	ctx.drawImage(charImage, 120, 90, Char.size/2, Char.size);
	ctx.drawImage(monImage, 700, 90, 150, 200);
	ctx.closePath();

	//with sufficient stamina, draws menu
	if (Char.stamina > 199) {
	    //menu background
	ctx.beginPath();
	ctx.rect(77,340, 800, 150);
	ctx.fillStyle = "black"
	ctx.fill();
	ctx.closePath();
	    //menu options
	switch (battleMenu) { //checks which menu to draw
		case 0: //initial menu when stamina is full
			ctx.beginPath();
			ctx.font = "30px Verdana";
			ctx.fillStyle = "white";
			ctx.fillText("A T T A C K", 150, 390);
			ctx.fillText("M A G I C", 150, 440);
			ctx.fillText("S K I L L", 400, 390);
			ctx.fillText("D E F E N D", 400, 440);
			ctx.fillText("M E D I T A T E", 640, 390);
			ctx.fillText("R U N", 650, 440);
			ctx.fill();
			ctx.closePath();
	    		//menu pointer
			ctx.beginPath();
			ctx.drawImage(battleArrow, 90+(cursor.posX*250), 365+(cursor.posY*50), 50, 25);
			ctx.closePath();
		break;
		default: //a placeholder that appears when something goes wrong
			ctx.beginPath();
			ctx.font = "80px Times new roman";
			ctx.fillStyle = "white";
			ctx.fillText("Something went wrong", 110, 440);
			ctx.fill();
			ctx.closePath();
		break;
	}
}
if (!transCheck) {
	//draws stamina bar backgrounds
	ctx.beginPath();
	ctx.rect(47, 7, 26, 206);
if (debug) {
	ctx.rect(667, 297, 206, 26);
};
	ctx.fillStyle = "black"
	ctx.fill();
	ctx.closePath();
	//draws stamina bars
	ctx.beginPath();
	switch (true) {
		case (Char.stamina <= 50): 	ctx.fillStyle = "red"; break;
		case (Char.stamina <= 125): 	ctx.fillStyle = "yellow"; break;
		case (Char.stamina <= 199): 	ctx.fillStyle = "green"; break;
		case (Char.stamina >= 200):     ctx.fillStyle = "lime"; break;
		default: 	ctx.fillStyle = "green"; break;
	};
	ctx.rect(50, 10, 20, Char.stamina);
	ctx.fill();
	ctx.closePath();
if (debug) {
	ctx.beginPath();
	switch (true) {
		case (monster.stamina <= 75): 	ctx.fillStyle = "red"; break;
		case (monster.stamina <= 150): 	ctx.fillStyle = "yellow"; break;
		case (monster.stamina <= 199): 	ctx.fillStyle = "green"; break;
		case (monster.stamina >= 199): 	ctx.fillStyle = "lime"; break;
		default: 	ctx.fillStyle = "green"; break;
	};
	ctx.rect(670, 300, monster.stamina, 20);
	ctx.fill();
	ctx.closePath();
};

	//draws hp bar backgrounds
	ctx.beginPath();
	ctx.rect(77, 47, Char.maxhp*2+6, 26);
if (monster.type < 100) {
	ctx.rect(657, 47, monster.maxhp*2+6, 26);
};
	ctx.fillStyle = "black"
	ctx.fill();
	ctx.closePath();
	//draws hp bars
	ctx.beginPath();
	ctx.rect(80, 50, Char.hp*2, 20);
if (monster.type < 100) {
	ctx.rect(660, 50, monster.hp*2, 20);
};
	ctx.fillStyle = "red"
	ctx.fill();
	ctx.closePath();

  //bosses have special Hp bars which are drawn here
if (monster.type > 50) {
	ctx.beginPath();
	ctx.rect(7, 307, monster.maxhp*2+6, 26);
	ctx.fillStyle = "black"
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.rect(10, 310, monster.hp*2, 20);
	ctx.fillStyle = "red"
	ctx.fill();
	ctx.closePath();
};

	//draws mp bar backgrounds
	ctx.beginPath();
	ctx.rect(77, 12, Char.maxmp*2+6, 26);
if (debug) {
	ctx.rect(657, 12, monster.maxmp*2+6, 26);
};
	ctx.fillStyle = "black"
	ctx.fill();
	ctx.closePath();
	//draws mp bars
	ctx.beginPath();
	ctx.rect(80, 15, Char.mp*2, 20);
if (debug) {
	ctx.rect(660, 15, monster.mp*2, 20);
};
	ctx.fillStyle = "blue"
	ctx.fill();
	ctx.closePath();
};
	if (bossCheck) {
		transCount = 1;
		transCheck = true;
		bossCheck = false;
		enemyAction.pause();
		enemyAction.currentTime = 0;
				switch(bossDefeated) {
					case 0:
						enemyAction.setAttribute("src" , "resources/audio/sound/enemy sounds/bossOneEncounter.wav")
						enemyAction.volume = 1;
					break;
					case 1:
						enemyAction.setAttribute("src" , "resources/audio/sound/enemy sounds/bossTwoEncounter.wav")
						enemyAction.volume = 1;
					break;
					case 2:
						enemyAction.setAttribute("src" , "resources/audio/sound/enemy sounds/bossThreeEncounter.wav")
						enemyAction.volume = 1;
					break;
					case 3:
						enemyAction.setAttribute("src" , "resources/audio/sound/enemy sounds/bossFinalEncounter.wav")
						enemyAction.volume = 1;
					break;
				};
		enemyAction.play();
	};
}

//Draws cursor and menu options on main menu
function drawMenu() {
	ctx.beginPath();
	ctx.font = "100px impact";
    ctx.fillText("Stock RPG", canvas.width/2-200, canvas.height/4);
   	ctx.font = "25px arial";
    ctx.fillText("Knight", canvas.width/2, 200);
    ctx.fillText("Archer", canvas.width/2, 225);
    ctx.fillText("Wizard", canvas.width/2, 250);
    ctx.fillText("Pirate", canvas.width/2, 275);
    ctx.fillText("Tourist", canvas.width/2, 300);
	ctx.rect(canvas.width/2-30, 155+cursor.position*25, 20,20);
	ctx.fillStyle = "blue"
	ctx.fill();
	ctx.closePath();
}


//Draws character in field
function drawChar() {
	ctx.beginPath();
	ctx.drawImage(charImage, Char.x, Char.y, Char.size/2, Char.size);
	ctx.closePath();
}

//victory screen

//updates victory screen
function updateVictory() {
	if (Char.expNext > Char.exp) {

	  if (victoryCounter > 0 && victoryNext == 200) {
		victoryCounter = victoryCounter - (bossDefeated+1);
		Char.exp = Char.exp + (bossDefeated+1);
	  }

		else if (victoryCounter > 0) {
		victoryNext++
	  }

		else {
			if (victoryNext == 1000 || 13 in keysDown) {
					gamemode = 1
					music.pause();
					music.currentTime = 0;
					switch (bossDefeated) {
						case 0:
							document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/field.png";
							music.setAttribute("src", "resources/audio/music/Field.mp3");
							music.volume = 1;
						break;
						case 1:
							document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldTwo.jpg";
							music.setAttribute("src", "resources/audio/music/fieldTwo.mp3");
							music.volume = 1;
						break;
						case 2:
							document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldThree.png";
							music.setAttribute("src", "resources/audio/music/fieldThree.mp3");
							music.volume = 1;
						break;
						case 3:
							document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldFinal.jpg";
							music.setAttribute("src", "resources/audio/music/fieldFinal.mp3");
							music.volume = 1;
						break;
					};
					music.play();
					Char.size = 100;
	  	} else {victoryNext++};
    };
	} else { //this triggers when the player levels up
		//increases stats on level up
		switch (Char.class) { //checks which class the player is
				case 1: //Knight Class
					Char.maxhp = Char.maxhp + randomRange(10, 5);
					Char.hp = Char.maxhp;

					Char.maxmp = Char.maxmp + randomRange(3, 1);
					Char.mp = Char.maxmp;

					Char.str = Char.str + randomRange(4, 2);
					Char.dex = Char.dex + randomRange(2, 1);
					Char.def = Char.def + randomRange(3, 2);
					Char.spd = Char.spd + randomRange(1, 1);
					Char.spatk = Char.spatk + randomRange(1, 0);
					Char.spdef = Char.spdef + randomRange(2, 0);
					Char.expNext = Math.ceil(Char.expNext*1.115);
				break;
				case 2: //Archer Class
					Char.maxhp = Char.maxhp + randomRange(7, 3);
					Char.hp = Char.maxhp;

					Char.maxmp = Char.maxmp + randomRange(4, 2);
					Char.mp = Char.maxmp;

					Char.str = Char.str + randomRange(1, 0);
					Char.dex = Char.dex + randomRange(5, 2);
					Char.def = Char.def + randomRange(2, 0);
					Char.spd = Char.spd + randomRange(2, 0);
					Char.spatk = Char.spatk + randomRange(3, 2);
					Char.spdef = Char.spdef + randomRange(1, 0);
					Char.expNext = Math.ceil(Char.expNext*1.13);
				break;
				case 3: //Wizard Class
					Char.maxhp = Char.maxhp + randomRange(6, 3);
					Char.hp = Char.maxhp;

					Char.maxmp = Char.maxmp + randomRange(10, 5);
					Char.mp = Char.maxmp;

					Char.str = Char.str + randomRange(1, 0);
					Char.dex = Char.dex + randomRange(3, 1);
					Char.def = Char.def + randomRange(2, 0);
					Char.spd = Char.spd + randomRange(1, 1);
					Char.spatk = Char.spatk + randomRange(5, 3);
					Char.spdef = Char.spdef + randomRange(4, 3);
					Char.expNext = Math.ceil(Char.expNext*1.145);
				break;
				case 4: //Pirate Class
					Char.maxhp = Char.maxhp + randomRange(20, 10);
					Char.hp = Char.maxhp;

					Char.maxmp = Char.maxmp + randomRange(2, 1);
					Char.mp = Char.maxmp;

					Char.str = Char.str + randomRange(4, 2);
					Char.dex = Char.dex + randomRange(3, 2);
					Char.def = Char.def + randomRange(3, 1);
					Char.spd = Char.spd + randomRange(1, 1);
					Char.spatk = Char.spatk + randomRange(2, 1);
					Char.spdef = Char.spdef + randomRange(2, 0);
					Char.expNext = Math.ceil(Char.expNext*1.12);
				break;
				case 5: //Tourist Class
					Char.maxhp = Char.maxhp + randomRange(5, 2);
					Char.hp = Char.maxhp;

					Char.maxmp = Char.maxmp + randomRange(2, 0);
					Char.mp = Char.maxmp;

					Char.str = Char.str + randomRange(2, 0);
					Char.dex = Char.dex + randomRange(2, 0);
					Char.def = Char.def + randomRange(2, 0);
					Char.spd = Char.spd + randomRange(2, 0);
					Char.spatk = Char.spatk + randomRange(8, 5);
					Char.spdef = Char.spdef + randomRange(2, 0);
					Char.expNext = Math.ceil(Char.expNext*1.16);
				break;
				case 6: //Santa Class
					Char.maxhp = Char.maxhp + randomRange(30, 20);
					Char.hp = Char.maxhp;

					Char.maxmp = Char.maxmp + randomRange(30, 25);
					Char.mp = Char.maxmp;

					Char.str = Char.str + randomRange(12, 9);
					Char.dex = Char.dex + randomRange(8, 4);
					Char.def = Char.def + randomRange(10, 8);
					Char.spd = Char.spd + randomRange(2, 1);
					Char.spatk = Char.spatk + randomRange(15, 10);
					Char.spdef = Char.spdef + randomRange(25, 20);
					Char.expNext = Math.ceil(Char.expNext*1.15);
				break;
				default: //PLACEHOLDER Class
					Char.maxhp = Char.maxhp + randomRange(10, 5);
					Char.hp = Char.maxhp;

					Char.maxmp = Char.maxmp + randomRange(10, 5);
					Char.mp = Char.maxmp;

					Char.str = Char.str + randomRange(3, 2);
					Char.dex = Char.dex + randomRange(3, 2);
					Char.def = Char.def + randomRange(3, 2);
					Char.spd = Char.spd + randomRange(1, 1);
					Char.spatk = Char.spatk + randomRange(3, 2);
					Char.spdef = Char.spdef + randomRange(3, 2);
					Char.expNext = Math.ceil(Char.expNext*1.13);
				break;
		}

		//increases actual level, resets exp and increases exp required to level up again
		Char.level++;
		Char.exp = 0;
		playerAction.setAttribute("src", "resources/audio/sound/levelup.wav");
		playerAction.currentTime = 0;
		playerAction.volume = 1;
		playerAction.play();
	}
}
//draws the victory/pause screen
function drawVictory() {
		ctx.beginPath();
		ctx.drawImage(charImage, 400, 40, 200, 400);
		ctx.closePath();

		ctx.beginPath();
		ctx.font = "40px courier6";
		ctx.fillStyle = "black";
		ctx.fillText("Experience: " + Char.exp, 20, 100);
		ctx.fillText("Exp To Lvl Up: " + (Char.expNext-Char.exp), 20, 150);
		ctx.fill();
		ctx.closePath();

		if (gamemode == 4) {
		ctx.beginPath();
		ctx.font = "40px courier6";
		ctx.fillStyle = "green";
		ctx.fillText(" + " + victoryCounter, 290, 100);
		ctx.fill();
		ctx.closePath();
	  };

		ctx.beginPath();
		ctx.font = "60px courier6";
		ctx.fillStyle = "black";
		ctx.fillText("Level: " + Char.level, 700, 70);
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.font = "30px courier6";
		ctx.fillStyle = "black";
		ctx.fillText("HP: " + Math.round(Char.hp) + "/" + Char.maxhp, 650, 120);
		ctx.fillText("MP: " + Math.round(Char.mp) + "/" + Char.maxmp, 650, 150);
		ctx.fillText("Strength: " + Char.str, 650, 180);
		ctx.fillText("Defense: " + Char.def, 650, 210);
		ctx.fillText("Dexterity: " + Char.dex, 650, 240);
		ctx.fillText("Speed: " + Char.spd, 650, 270);
		ctx.fillText("Special Attack: " + Char.spatk, 650, 300);
		ctx.fillText("Special Defense: " + Char.spdef, 650, 330);
		ctx.fillText("Bosses Defeated: " + bossDefeated, 650, 390);
		ctx.fill();
		ctx.closePath();
}

//Pause screen

//updates pause screen and checks button inputs
function updatePause() {
	if ((27 in keysDown && sticky == false) && pauseCheck == 2) { // Player presses escape while paused in battle
		music.volume = (music.volume*2);
		switch (monster.type) {
			case 100: {
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossOne.jpg";
			};
			break;
			case 200: {
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossTwo.jpg";
			};
			break;
			case 300: {
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossThree.jpg";
			};
			case 400: {
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossFinal.jpg";
			};
			break;
			default:
				switch(bossDefeated) {
					case 0:
					document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battle.jpg";
					break;
					case 1:
					document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleTwo.jpg";
					break;
					case 2:
					document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleThree.jpg";
					break;
					case 3:
					document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleFinal.jpg";
					break;
				};
			break;
		};
		pauseCheck = 0;
		gamemode = 2;
		sticky = true;
	};
	if ((80 in keysDown && sticky == false) && pauseCheck == 2) { // Player presses P while paused in battle
		music.volume = (music.volume*2);
		switch (monster.type) {
			case 100: {
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossOne.jpg";
			};
			break;
			case 200: {
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossTwo.jpg";
			};
			break;
			case 300: {
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossThree.jpg";
			};
			case 400: {
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleBossFinal.jpg";
			};
			break;
			default:
				switch(bossDefeated) {
					case 0:
					document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battle.jpg";
					break;
					case 1:
					document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleTwo.jpg";
					break;
					case 2:
					document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/battleThree.jpg";
					break;
					case 3:
						document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldFinal.jpg";
					break;
				};
			break;
		};
		pauseCheck = 0;
		gamemode = 2;
		sticky = true;
	};
	if ((27 in keysDown && sticky == false) && pauseCheck == 1) { // Player presses escape while paused on field
		music.volume = (music.volume*2);
		switch (bossDefeated) {
			case 0:
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/field.png";
			break;
			case 1:
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldTwo.jpg";
			break;
			case 2:
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldThree.png";
			break;
			case 3:
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldFinal.jpg";
			break;
		};
		pauseCheck = 0;
		gamemode = 1;
		sticky = true;
	};

	if ((80 in keysDown && sticky == false) && pauseCheck == 1) { // Player presses P while paused on field
		music.volume = (music.volume*2);
		switch (bossDefeated) {
			case 0:
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/field.png";
			break;
			case 1:
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldTwo.jpg";
			break;
			case 2:
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldThree.png";
			break;
			case 3:
				document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/fieldFinal.jpg";
			break;
		};
		pauseCheck = 0;
		gamemode = 1;
		sticky = true;
	};
}
//updates the game over screen
function updateGameover() {
	if (13 in keysDown && sticky == false) { // Player presses enter
		sticky = true;
		music.pause();
		music.setAttribute("src", "resources/audio/music/Title.mp3");
		music.currentTime = 0;
		music.volume = 1;
		music.play();
		document.getElementById('myCanvas').style.backgroundImage="url(resources/images/background/title.jpg";
		gamemode = 0;
		bossDefeated = 0;
	}
}


//draws the game over screen
function drawGameover() {
	ctx.beginPath();
	ctx.drawImage(tombImage, -40, 100, 500, 500);
	ctx.closePath();

	ctx.beginPath();
	ctx.drawImage(charImage, 175, 375, 50, 100);
	ctx.closePath();

	ctx.beginPath();
	ctx.drawImage(battleArrow, 350, 100, 100, 50);
	ctx.closePath();

	ctx.beginPath();
	ctx.font = "50px impact";
	ctx.fillStyle = "yellow";
	ctx.fillText("R E T R Y", 455, 148);
	ctx.fill();
	ctx.closePath();
}

//Decides which gamemode you're in, and updates the screen and variables accordingly
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (!transCheck) {
    switch (gamemode) {
			case 0:
    	  updateMenu();
    	  drawMenu();
    	break;
    	case 1:
    		updateField();
    	  drawChar();
    	break;
    	case 2:
    		updateBattle();
    		drawBattle();
    	break;
			case 3:
				updatePause();
				drawVictory();
			break;
			case 4:
				updateVictory();
				drawVictory();
			break;
			case 5:
				updateGameover();
				drawGameover();
			break;
			case 7:
				ctx.beginPath();
				ctx.globalAlpha = 0.5;
				ctx.drawImage(charImage, 400, 50, 200, 400);
				ctx.closePath();
			break;
    	default:
    	break;
    }
	}
	else {
		if (gamemode == 0) {
			ctx.globalAlpha = 1;
			drawMenu();
		} else {
			ctx.globalAlpha = 1;
			drawBattle();
		};
		ctx.beginPath();
		ctx.globalAlpha = (0 + transCount);
    ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black"
		ctx.fill();
		ctx.closePath();

		if (transCount <= 0) {
			transCheck = false;
			ctx.globalAlpha = 1;
		} else {
			if (bossDefeated == 2) {
			transCount = transCount - 0.0017;
		} else if(bossDefeated == 3) {
			transCount = transCount - 0.002;
		} else {
			transCount = transCount - 0.01;
			};
		}
	}
}

//Update time in milliseconds for draw function, this is the whole game's speed
setInterval(draw, 10);
