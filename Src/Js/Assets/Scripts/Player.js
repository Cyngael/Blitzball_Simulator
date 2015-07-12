function Player(x,y,team, name)
{
    
	Movable.apply(this,[x,y]);


	this.range = this.r * 5;

	this.team = team;

	this.name = name || "Bob";

	if(this.team == "redTeam")
	{
		this.otherTeam = "greenTeam";
		this.color = "#FF0000";
	}
	else
	{
		this.otherTeam = "redTeam";
		this.color = "#00FF00";
	}

	this.canMove = true;

	this.ball = null;

	/*BLITZ PARAMS*/
	this.stats = {};
	this.stats.HP = 100; 										//Health Point : mana
	this.stats.VT = 10 + Math.round(Math.random() * 5);		//Vitesse : Vitesse de deplacement
	this.stats.AT = 10 + Math.round(Math.random() * 5);		//Attaque : potentiel de tacle
	this.stats.PH = 35 + Math.round(Math.random() * 5);		//Physique : resistance au tacle
	this.stats.PS = 15 + Math.round(Math.random() * 5);		//Passe : potentiel de passe
	this.stats.IN = 5 + Math.round(Math.random() * 5);		//Interception : potentiel de bloquer des passes
	this.stats.TI = 10 + Math.round(Math.random() * 5);		//Tir : potentiel pour marquer, opposable a IN et AR
	this.stats.AR = 1  + Math.round(Math.random() * 3);		//Arret : potentiel d'arret de tir par le goal

	this.skills = {"shoot" : ["Classical"], "pass" : ["Classical"], "tackle" : ["Classical"],"anti" : []};

	this.skills.shoot.push("Tse-Tse II");
	this.skills.shoot.push("Venom I");
	this.skills.pass.push("Carnage III");
	this.skills.tackle.push("Saignee II");

	this.skills.anti.push("Venom II");


	this.isGoalKeeper = false;


}

Player.prototype = Object.create(Movable.prototype);

Player.prototype.constructor = Player;


Player.prototype.Start = function()
{

}

Player.prototype.Render = function () 
{ 
	var cx = ScreenCanvas.Context;
	cx.beginPath();
	cx.moveTo(this.x,this.y);
	cx.arc(this.x, this.y, this.r, Math.PI * 2,false)
	cx.closePath();
	cx.fillStyle = this.color;
	cx.fill();

	if(this.isGoalKeeper)
		cx.stroke();
	
	cx.font = "10px Verdana";
	cx.fillStyle = "#FFF";
	cx.fillText(this.name,this.x,this.y - this.r);


	//Range
	if(this.isGoalKeeper || !!this.ball)
	{
		cx.beginPath();
		cx.moveTo(this.x + this.range,this.y);
		cx.arc(this.x, this.y, this.range, Math.PI * 2,false)
		cx.closePath();
		cx.stroke();
	
	}


}

Player.prototype.Update= function () 
{ 

	if(this.isActive)
	{
		this.Render(); 

		if(this.isGoalKeeper)
		{
			if(this.y > this.goal.y + this.goal.height/2)
				this.y = this.goal.y + this.goal.height/2;
			if(this.y < this.goal.y - this.goal.height/2)
				this.y = this.goal.y - this.goal.height/2;
		}
	}
}

Player.prototype.LooseBall = function()
{
	if(!!this.ball)
		this.ball = null;
}

Player.prototype.Grab = function (ball)
{
	if(!!ball)
		ball.GrabBy(this);

	this.ball = ball;
}

Player.prototype.Pass = function (who,power, effect)
{

	if(!!this.ball)
		this.ball.Pass(who,power, effect);

	this.ball = null;
}

Player.prototype.Shoot = function (x,y,power,effect)
{

	if(!!this.ball)
	{
		this.ball.target = "Goal";
		this.ball.Shoot(x,y,power,effect);
	}


	this.ball = null;

}



//1 => WIN
//0 => TIE
//-1 => LOOSE
Player.prototype.Clash = function(myStat,hisStat)
{
	var my =Math.addNoise(this.stats[myStat],0,0.25);
	var his = Math.addNoise(hisStat,0.25,0);

	console.log("Goal : ", my, "  VS  : " , his)

	return Math.sign(my - his);
}

Player.prototype.SetGoalKeeper = function (goal)
{
	this.isGoalKeeper = true;
	this.goal = goal;
	this.speed = 1;
	this.name += "(Goal)";
	this.stats.AR += 10;
	this.stats.TI -= 5;


	this.range *= 0.65;

	this.SetPosition(this.goal.x + ((this.r + this.goal.width) * this.GetSens()), this.goal.y);
}

Player.prototype.FollowBall = function (ball)
{
	if(this.isGoalKeeper && (ball.controller != null || ball.isMoving) && this.ball == null)
	{
		if(this.y < this.goal.y + this.goal.height/2 && this.y < ball.y)
		{
			this.Move(0,1);
		}
		else if (this.y > this.goal.y - this.goal.height/2 && this.y > ball.y)
		{
			this.Move(0,-1);
		}
	}
}

Player.prototype.GetSens = function()
{
 	return (this.team == "greenTeam") ? 1 : -1;
}


