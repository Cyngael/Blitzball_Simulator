function InfoText(text,x,y,size,lifeTime)
{
    this.text = text;
	this.x = x;
	this.y = y;
    this.size = size;
    this.lifeTime = lifeTime;


	this.color = "#FFFF00";

	this.isActive = true;

	
}

InfoText.prototype =
{

    Start : function ()
    {
        this.SetActive(true);
    },
    Render: function () 
    { 
        if(this.isActive)
        {
            var cx = ScreenCanvas.Context;
            cx.font = this.size +"px Verdana";
            cx.fillStyle = this.color;
            cx.fillText(this.text,this.x,this.y);
        }
    	
    },
    

    Move: function (x,y) 
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