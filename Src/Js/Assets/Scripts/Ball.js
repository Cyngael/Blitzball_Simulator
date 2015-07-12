function Ball(x,y,controller)
{
    
	Movable.apply(this,[x,y]);

	this.controller = controller; //Player

    this.color = "#0000FF";

	this.canMove = false;

	this.speed = 5;

	this.r = 5;

	this.dir = { "x" : 0, "y" : 0};

	this.isMoving = true;

	this.target = null;

	this.power = 0;

	this.originalStat = null;

	this.tick = 0;

	this.effect = null;

}

Ball.prototype = Object.create(Movable.prototype);

Ball.prototype.constructor = Ball;

Ball.prototype.Start = function()
{

}

Ball.prototype.Update= function () 
{ 
	if(this.isActive)
	{
		if(!!this.controller && !this.isMoving)
			this.Follow(this.controller);
		else
		{
			if(this.isMoving)
			{
				this.tick ++;
				if(this.tick%30 == 0)
				{
					this.power = (this.power > 0 ? this.power - 1 : this.power);
				}

				this.Move(this.dir.x,this.dir.y);
			}
		}
		
		this.Render(); 
	}
}
Ball.prototype.Follow = function (who)
{

	if(who.team == "greenTeam")
		this.SetPosition(who.x + who.r + this.r,who.y);
	else
		this.SetPosition(who.x - who.r - this.r,who.y);

}

Ball.prototype.GrabBy = function (who)
{
	this.controller = who;
	this.dir = { "x" : 0, "y" : 0};
	this.isMoving = false;
	this.target = null;
	this.power = 0;
	this.tick = 0;


}

Ball.prototype.Pass = function(who,power,effect)
{

	this.power = power;
	this.effect = effect;

	this.target = who.name;

	var diffy = ( this.y - who.y );
    var diffx = ( this.x - who.x );
    var coef = diffy/diffx;
    
    var x;
    var y;
    
   
    y =   coef;
    x =   1;

    var max = Math.max(Math.abs(x),Math.abs(y));

    y = y/max;
    x = x/max;

    var trueX = x/((Math.abs(x)+Math.abs(y)));
    var trueY = y/((Math.abs(x)+Math.abs(y)));


	this.dir = { "x" :-Math.sign(diffx) * Math.abs(trueX), "y" : -Math.sign(diffy) * Math.abs(trueY)};
	    	this.isMoving = true;

}

Ball.prototype.Shoot = function (x, y, power, effect)
{
	this.power = power;
	this.effect = effect;
	this.dir = { "x" : x, "y" : y};
	this.isMoving = true;
}

Ball.prototype.OnHitWall = function()
{
	this.isMoving = false;
	this.target = null;
	this.controller.Grab(this);
}
