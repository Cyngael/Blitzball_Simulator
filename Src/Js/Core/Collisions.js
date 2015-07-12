var Collisions = (new function ()
{

	this.colliderList = {};

	/*
	void RegisterCollider : Register an object to check collision with in CheckCollisionList 
		=>	o : Object to register
		=>	listName : in wich list to register "o"
	*/
	this.RegisterCollider = function(o, listName)
	{

		if(Object.keys(this.colliderList).indexOf(listName) != -1)
		{
			if(this.colliderList[listName].indexOf(o) == -1) 
				this.colliderList[listName].push(o);
		}
		else
		{
			this.colliderList[listName] = [o];
		}	

	}

	/*
	bool CheckCollisionList : Test if an object "o" collide with any object of the list named "listName"
		=>	o : Object you want to test
		=>	listName : the name of the list to check
	*/
	this.CheckCollisionList = function(o, listName)
	{
		if(Object.keys(this.colliderList).indexOf(listName) != -1)
		{
			for(var i = 0 ; i < this.colliderList[listName].length; i++)
			{
				if(o !== this.colliderList[listName][i])
				{
					if(this.CheckCollision(o,o.collisionType, this.colliderList[listName][i],this.colliderList[listName][i].collisionType)) 
						return true;
				}
			}
		}

		return false;		
	}


	/*
	bool CheckCollision : Test if an object "o1" collide with an object "o2"
		=>	o1 : Object you want to test
		=>	colType1 : type of collider for "o1"
		=>	o2 : 2nd Object you want to test
		=>	colType2 : type of collider for "o2"
	colType can be : "Circle" , "Point" or "Box"

	*/
	this.CheckCollision = function (o1,colType1, o2, colType2)
	{
		var colli = false;

		switch(colType1)
		{
			case "Circle" :
				switch(colType2)
				{
					case "Circle" :
						colli = this.CircleCircle(o1.x,o1.y,o1.r,o2.x,o2.y,o2.r);
					break;

					case "Point" :
						colli = this.CirclePoint(o1.x,o1.y,o2.x,o2.y,o2.r);
					break;

					case "Box" :
						colli = this.CircleBox(o1.x,o1.y,o1.r,o2.x,o2.y,o2.width,o2.height);
					break;
				}
			break;

			case "Point" :
				switch(colType2)
				{
					case "Circle" :
						colli = this.CircleCircle(o1.x,o1.y,o1.r,o2.x,o2.y,o2.r);
					break;

				}
			break;

			case "Box" :
				switch(colType2)
				{
					case "Circle" :
						colli = this.CircleCircle(o1.x,o1.y,o1.r,o2.x,o2.y,o2.r);
					break;

				}
			break;
		}


		//if(colli)console.log("Collision with ", o2)
		return colli;
	}

	//Return true si point inside circle
	this.CirclePoint = function (xp, yp, xc, yc, size)
    {
        var X = xp - xc;
        var Y = yp - yc;

        return Math.sqrt(X * X + Y * Y) < size
    }

	//Return true si circle cross circle
	this.CircleCircle = function (x1, y1, r1, x2, y2, r2)
    {
       return this.CirclePoint(x1,y1, x2, y2, r1 + r2);
    }

    //Return true si circle cross box
    this.CircleBox = function(xc, yc, rc, xb, yb, wb, hb)
    {

    	var circleDistance = {};

	 	circleDistance.x = Math.abs(xc - xb);
	    circleDistance.y = Math.abs(yc - yb);

	    if (circleDistance.x > (wb/2 + rc)) { return false; }
	    if (circleDistance.y > (hb/2 + rc)) { return false; }

	    if (circleDistance.x <= (wb/2)) { return true; } 
	    if (circleDistance.y <= (hb/2)) { return true; }

	    var cornerDistance_sq = (circleDistance.x - wb/2)^2 +
	                         (circleDistance.y - hb/2)^2;

	    return (cornerDistance_sq <= (rc^2));
    }



	/**
	 * @author Joseph Lenton - PlayMyCode.com
	 *
	 * @param first An ImageData object from the first image we are colliding with.
	 * @param x The x location of 'first'.
	 * @param y The y location of 'first'.
	 * @param other An ImageData object from the second image involved in the collision check.
	 * @param x2 The x location of 'other'.
	 * @param y2 The y location of 'other'.
	 * @param isCentred True if the locations refer to the centre of 'first' and 'other', false to specify the top left corner.
	 */
	this.isPixelCollision = function ( first, x, y, other, x2, y2, isCentred )
	{
	    // we need to avoid using floats, as were doing array lookups
	    x  = Math.round( x );
	    y  = Math.round( y );
	    x2 = Math.round( x2 );
	    y2 = Math.round( y2 );

	    var w  = first.width,
	        h  = first.height,
	        w2 = other.width,
	        h2 = other.height ;

	    // deal with the image being centred
	    if ( isCentred ) {
	        // fast rounding, but positive only
	        x  -= ( w/2 + 0.5) << 0
	        y  -= ( h/2 + 0.5) << 0
	        x2 -= (w2/2 + 0.5) << 0
	        y2 -= (h2/2 + 0.5) << 0
	    }

	    // find the top left and bottom right corners of overlapping area
	    var xMin = Math.max( x, x2 ),
	        yMin = Math.max( y, y2 ),
	        xMax = Math.min( x+w, x2+w2 ),
	        yMax = Math.min( y+h, y2+h2 );

	    // Sanity collision check, we ensure that the top-left corner is both
	    // above and to the left of the bottom-right corner.
	    if ( xMin >= xMax || yMin >= yMax ) {
	        return false;
	    }

	    var xDiff = xMax - xMin,
	        yDiff = yMax - yMin;

	    // get the pixels out from the images
	    var pixels  = first.data,
	        pixels2 = other.data;

	    // if the area is really small,
	    // then just perform a normal image collision check
	    if ( xDiff < 4 && yDiff < 4 ) {
	        for ( var pixelX = xMin; pixelX < xMax; pixelX++ ) {
	            for ( var pixelY = yMin; pixelY < yMax; pixelY++ ) {
	                if (
	                        ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
	                        ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
	                ) {
	                    return true;
	                }
	            }
	        }
	    } else {
	        /* What is this doing?
	         * It is iterating over the overlapping area,
	         * across the x then y the,
	         * checking if the pixels are on top of this.
	         *
	         * What is special is that it increments by incX or incY,
	         * allowing it to quickly jump across the image in large increments
	         * rather then slowly going pixel by pixel.
	         *
	         * This makes it more likely to find a colliding pixel early.
	         */

	        // Work out the increments,
	        // it's a third, but ensure we don't get a tiny
	        // slither of an area for the last iteration (using fast ceil).
	        var incX = xDiff / 3.0,
	            incY = yDiff / 3.0;
	        incX = (~~incX === incX) ? incX : (incX+1 | 0);
	        incY = (~~incY === incY) ? incY : (incY+1 | 0);

	        for ( var offsetY = 0; offsetY < incY; offsetY++ ) {
	            for ( var offsetX = 0; offsetX < incX; offsetX++ ) {
	                for ( var pixelY = yMin+offsetY; pixelY < yMax; pixelY += incY ) {
	                    for ( var pixelX = xMin+offsetX; pixelX < xMax; pixelX += incX ) {
	                        if (
	                                ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
	                                ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
	                        ) {
	                            return true;
	                        }
	                    }
	                }
	            }
	        }
	    }

	    return false;
	}
}());