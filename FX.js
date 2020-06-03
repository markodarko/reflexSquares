class Flash{
	constructor(a = 0, inc = .1){
			this.alpha = a;
			this.inc = inc;
	}
	draw(x,y,w,h){
		if (this.alpha < 0)return
		ctx.save();
		ctx.globalAlpha = this.alpha
		ctx.fillRect(x,y,w,h)
		this.alpha -= this.inc
		ctx.restore();
	}
}
class FlashLoop extends Flash{
	constructor(a,inc){
		super(a,inc);
	}
	draw(x,y,w,h){
		if (this.alpha <= 0) {
			this.alpha = 0;
			this.inc *= -1;
		}
		if (this.alpha >= 1) {
			this.alpha = 1;
			this.inc *= -1;
		}
		super.draw(x,y,w,h);
	}
}