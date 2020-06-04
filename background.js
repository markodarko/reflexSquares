class Starfield{
  constructor(count,size,speed,width,height,vertical = true){
	this.stars = [];
	this.size = size;
	this.speed = speed;
	this.maxSpeed = speed;
	this.vertical = vertical;
	this.width = width;
	this.height = height;
	for(let i = 0; i < count; i++){
		this.stars.push([randomINT(width-this.size),randomINT(height-this.size)])
	}
  }
  draw(){
	this.drawAndMoveStars();
	this.checkSpeed();
  }
  drawAndMoveStars(){
	var position,bounds,w = this.size,h = this.size;
	var warp = Math.max(0,this.speed-10) * 4;
	
	if (this.vertical){
		position = 1; h += warp; bounds = this.height;
	}else{
		position = 0; w += warp; bounds = this.width;
	}
	this.stars.forEach(star =>{
		ctx.fillRect(star[0],star[1],w,h)
		star[position] += this.speed
		if(star[position] > bounds) star[position] -= bounds + this.size + warp ;
		else if (star[position] < -this.size) star[position] += bounds + this.size + warp;
	})
  }
	checkSpeed(){
		if(this.speed < this.maxSpeed){
			this.speed = Math.min(this.speed + .5, this.maxSpeed)
		}else if (this.speed > this.maxSpeed){
			this.speed = Math.max(this.speed - .5, this.maxSpeed)
		}
	}
}

class GameBackground{
	constructor(){
		this.time = 0;
		this.starColor = ['#00e8d8','#a4effc','white','#d8f878'];
		this.starfields = 
		[
			new Starfield(12,6,3,canvas.width,canvas.height),
			new Starfield(12,3,1,canvas.width,canvas.height)
		]
	}
	draw(){
		if (this.time == 15){
			this.time = 0
			cycleArray(this.starColor)
		}
		this.time++
		ctx.fillStyle = this.starColor[0];
		this.starfields[0].draw();
		this.starfields[1].draw();
	}
}