//CONST======================================================
const getX = 0;
const getY = 1;

Math.clamp = function (num, min, max) {
	return Math.max(min, Math.min(num, max));
}

//GAMECONTROLLER=============================================

class GameController {
	constructor() {
		this.renderer = new Renderer();
		this.mapmanager = new MapMapmanager();

		this.numOfplr = 1;
		this.players = [];
	}

	Init() {
		this.renderer.Init();
		this.mapmanager.GenMap();

		for (var i = 0; i < this.numOfplr; i++) {
			this.players[i] = new Player(i);
		}
	}
}

class MapMapmanager {
	constructor() {
		this.mapLayout = [[]];
		this.map = new Map();
	}

	Init() {

	}

	GenMap(hasCharmap = true, mapIndex = 0) {
		if (hasCharmap) {
			this.map.SetMap(mapIndex);
			var i = 0;
			for (var y = 0; y < this.map.getSize(getY); y++) {
				for (var x = 0; x < this.map.getSize(getX); x++) {

					switch (this.map.getCharmapChar(i)) {
						case 'm':
							this.mapLayout[[x, y]] = new Tile("Mountain", 50);
							break;

						case "f":
							this.mapLayout[[x, y]] = new Tile("Forest", 20);
							break;

						case "p":
							this.mapLayout[[x, y]] = new Tile("Plane", 10);
							break;

						case "M":
							this.mapLayout[[x, y]] = new Tile("HighMountain", 999);
							break;

						case "w":
							this.mapLayout[[x, y]] = new Tile("Water", 999);
							break;

						default:
							this.mapLayout[[x, y]] = new Tile("Void", 999);
							break;

					}
					this.mapLayout[[x, y]].SetPos(x, y);
					this.mapLayout[[x, y]].Init();
					i++;

					switch (this.map.getCharmapChar(i)) {
						default:
							break;

						case "d":
							this.mapLayout[[x, y]].dungeon = new DungeonTile("dungeon");
							this.mapLayout[[x, y]].dungeon.SetPos(x, y);
							x--;
							break;
					}
				}
			}

			
		}
	}
}

class Renderer {
	constructor() {
		this.canId = "can";
		this.ref;
		this.draw;

		this.scale = (window.innerHeight - 15) / zoom;

		this.rendObj = [];
	}

	Init() {
		document.getElementById("play").innerHTML =
			"<canvas id='" + this.canId + "' class='canvas' width='" + (window.innerWidth - 15) + "' height='" + (window.innerHeight - 15) + "'></canvas>";

		this.scale = (window.innerHeight - 15) / zoom;

		this.ref = document.getElementById(this.canId);
		this.draw = this.ref.getContext("2d");
	}

	Box(x, y, clr = "red", wdt = this.scale, hgt = this.scale) {
		this.draw.fillStyle = clr;
		this.draw.fillRect(x, y, wdt, hgt);
	}

	Circle(x, y, clr, rad = this.scale / 2) {
		this.draw.beginPath();
		this.draw.arc(x, y, rad, 0, 2 * Math.PI, false);
		this.draw.fillStyle = clr;
		this.draw.fill();
		this.draw.lineWidth = 5;
		this.draw.strokeStyle = '#003300';
		this.draw.stroke();
	}

	Img(x, y, src = "", scaleFactor = 1, offset = 0, wdt = this.scale, hgt = this.scale) {
		this.draw.drawImage(document.getElementById(src), x * this.scale - gc.players[0].clientRendOffset(getX), y * this.scale - gc.players[0].clientRendOffset(getY), wdt * scaleFactor, hgt * scaleFactor);
	}

	Text(text, clr, x, y, maxwdt) {
		this.draw.fillStyle = clr;
		this.draw.font = "30px Arial";
		this.draw.fillText(text, x, y, maxwdt);
	}

	Clear() {
		this.draw.clearRect(0, 0, document.getElementById(this.canId).width, document.getElementById(this.canId).height);
	}

	addRendObj(obj) {
		this.rendObj.push(obj);
	}

	FUD() {
		gc.renderer.Clear();

		for (var i = 0; i < gc.renderer.rendObj.length; i++) {
			gc.renderer.rendObj[i].Rend();
		}

		requestAnimationFrame(gc.renderer.FUD);
	}
}

//==========================================================

class Map {
	constructor() {
		this.charmap = "";
		this.spawnpoint = [];
		this.size = [];
	}

	SetMap(indexORname) {
		switch (indexORname) {
			default:
			case 0:
			case "Nobs Valley":
				this.charmap =
				"0" + "0" + "m" + "m" + "m" + "m" + "m" + "m" + "0" + "0" +

				"0" + "m" + "p" + "p" + "f" + "f" + "f" + "f" + "m" + "0" +

				"0" + "m" + "p" + "M" + "M" + "f" + "f" + "f" + "m" + "0" +

				"m" + "f" + "m" + "0" + "M" + "f" + "f" + "f" + "f" + "m" +

				"m" + "f" + "f" + "m" + "f" + "f" + "f" + "p" + "p" + "w" +

				"m" + "f" + "f" + "f" + "f" + "f" + "p" + "p" + "p" + "w" +

				"m" + "f" + "f" + "f" + "f" + "f" + "p" + "p" + "p" + "m" +

				"m" + "p" + "f" + "f" + "f" + "p" + "p" + "p" + "m" + "0" +

				"0" + "m" + "m" + "m" + "p" + "p" + "p" + "m" + "0" + "0" +

				"0" + "0" + "0" + "0" + "m" + "m" + "m" + "0" + "0" + "0";

				this.spawnpoint = [2,2];
				this.size = [10, 10];
				break;
		}
	}

	getCharmapChar(index) {
		return this.charmap.charAt(index);
	}

	getSpawn(xORy) {
		return this.spawnpoint[xORy];
	}

	getSize(xORy) {
		return this.size[xORy];
	}
}

//GAMEOBJECT=================================================

class GameObject {
	constructor(setRendSRC = "") {
		this.pos = [-1, -1];
		this.rendSRC = setRendSRC;
		this.rendScale = 1;
		this.Init();
	}

	Init() {
		gc.renderer.addRendObj(this);
	}

	SetPos(x, y) {
		this.pos = [x, y];
	}

	Rend() {
		gc.renderer.Img(this.pos[getX], this.pos[getY], this.rendSRC, this.rendScale);
	}
}

class Tile extends GameObject {
	constructor(setRendSRC = "", setMovementPoints = 0) {
		super("tile" + setRendSRC);
		this.movementPoints = setMovementPoints;

		this.dungeon = new DungeonTile("dungeon");
	}

	Exploring() {

	}

	getMovementPoints() {
		return this.movementPoints;
	}
}

class DungeonTile extends GameObject {
	constructor(setRendSRC = "") {
		super(setRendSRC);

		this.Initt();
	}

	Initt() {
		this.rendScale = 0.5;
	}
}

class Hero extends GameObject{
	constructor() {
		super("plr");

		this.hp = 100;
		this.stamina = 100;
	}

	Move(x, y) {
		this.pos[getX] += x;
		this.pos[getY] += y;
	}

}

//Player=======================================

class Player {
	constructor(setIndex = 0) {
		this.index = setIndex;
		this.hero = new Hero();

		this.rendOffset = [this.hero.pos[getX], this.hero.pos[getY]];

		this.Init();
	}

	Init() {
		this.hero.SetPos(gc.mapmanager.map.spawnpoint[getX], gc.mapmanager.map.spawnpoint[getY]);

		gc.renderer.addRendObj(this);
	}

	Move(x, y) {
		if (this.hero.stamina >= gc.mapmanager.mapLayout[[this.hero.pos[getX] + x, this.hero.pos[getY] + y]].getMovementPoints()) {
			this.hero.stamina -= gc.mapmanager.mapLayout[[this.hero.pos[getX] + x, this.hero.pos[getY] + y]].getMovementPoints();
			this.hero.pos[getX] += x;
			this.hero.pos[getY] += y;
			
		}

		this.rendOffset[getX] = -(window.innerWidth  - 15) / 2 + gc.renderer.scale + this.hero.pos[getX] * gc.renderer.scale;
		this.rendOffset[getY] = -(window.innerHeight - 15) / 2 + gc.renderer.scale + this.hero.pos[getY] * gc.renderer.scale;
	}

	clientRendOffset(xORy) {
		//console.log(this.rendOffset[xORy]);
		return this.rendOffset[xORy];
	}

	Rend() {

		this.RendStatusBar();
		this.RendInventory();
	}

	RendStatusBar() {
		gc.renderer.Box(5, (window.innerHeight - 15) - 155, "gray", 400, 150);
		gc.renderer.Text(" HP  : " + this.hero.hp, "black", 10, (window.innerHeight - 15) - 125, 395);
		gc.renderer.Text("STM: " + this.hero.stamina, "black", 10, (window.innerHeight - 15) - 125 + 35, 395);
	}

	RendInventory() {
		gc.renderer.Box((window.innerWidth - 15) - 50, 150, "gray", 500, (window.innerHeight -15));
	}
}

//PUBLIC=======================================
var gc = new GameController();

var zoom = 10;

//EVENT========================================
window.onload = function () {
	gc.Init();
	gc.renderer.FUD();
}

window.onresize = function () {
	gc.renderer.Init();
}

window.addEventListener("keydown", (event) => {
	console.log(event.keyCode);

	switch (event.keyCode) {
		default:
			break;

		case 87:
		case 38:
			//UP
			gc.players[0].Move(0, -1);
			break;

		case 68:
		case 39:
			//LEFT
			gc.players[0].Move(1, 0);
			break;

		case 83:
		case 40:
			//DOWN
			gc.players[0].Move(0, 1);
			break;

		case 65:
		case 37:
			//RIGHT
			gc.players[0].Move(-1, 0);
			break;

		case 69:
			//E
			
			break;

		case 81:
			//Q
			
			break;

		case 90:
			//Z
			gc.players[0].hero.stamina = 100;
			break;
	}
});