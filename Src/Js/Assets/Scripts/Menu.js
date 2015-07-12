function Menu(x,y,w, inputList, name)
{
	this.x = x;
	this.y = y;
    this.width = w;

    this.inputList = inputList;


    this.padding = {"x" : 5 , "y" : 30};


    this.height = (this.inputList.length * 50) + (this.padding.x * 2);

	this.color = "#FF0000";

	this.isActive = true;
    this.name = name || "default";

    this.subBars = [];


    this.cursor = new MenuCursor(this.x + this.padding.x,this.y + 20, 10,5, this.inputList.length);


}

Menu.prototype =
{

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
        this.cursor.Render();


        cx.font = "15px Verdana";
        for (var i = 0; i < this.inputList.length; i++) {
            cx.fillText(this.inputList[i], this.x + this.padding.x + 8 , this.y + this.padding.y + (i * this.offset) );
        };

        cx.fillText(this.name, this.x  , this.y );


    },
    

    Move: function (down) 
    {
    	this.cursor.Move(0,down * this.offset);
    },
    Validate : function()
    {
        return this.inputList[this.cursor.currentStep];
    },
    SetPosition: function(x, y)
    {
    	this.x = x;
    	this.y = y;
    },
    SetActive: function(active)
    {
    	this.isActive = active;
    },
    get offset()
    {
        return this.height / this.inputList.length;
    }
}