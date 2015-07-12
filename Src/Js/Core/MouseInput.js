var MouseInput =
{
    x: null,
    y: null,
    right: false,
    left: false,
    release: true,
    mode: "ACTION",

    Start: function ()
    {

        window.onmousemove = MouseInput.onMouseMove;
        window.onmousedown = MouseInput.onMouseDown;
        window.onmouseup = MouseInput.onMouseUp;
        
    },
    Update: function ()
    {
        if (MouseInput.right) MouseInput.right = false;
        if (MouseInput.left) MouseInput.left = false;
    },

    onMouseMove: function (event)
    {
        /// <summary>Mouse Move Event</summary>
        /// <param name="event" type="MouseEvent">Mouse Move Event</param>

        var bounds = ScreenCanvas.Canvas.getClientRects()[0];

        MouseInput.x = (Math.max(Math.min(event.clientX - bounds.left, bounds.width), 0)) / bounds.width * ScreenCanvas.Canvas.width;
        MouseInput.y = (Math.max(Math.min(event.clientY - bounds.top, bounds.height), 0)) / bounds.height * ScreenCanvas.Canvas.height;
    },

    onMouseDown: function (event)
    {
        /// <summary>Mouse Move Event</summary>
        /// <param name="event" type="MouseEvent">Mouse Move Event</param>

        event.preventDefault();
            MouseInput.release = false;

        switch (event.button)
        {
            case 0:
                MouseInput.left = true;
                break;
            case 2:
                MouseInput.right = true;
                break;
        }

        return false;
    },

    additionCallback: function () { },
    callbackArgs: {},

    shelfDecrease: function () { },
    shelfIncrease: function () { },

    onMouseUp: function (event)
    {
        /// <summary>Mouse Move Event</summary>
        /// <param name="event" type="MouseEvent">Mouse Move Event</param>

        event.preventDefault();

        MouseInput.release = true;

        switch (event.button)
        {
            case 0:
                MouseInput.left = false;
                break;
            case 2:
                MouseInput.right = false;
                break;
        }
        return false;
    },

    onCM: function (event)
    {
        event.preventDefault();
        return false;
    }
}


