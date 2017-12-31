//CONST======================================================
const getX = 0;
const getY = 1;

Math.clamp = function (num, min, max) {
	return Math.max(min, Math.min(num, max));
}

function RendWidth() {
	return Math.clamp(window.innerWidth - 15, 250, window.innerWidth);
}

function RendHeight() {
	return Math.clamp(window.innerHeight - 15, 250, window.innerHeight);
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

	getTile(x, y) {
		return this.mapLayout[[Math.clamp(x, 0, this.map.getSize(getX)-1), Math.clamp(y, 0, this.map.getSize(getY)-1)]];
	}

	GenMap(hasCharmap = true, mapIndex = 0) {
		if (hasCharmap) {
			this.map.SetMap(mapIndex);
			var i = 0;
			for (var y = 0; y < this.map.getSize(getY); y++) {
				for (var x = 0; x < this.map.getSize(getX); x++) {

					switch (this.map.getCharmapChar(i)) {
						case 'm':
							this.mapLayout[[x, y]] = new TileMountain();
							break;

						case "f":
							this.mapLayout[[x, y]] = new TileForest();
							break;

						case "p":
							this.mapLayout[[x, y]] = new TilePlane();
							break;

						case "M":
							this.mapLayout[[x, y]] = new TileVoid("HighMountain");
							break;

						case "w":
							this.mapLayout[[x, y]] = new TileVoid("Water");
							break;

						default:
							this.mapLayout[[x, y]] = new TileVoid();
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
		this.ref = document.getElementById("can");
		this.draw = this.ref.getContext("2d");

		this.scale = RendHeight() / zoom;
		this.textScale = RendHeight() / zoom;

		this.rendObj = [];
	}

	Init() {
		this.Resize();
	}

	Resize() {
		document.getElementById("can").width = RendWidth();
		document.getElementById("can").height = RendHeight();

		this.textScale = RendHeight() / 15;

		this.scale = RendHeight() / zoom;
	}

	Img(x, y, src = "", offsetX = gc.players[0].RendOffsetX(), offsetY = gc.players[0].RendOffsetY(), wdt = this.scale, hgt = this.scale) {
		this.draw.drawImage(document.getElementById(src), x - offsetX, y - offsetY, wdt, hgt);
	}

	Box(x, y, clr = "gray", wdt = this.scale, hgt = this.scale) {
		this.draw.fillStyle = clr;
		this.draw.fillRect(x, y, wdt, hgt);
	}

	RoundRect(x, y, clr = "gray", wdt, hgt) {
		this.Box(x + 15, y, clr, wdt -30, hgt);
		this.Box(x, y + 15, clr, wdt, hgt - 30);

		this.Circle(x + 15, y + 15, clr, 15);
		this.Circle((x + wdt) - 15, y + 15, clr, 15);
		this.Circle(x + 15, (y + hgt) - 15, clr, 15);
		this.Circle((x + wdt) - 15, (y + hgt) - 15, clr, 15);
	}

	Circle(x, y, clr, rad = this.scale / 2) {
		this.draw.beginPath();
		this.draw.arc(x, y, rad, 0, 2 * Math.PI, false);
		this.draw.fillStyle = clr;
		this.draw.fill();
	}

	Text(text, clr, x, y, maxwdt) {
		this.draw.fillStyle = clr;
		this.draw.font = this.textScale + "px Arial";
		this.draw.fillText(text, x, y, maxwdt);
	}

	Clear() {
		this.draw.clearRect(0, 0, document.getElementById("can").width, document.getElementById("can").height);
	}

	addRendObj(obj) {
		this.rendObj.push(obj);
	}

	FUD() {
		gc.renderer.Clear();
		gc.renderer.Box(0, 0, "#000066", RendWidth(), RendHeight());

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
				this.size = [10, 10];

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
	constructor(setRendSRC = "tileMountain") {
		this.pos = [-1, -1];
		this.rendSRC = setRendSRC;
		this.Init();
	}

	Init() {
		gc.renderer.addRendObj(this);
	}

	SetPos(x, y) {
		this.pos = [x, y];
	}

	Rend() {
		gc.renderer.Img(this.pos[getX] * gc.renderer.scale, this.pos[getY] * gc.renderer.scale, this.rendSRC);
	}
}

class Tile extends GameObject {
	constructor(setRendSRC = "Mountain", setMovementPoints = 0, setVisionPoints = 0) {
		super("tileVoid");
		this.rendAS = setRendSRC;
		this.movementPoints = setMovementPoints;
		this.visionPoints = setVisionPoints;

		this.name = setRendSRC;
		this.isExplored = false;
	}

	Exploring() {
		if (!this.isExplored) {
			this.isExplored = true;
			this.rendSRC = "tile" + this.rendAS;
		}
	}

	getMovementPoints() {
		return this.movementPoints;
	}

	getVision() {
		return this.visionPoints;
	}
}

class TileMountain extends Tile {
	constructor() {
		super("Mountain", 50, 4);
	}
}

class TileForest extends Tile {
	constructor() {
		super("Forest", 20, 2);
	}
}

class TilePlane extends Tile {
	constructor() {
		super("Plane", 10, 3);
	}
}

class TileVoid extends Tile {
	constructor(setRendSRC = "Void") {
		super(setRendSRC, 999999, 0);
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
		this.name = "Hero";

		this.hp = 100;
		this.stamina = 100;

		this.inventory = [];
		this.Initt();
	}

	Initt() {
		for (var i = 0; i < 33; i++) {
			this.inventory.push(new InventoryItem());
		}
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

		this.inventoryIsOpen = false;

		this.Init();
	}

	Init() {
		this.hero.SetPos(gc.mapmanager.map.spawnpoint[getX], gc.mapmanager.map.spawnpoint[getY]);
		this.Move(0, 0);

		gc.renderer.addRendObj(this);
	}

	Move(x, y) {
		if (this.hero.stamina >= gc.mapmanager.getTile(this.hero.pos[getX] + x, this.hero.pos[getY] + y).getMovementPoints() && !this.inventoryIsOpen) {
			this.hero.stamina -= gc.mapmanager.getTile(this.hero.pos[getX] + x, this.hero.pos[getY] + y).getMovementPoints();

			this.hero.pos[getX] = Math.clamp(this.hero.pos[getX] + x, 0, gc.mapmanager.map.getSize(getX) -1);
			this.hero.pos[getY] = Math.clamp(this.hero.pos[getY] + y, 0, gc.mapmanager.map.getSize(getY) -1);

			gc.mapmanager.getTile(this.hero.pos[getX], this.hero.pos[getY]).Exploring();

			for (var x = -gc.mapmanager.mapLayout[[this.hero.pos[getX], this.hero.pos[getY]]].getVision(); x < gc.mapmanager.mapLayout[[this.hero.pos[getX], this.hero.pos[getY]]].getVision(); x++) {
				for (var y = -gc.mapmanager.mapLayout[[this.hero.pos[getX], this.hero.pos[getY]]].getVision(); y < gc.mapmanager.mapLayout[[this.hero.pos[getX], this.hero.pos[getY]]].getVision(); y++) {

					gc.mapmanager.mapLayout[[Math.clamp(this.hero.pos[getX] + x, 0, gc.mapmanager.map.size[getX] -1), Math.clamp(this.hero.pos[getY] + y, 0, gc.mapmanager.map.size[getY] -1)]].Exploring();
				}
			}
		}

		//temp
		//this.hero.stamina += 100;
	}

	RendOffsetX() {
		return -RendWidth() / 2 + gc.renderer.scale + this.hero.pos[getX] * gc.renderer.scale;
	}

	RendOffsetY() {
		return -RendHeight() / 2 + gc.renderer.scale + this.hero.pos[getY] * gc.renderer.scale;
	}

	Rend() {
		this.RendStatusBar();
		this.RendInventory();
	}

	OpenMenu() {
		if (!this.inventoryIsOpen) {
			this.inventoryIsOpen = true;
		} else {
			this.inventoryIsOpen = false;
		}
	}

	RendStatusBar() {
		gc.renderer.//RoundRect
			Box(5, RendHeight() - 5, "gray", RendWidth() * 0.15, -RendHeight() * 0.15);
		gc.renderer.Text("HP: " + this.hero.hp, "black", 5 + 5, (RendHeight() - 5) - RendHeight() * 0.15 + gc.renderer.textScale, RendWidth() * 0.15 - 5);
		gc.renderer.Text("STM: " + this.hero.stamina, "black", 5 + 5, (RendHeight() - 5) - RendHeight() * 0.15 + 2 * gc.renderer.textScale, RendWidth() * 0.15 - 5);
	}

	RendInventory() {
		if (this.inventoryIsOpen) {
			gc.renderer.RoundRect(RendWidth() * 0.15, RendHeight() * 0.15, "gray", RendWidth() * 0.75, RendHeight() * 0.75);

			for (var i = 0; i < this.hero.inventory.length; i++) {
				gc.renderer.Img(RendWidth() * 0.15 + i * gc.renderer.scale + 15, RendHeight() * 0.15 + 15, this.hero.inventory[i].rendSRC, 0, 0);
			}

		}
	}
}

//INVENTORY====================================
class InventoryItem {
	constructor(setRendSRC = "tileMountain", setName = "Item", setDescription = "Description") {
		this.name = setName;
		this.description = setDescription;
		this.rendSRC = setRendSRC;
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
	gc.renderer.Resize();
}

window.addEventListener("keydown", (event) => {
	//console.log(event.keyCode);

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
			gc.players[0].OpenMenu();
			break;

		case 81:
			//Q
			
			break;

		case 90:
			//Z
			gc.players[0].hero.stamina = 999999;
			break;
	}
});

document.getElementById("can").addEventListener("mousemove", (event) => {
	var mX = Math.clamp(event.clientX - 8, 0, window.innerWidth - 8);
	var mY = Math.clamp(event.clientY - 8, 0, window.innerHeight - 8);

	var mXtile = Math.clamp(Math.floor((event.clientX + gc.players[0].RendOffsetX()) / gc.renderer.scale), 0, gc.mapmanager.map.getSize(getX) - 1);
	var mYtile = Math.clamp(Math.floor((event.clientY + gc.players[0].RendOffsetY()) / gc.renderer.scale), 0, gc.mapmanager.map.getSize(getY) - 1);

	//console.log(mX + "!" + mY);
	if (gc.mapmanager.getTile(mXtile, mYtile).isExplored) {
		console.log(gc.mapmanager.getTile(mXtile, mYtile).name);
	}

});