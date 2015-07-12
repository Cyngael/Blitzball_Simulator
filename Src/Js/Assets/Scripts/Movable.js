function Movable(x,y)
{
	this.x = x;
	this.y = y;

	this.r = 10;
	this.speed = 3;

	this.color = "#FF0000";

	this.isActive = true;

	
}

Movable.prototype =
{

    Render: function () 
    { 
    	var cx = ScreenCanvas.Context;
    	cx.beginPath();
		cx.moveTo(this.x,this.y);
		cx.arc(this.x, this.y, this.r, Math.PI * 2,false)
		cx.closePath();
		cx.fillStyle = this.color;
		cx.fill();
		cx.stroke();


    },
    

    Move: function (x, y) 
    {
    	var newX = this.x + x * this.speed;
    	var newY = this.y + y * this.speed;


    	var lastX = this.x;
    	var lastY = this.y;
   		this.x = newX;
		this.y = newY;

		if(this.x > ScreenCanvas.Canvas.width || this.x < 0)
		{
			this.x = lastX;
			this.OnHitWall();
		}
		if(this.y > ScreenCanvas.Canvas.height || this.y < 0)
		{
			this.y = lastY;
			this.OnHitWall();
		}
    	


    },
    OnHitWall : function()
    {

    },
    SetPosition: function(x, y)
    {
    	this.x = x;
    	this.y = y;
    },
    SetActive: function(active)
    {
    	this.isActive = active;
    }
}