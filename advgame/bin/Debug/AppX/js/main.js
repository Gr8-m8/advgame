//CONST======================================================
const getX = 0;
const getY = 1;

//GAMECONTROLLER=============================================

class GameController {
	constructor() {
		this.renderer = new Renderer();
		this.mapmanager = new MapMapmanager();
	}

	Init() {
		this.renderer.Init();
		this.mapmanager.GenMap();
	}

	FUD() {

	}
}

class MapMapmanager {
	constructor() {
		this.mapLayout = [[]];
	}

	Init() {

	}

	GenMap(hasCharmap = true, mapIndex = 0) {
		if (hasCharmap) {
			var map = new Map();
			map.SetMap(mapIndex);
			var i = 0;
			for (var y = 0; y < map.getSize(getY); y++) {
				for (var x = 0; x < map.getSize(getX); x++) {
					switch (map.getCharmapChar(i)) {
						case "m":
							this.mapLayout[[x, y]] = new Tile("Mountain", 8);
							break;

						case "f":
							this.mapLayout[[x, y]] = new Tile("Forest", 4);
							break;

						case "p":
							this.mapLayout[[x, y]] = new Tile("Plane", 2);
							break;

						case "M":
							this.mapLayout[[x, y]] = new Tile("HighMountain", -1);
							break;

						case "w":
							this.mapLayout[[x, y]] = new Tile("Water", -1);
							break;

						default:
						case "O":
							this.mapLayout[[x, y]] = new Tile("Void", -1);
							break;

					}
					this.mapLayout[[x, y]].SetPos(x, y);
					this.mapLayout[[x, y]].Rend();
					i++;
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

		this.scale = (window.innerHeight - 15) / 10;
	}

	Init() {
		document.getElementById("play").innerHTML =
			"<canvas id='" + this.canId + "' class='canvas' width='" + (window.innerWidth - 15) + "' height='" + (window.innerHeight - 15) + "'></canvas>";

		this.scale = (window.innerHeight - 15) / 10;

		this.ref = document.getElementById(this.canId);
		this.draw = this.ref.getContext("2d");

		this.Box(this.scale * 0, this.scale * 0);
		this.Box(this.scale * 1, this.scale * 1);
		this.Box(this.scale * 2, this.scale * 2);
		this.Box(this.scale * 3, this.scale * 3);
		this.Box(this.scale * 4, this.scale * 4);

		this.Box(this.scale * 5, this.scale * 5);
		this.Box(this.scale * 6, this.scale * 6);
		this.Box(this.scale * 7, this.scale * 7);
		this.Box(this.scale * 8, this.scale * 8);
		this.Box(this.scale * 9, this.scale * 9);
	}

	Box(x, y, clr = "red", wdt = this.scale, hgt = this.scale) {
		this.draw.fillStyle = clr;
		this.draw.fillRect(x, y, wdt, hgt);
	}

	Img(x, y, src = "", wdt = this.scale, hgt = this.scale) {
		this.draw.drawImage(document.getElementById(src), x * this.scale, y * this.scale, wdt, hgt);
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
					"mmmmmmmmmm" +
					"mmmmmmmmmm" +
					"mmmmmmmmmm" +
					"mmmmmmmmmm" +
					"mmmmmmmmmm" +
					"mmmmmmmmmm" +
					"mmmmmmmmmm" +
					"mmmmmmmmmm" +
					"mmmmmmmmmm" +
					"mmmmmmmmmm";

				this.spawnpoint = [2,4];
				this.size = [10, 10];
				break;
		}
	}

	getCharmapChar(index) {
		return this.charmap.charAt[index];
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
		this.pos = [];
		this.rendSRC = setRendSRC;
	}

	Init() {

	}

	Move(x, y) {
		this.pos[getX] += x;
		this.pos[getY] += y;
	}

	SetPos(x, y) {
		this.pos = [x, y];
	}

	Rend() {
		gc.renderer.Img(this.pos[getX], this.pos[getY], "tile" + this.rendSRC);

		requestAnimationFrame(this.Rend);
	}
}

class Tile extends GameObject {
	constructor(setRendSRC = "", setMovementPoints = 0) {
		super(setRendSRC);
		this.movementPoints = setMovementPoints;
	}

	Init() {

	}

	getMovementPoints() {
		return this.movementPoints
	}
}

class Hero extends GameObject{
	constructor() {
		super();
	}

	Init() {

	}
}

//PUBLIC=======================================
var gc = new GameController();


//EVENT========================================
window.onload = function () {
	gc.Init();
	requestAnimationFrame(gc.FUD);
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
			break;

		case 68:
		case 39:
			//LEFT
			break;

		case 83:
		case 40:
			//DOWN
			break;

		case 65:
		case 37:
			//RIGHT
			break;

		case 69:
			//E
			break;

		case 81:
			//Q
			break;
	}
});