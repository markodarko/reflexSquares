var canvas = document.getElementById('gamewindow');
var ctx = canvas.getContext('2d')

canvas.width = 360;//window.innerWidth;
canvas.height = 640;//window.innerHeight; 
const GRID_OFFSET = 2;
const SCREEN_OFFSET = Math.floor((GRID_OFFSET*5)/2);
const GRID = Math.floor(canvas.width/5);//-GRID_OFFSET
const DAMAGE_UNIT = Math.ceil(canvas.height/20);


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
		this.x = randomINT(4)*GRID//+SCREEN_OFFSET;
		this.y = canvas.height;
	}
	tapCheck(){
		var X = TouchControls.touchX, Y = TouchControls.touchY;
		if (X < this.x || X > this.x + this.w) return false;
		if (Y < this.y || Y > this.y + this.h) return false;
		return this.dead = true;
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
			if (hitEnemy || TouchControls.touchX == null) continue;
			hitEnemy = enemy.tapCheck();
		}
		this.time++;
		if (!hitEnemy && TouchControls.touchX)GAME.takeDamage();
	}
	draw(){
		this.liveEnemies.forEach(enemy => {
			enemy.draw();
		})
	}
}
class DamageMeter{
	constructor(){
		this.x = canvas.width - SCREEN_OFFSET;
		this.multiplier = 0;
		this.total = 0;
		this.delay = 0;
		this.increment = Math.floor(canvas.height / 20)
	}
	draw(){
		if(this.total == 0){this.multiplier = 0;return;}
		ctx.fillStyle = '#e40058';
		ctx.fillRect(this.x,0,SCREEN_OFFSET,this.total);
		ctx.fillRect(0,0,SCREEN_OFFSET,this.total);
		if (this.delay == 0){
			this.total = Math.max(this.total-1, 0 );
		}else this.delay--;
	}
	addDamage(){
		this.delay = 200;
		this.multiplier = Math.min(this.multiplier + 1, 5)// Math.min(this.multiplier + this.increment, this.increment * 5)
		this.total += this.multiplier * DAMAGE_UNIT;
	}
}

class GameControl{
	constructor(){
		this.damage = new DamageMeter();
		this.flash = new Flash();
		this.background = new GameBackground()
		this.spawner = new EnemySpawner()
	}
	takeDamage(){
		this.flash.alpha = 1;
		this.damage.addDamage();
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
	GAME.damage.draw();
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
