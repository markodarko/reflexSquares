var canvas = document.getElementById('gamewindow');
var ctx = canvas.getContext('2d')

canvas.width = 360//window.innerWidth;
canvas.height = 640//window.innerHeight; 

const GRID = Math.floor(canvas.width/5)

class Flash{
	constructor(a = 0, inc = .1){
			this.alpha = a;
			this.inc = inc;
	}
	draw(x,y,w,h){
		if (this.alpha == 0)return
		ctx.save();
		ctx.globalAlpha = this.alpha
		ctx.fillRect(x,y,w,h)
		this.alpha = Math.max(this.alpha - this.inc, 0)
		ctx.restore();
	}
}
class FlashLoop extends Flash{
	constructor(a,inc){
		super(a,inc);
	}
	draw(x,y,w,h){
		if (this.alpha == 0) {
			this.inc *= -1;
			this.alpha -= this.inc;
		}
		if (this.alpha >= 1) {
			this.alpha = 1;
			this.inc *= -1;
		}
		super.draw(x,y,w,h);
	}
}

class EnemySquare{
	constructor(size,color){
		this.color = color;
		this.dead = false;
		this.setPosition()
		this.w = this.h = size;
		this.flash = new FlashLoop(Math.random(),.02);
	}
	draw(){
		ctx.fillStyle = '#e45c10'
		ctx.fillRect(this.x,this.y,this.w,this.h);
		ctx.fillStyle = '#e40058'
		this.flash.draw(this.x,this.y,this.w,this.h);
	}
	setPosition(){
		this.score = 300;
		this.x = randomINT(4)*GRID;
		this.y = canvas.height;
	}
}

class EnemySpawner{
	constructor(){
		this.speed = 3;
		this.time = this.spawnDelay = 100//Math.floor(GRID/this.speed+this.speed);
		
		this.liveEnemies = [];
		this.deadEnemies = [];
		for (let i=0; i<10; i++){
			this.deadEnemies.push(new EnemySquare(GRID,'#e45c10'))
		}
	}
	update(){
		if (this.time >= this.spawnDelay-this.speed){
			this.time=0;
			if (this.deadEnemies.length > 0){
			this.liveEnemies.unshift(this.deadEnemies.shift())
			}
		}
		var hitEnemy = false;
		for(let i = this.liveEnemies.length-1; i>=0; i--){
			let enemy = this.liveEnemies[i];
			enemy.y -= this.speed;
			if (enemy.dead){
				enemy.setPosition();
				this.deadEnemies.push(...this.liveEnemies.splice(i,1))
				enemy.dead = false;
				continue;
			}
			if (enemy.y < -enemy.h){
				enemy.dead = true;
				GAME.takeDamage();
				continue;
			}
			if (TouchControls.touchX == null) continue;
			var X = TouchControls.touchX, Y = TouchControls.touchY;
			if (X < enemy.x || X > enemy.x + enemy.w) continue;
			if (Y < enemy.y || Y > enemy.y + enemy.h) continue;
			enemy.dead = true;
			hitEnemy = true;
		}
		this.time++;
		if (hitEnemy == false && TouchControls.touchX)GAME.takeDamage();
	}
	draw(){
		this.liveEnemies.forEach(enemy => {
			enemy.draw();
		})
	}
}

class GameControl{
	constructor(){
		this.score = 0;
		this.flash = new Flash();
		this.background = new GameBackground()
		this.spawner = new EnemySpawner()
	}
	takeDamage(){
		this.flash.alpha = 1;
	}
	drawFlash(){
		ctx.fillStyle = '#e40058'
		this.flash.draw(0,0,canvas.width,canvas.height)
	}
}


function loop(){
	requestAnimationFrame(loop);
	ctx.clearRect(0,0,canvas.width,canvas.height)
	GAME.background.draw();
	GAME.spawner.update();
	GAME.drawFlash();
	GAME.spawner.draw();
	TouchControls.clearControl();
}

var TouchControls = {
	touchX:null,
	touchY:null,
	clearControl: function(){
		this.touchX = null;
		this.touchY = null;
	},
	tap:function(e){
		TouchControls.touchX = e.changedTouches[0].clientX;
		TouchControls.touchY = e.changedTouches[0].clientY;
		GAME.background.starfields[0].maxSpeed = 40;
		GAME.background.starfields[1].maxSpeed = 30;
	},
	release:function(e){
		GAME.background.starfields[0].maxSpeed = 3;
		GAME.background.starfields[1].maxSpeed = 1;
	}
}
window.addEventListener('touchstart',TouchControls.tap)
window.addEventListener('touchend', TouchControls.release)

var GAME = new GameControl();
loop();
