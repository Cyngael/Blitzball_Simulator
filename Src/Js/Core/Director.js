var Director = (new function ()
{
    var currentScene = null;
    var tick = null;

    var that =
    {
        Start: function ()
        {
            !!currentScene && currentScene.Start();

            that.Update();
        },

        Update: function ()
        {
            ScreenCanvas.Clear();

            !!currentScene && currentScene.Update();

            MouseInput.Update();
            KeyboardInput.Update();


            tick = requestAnimationFrame(that.Update);
        },

        changeScene: function(scn)
        {
            that.scene = scn;
            cancelAnimationFrame(tick);
            that.Start();
        },

        get scene()
        {
            return currentScene;
        },

        set scene(scn)
        {
            //if(currentScene != null) delete currentScene;
            currentScene = scn;
        }
    }

    return that;
}());