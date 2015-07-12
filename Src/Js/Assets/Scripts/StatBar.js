function StatBar(x,y,h,player, haloColor, statList)
{
	this.x = x;
	this.y = y;
    this.height = h;

    this.player = player;

    this.haloColor = haloColor|| "#FFF";


    this.padding = {"x" : 5 , "y" : 5};


    this.width = 420;

	this.color = this.player.color;

	this.isActive = true;

    this.HP = this.player.stats.HP;
    this.VT = this.player.stats.VT;
    this.PH = this.player.stats.PH;
    this.AT = this.player.stats.AT;
    this.PS = this.player.stats.PS;
    this.IN = this.player.stats.IN;
    this.TI = this.player.stats.TI;
    this.AR = this.player.stats.AR;

    this.statList = statList;

    this.simulatedStat = 
    {
        "HP" : null,
        "VT" : null,
        "PH" : null,
        "AT" : null,
        "PS" : null,
        "IN" : null,
        "TI" : null,
        "AR" : null
    };

}

StatBar.prototype =
{
    SimulSkill : function(stat,mod)
    {
        this.simulatedStat[stat] = this[stat] + mod;
    },
    SimulMajStat : function(stat,mod)
    {
        this.simulatedStat[stat] =  mod;
    },
    ResetSimul : function ()
    {
        this.simulatedStat = 
        {
            "HP" : null,
            "VT" : null,
            "PH" : null,
            "AT" : null,
            "PS" : null,
            "IN" : null,
            "TI" : null,
            "AR" : null
        };

    },
    AlterSource: function(stat)
    {
        this[stat] = null;
        this.ResetSimul();
    },
    SetBallRef:function(ball)
    {
        this.ball = ball;
    },
    Render: function () 
    { 
    	var cx = ScreenCanvas.Context;
    	cx.beginPath();
		cx.moveTo(this.x,this.y);
        cx.lineTo(this.x + this.width, this.y);
        cx.lineTo(this.x + this.width, this.y + this.height);
        cx.lineTo(this.x, this.y + this.height);
		cx.closePath();
		cx.fillStyle = this.color;
		cx.fill();
		cx.stroke();

        cx.beginPath();
        cx.moveTo(this.player.x + this.player.r,this.player.y);
        cx.arc(this.player.x , this.player.y, this.player.r, Math.PI * 2,false)
        cx.closePath();
        cx.lineWidth = 3;
        cx.strokeStyle = this.haloColor;
        cx.stroke();
        cx.lineWidth = 1;
        cx.strokeStyle = "#000";


        cx.font = "15px Verdana";
        cx.fillStyle = "#000";

        cx.fillText(this.player.name, this.x + this.padding.x , this.y + this.padding.y + 12);
        if(this.simulatedStat.HP || !this.HP){ cx.fillStyle = "#aaa"; }else if (cx.fillStyle != "#000"){ cx.fillStyle = "#000"; };
        cx.fillText(" | HP : " + this.HP, this.x + this.padding.x +105 , this.y + this.padding.y + 12);
       
       


        if(!!this.statList && this.statList.indexOf("IN") >= 0)
        {
            if(this.simulatedStat.IN || !this.IN){ cx.fillStyle = "#aaa"; }else if (cx.fillStyle != "#000"){ cx.fillStyle = "#000"; };
            cx.fillText(" | IN : " + (this.simulatedStat.IN || this.IN) , this.x + this.padding.x +185, this.y + this.padding.y + 12);     
        }
        else
        {
             if(this.simulatedStat.PS || !this.PS){ cx.fillStyle = "#aaa"; }else if (cx.fillStyle != "#000"){ cx.fillStyle = "#000"; };
             cx.fillText(" | PS : " + (this.simulatedStat.PS || this.PS || this.ball.power), this.x + this.padding.x +185, this.y + this.padding.y + 12);          
        }


        if(!!this.statList && this.statList.indexOf("AT") >= 0)
        {
            if(this.simulatedStat.AT || !this.AT){ cx.fillStyle = "#aaa"; }else if (cx.fillStyle != "#000"){ cx.fillStyle = "#000"; };
            cx.fillText(" | AT : " + (this.simulatedStat.AT || this.AT) , this.x + this.padding.x +260, this.y + this.padding.y + 12);     
        }
        else
        {
            if(this.simulatedStat.PH || !this.PH){ cx.fillStyle = "#aaa"; }else if (cx.fillStyle != "#000"){ cx.fillStyle = "#000"; };
            cx.fillText(" | PH : " + (this.simulatedStat.PH || this.PH) , this.x + this.padding.x +260, this.y + this.padding.y + 12);            
        }

        if(this.player.isGoalKeeper && !this.ball)
        {
            if(this.simulatedStat.AR || !this.AR){ cx.fillStyle = "#aaa"; }else if (cx.fillStyle != "#000"){ cx.fillStyle = "#000"; };
            cx.fillText(" | AR : " + (this.simulatedStat.AR || this.AR || this.ball.power), this.x + this.padding.x +335, this.y + this.padding.y + 12);
        }
        else
        {
            if(this.simulatedStat.TI || !this.TI){ cx.fillStyle = "#aaa"; }else if (cx.fillStyle != "#000"){ cx.fillStyle = "#000"; };
            cx.fillText(" | TI : " + (this.simulatedStat.TI || this.TI || this.ball.power), this.x + this.padding.x +335, this.y + this.padding.y + 12);
        }

        


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