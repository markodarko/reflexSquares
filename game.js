var canvas = document.getElementById('gamewindow');
var ctx = canvas.getContext('2d')

canvas.width = 360//window.innerWidth;
canvas.height = 640//window.innerHeight; 

const GRID = Math.floor(canvas.width/5)

class EnemySquare{
	constructor(size){
		this.dead = false;
		this.setPosition()
		this.w = this.h = size;
	}
	draw(){
		ctx.fillRect(this.x,this.y,this.w,this.h);
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
			this.deadEnemies.push(new EnemySquare(GRID))
		}
	}
	update(){
		
		if (this.time >= this.spawnDelay-this.speed){
			this.time=0;
			if (this.deadEnemies.length > 0){
			this.liveEnemies.unshift(this.deadEnemies.shift())
			}
		}
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
				continue;
			}
			if (touchX == null) continue;
			if (touchX < enemy.x || touchX > enemy.x + enemy.w) continue;
			if (touchY < enemy.y || touchY > enemy.y + enemy.h) continue;
				enemy.dead = true;
				touchX = touchY = null;
		}
		this.time++;
	}
		
	draw(){
		ctx.fillStyle = 'orange'
		this.liveEnemies.forEach(enemy => {
			enemy.draw();
		})
	}
}

class GameControl{
	constructor(){
		this.score = 0;
		this.background = new GameBackground()
		this.spawner = new EnemySpawner()
	}
}


function loop(){
	requestAnimationFrame(loop);
	ctx.clearRect(0,0,canvas.width,canvas.height)
	GAME.background.draw();
	GAME.spawner.update();
	GAME.spawner.draw();
}

var touchX = null, touchY = null; touchTime = 0;
window.addEventListener('touchstart',(e)=>{
	touchTime = e.timeStamp;
	GAME.background.starfields[0].maxSpeed = 40;
	GAME.background.starfields[1].maxSpeed = 30;
})
window.addEventListener('touchend', (e)=>{
	if (e.timeStamp - touchTime < 200){
		touchX = e.changedTouches[0].clientX;
		touchY = e.changedTouches[0].clientY;
		touchTime = 0;
	}
	GAME.background.starfields[0].maxSpeed = 3;
	GAME.background.starfields[1].maxSpeed = 1;
})

var GAME = new GameControl();
loop();
