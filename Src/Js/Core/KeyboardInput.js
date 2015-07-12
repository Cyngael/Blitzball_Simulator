var KeyboardInput = 
{

	inputRegistered : {},

	Start: function()
	{
	    window.onkeydown = KeyboardInput.onKeyDown;
    	window.onkeyup = KeyboardInput.onKeyUp;

		KeyboardInput.RegisterInputKey("left", 37);
		KeyboardInput.RegisterInputKey("up", 38);
		KeyboardInput.RegisterInputKey("right", 39);
		KeyboardInput.RegisterInputKey("down", 40);

		KeyboardInput.RegisterInputKey("space", 32);

	},
	Update: function()
	{


	},
	RegisterInputKey: function(name, keyCode)
	{
		KeyboardInput.inputRegistered[name] = {"keyCode" : keyCode, "pushed" : false};
	},
	ExhaustKey: function(name)
	{
		KeyboardInput.inputRegistered[name].pushed = false;
	},
	isKeyDown:function(name, autoExhaust)
	{
		var ret = KeyboardInput.inputRegistered[name].pushed;
		if(autoExhaust) KeyboardInput.ExhaustKey(name);

		return ret; 
	},
	onKeyDown: function(event)
	{
		for(i in KeyboardInput.inputRegistered) {
			if(KeyboardInput.inputRegistered[i].keyCode == event.keyCode)
				KeyboardInput.inputRegistered[i].pushed = true;
		};
	},
	onKeyUp: function(event)
	{
		for(i in KeyboardInput.inputRegistered) {
			if(KeyboardInput.inputRegistered[i].keyCode == event.keyCode)
				KeyboardInput.inputRegistered[i].pushed = false;
		};

	}
};


