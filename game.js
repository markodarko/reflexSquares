var canvas = document.getElementById('gamewindow');
var ctx = canvas.getContext('2d')

canvas.width = 360//window.innerWidth;
canvas.height = 640//window.innerHeight; 

const GRID = Math.floor(canvas.width/5)

class EnemySquare{
	constructor(size){
		this.x = 0;
		this.y = canvas.height;
		this.w = this.h = size;
	}
	draw(){
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
	setPosition(){
		this.x = randomINT(4)*GRID;
	}
}

class EnemySpawner{
	constructor(){
		this.time = 0;
		this.spawnDelay = 50;
		this.speed = 5;
		this.liveEnemies = [];
		this.deadEnemies = [];
		for (let i=0; i<10; i++){
			this.deadEnemies.push(new EnemySquare(GRID))
		}
	}
	update(){
		this.time++;
		if (this.time == this.spawnDelay){
			this.time=0;
			if (this.deadEnemies.length > 0){
			var enemySquare = this.deadEnemies.shift()
			enemySquare.setPosition()
			this.liveEnemies.unshift(enemySquare)
			}
		}
		for(let i = this.liveEnemies.length-1; i>0; i--){
			let enemy = this.liveEnemies[i];
			enemy.y -= this.speed;
			if (enemy.y < -enemy.h){
				enemy.y = canvas.height;
				this.deadEnemies.push(this.liveEnemies.pop())
			}
		}
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
window.addEventListener('touchstart',()=>{
	GAME.background.starfields[0].maxSpeed = 40;
	GAME.background.starfields[1].maxSpeed = 30;
})
window.addEventListener('touchend', ()=>{
	GAME.background.starfields[0].maxSpeed = 3;
	GAME.background.starfields[1].maxSpeed = 1;
})
var GAME = new GameControl();
loop();
