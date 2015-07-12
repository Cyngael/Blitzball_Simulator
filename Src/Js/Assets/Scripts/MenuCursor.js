function MenuCursor(x,y,h,w,steps)
{
	this.x = x;
	this.y = y;
    this.width = w;
    this.height = h;
    this.steps = steps;
    this.currentStep = 0;

	this.color = "#FFFF00";

	this.isActive = true;

	
}

MenuCursor.prototype =
{

    Render: function () 
    { 
    	var cx = ScreenCanvas.Context;
    	cx.beginPath();
		cx.moveTo(this.x,this.y);
		cx.lineTo(this.x + this.width, this.y + this.height/2);
        cx.lineTo(this.x, this.y + this.height);
		cx.closePath();
		cx.fillStyle = this.color;
		cx.fill();


    },
    

    Move: function (x,y) 
    {
        if(y > 0)
            this.currentStep ++;
        else
            this.currentStep --;

        if(this.currentStep >= this.steps)
        {
            this.SetPosition(this.x , this.y - (this.steps-1) * y);
            this.currentStep = 0;
        }
        else if(this.currentStep < 0)
        {
            this.SetPosition(this.x , this.y - (this.steps-1) * y);
            this.currentStep = this.steps - 1;
        }
        else
        {
            this.SetPosition(this.x + x, this.y + y);       
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