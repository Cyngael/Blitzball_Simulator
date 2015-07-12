function GameScene()
{

	Scene.apply(this);
   

    this.players = {"redTeam" : [], "greenTeam" : []};

    this.scores = {"redTeam" : 0, "greenTeam" : 0};

    this.greenColor = "#00FF00";
    this.redColor = "#FF0000";

    this.subStatBars = [];
    this.mainStatBar = null;

    this.activePlayer = null;

    for (var i = 0; i < 6; i++) {
        this.players.redTeam[i] = new Player(50,200 + 25*i, "redTeam", i + "_Bob");
        this.players.greenTeam[i] = new Player(250,200 + 25*i, "greenTeam",i+"_Micheline");
    };

    this.infoTexts = [];

    this.ball = new Ball(50,300);

    this.menuArgs = {};

    this.statSkills = {
        "Carnage" : 5,
        "Venom" : 3,
        "Tse-Tse" : 2,
        "Saignee" : 1
    } 

    this.blockers = [];

}

GameScene.prototype = Object.create(Scene.prototype);

GameScene.prototype.constructor = GameScene;



/*
***********
*FUNCTIONS*
***********
*/

GameScene.prototype.Start = function ()
{

    this.goals = {  
        "redTeam" : {"x" : 0 , "y" : ScreenCanvas.Canvas.height/2, "width" : 20, "height" : 100 },
        "greenTeam" : {"x" : ScreenCanvas.Canvas.width , "y" : ScreenCanvas.Canvas.height/2, "width" : 20, "height" : 100 }
    };


   this.Kickoff();

    this.ball.Start();

    for (var i = 0; i < this.players.redTeam.length; i++) {
        this.players.redTeam[i].Start();
        this.players.greenTeam[i].Start();
    };

    this.players.greenTeam[0].SetGoalKeeper(this.goals.redTeam);
    this.players.redTeam[0].SetGoalKeeper(this.goals.greenTeam);

    this.TakeControl(this.players.greenTeam[1]);
    this.activePlayer.Grab(this.ball);


}
GameScene.prototype.Update = function ()
{

    this.RenderField();


    if(!this.ball.isMoving)
    {
        this.CheckInput();
    }
    else
    {

        if(this.ball.target == "Goal")
            this.CheckGoal();
        else if (this.ball.target != null)
            this.CheckPass();

    }



    for (var i = 0; i < this.players.redTeam.length; i++) 
    {
        if(!this.activeMenu && this.ball.target == null || this.ball.target == "Goal")
        {
            if(this.players.greenTeam[i].isGoalKeeper)
                this.players.greenTeam[i].FollowBall(this.ball);

            if(this.players.redTeam[i].isGoalKeeper)
                this.players.redTeam[i].FollowBall(this.ball);

        }
       
        this.players.redTeam[i].Update();
        this.players.greenTeam[i].Update();

    };

    this.ball.Update();

    if(!!this.activeMenu)
        this.activeMenu.Render();

    this.mainStatBar.Render();

    for (var i = 0; i < this.subStatBars.length; i++) {
        this.subStatBars[i].Render();
    };

    this.RenderScore();

    for (var i = 0; i < this.infoTexts.length; i++) {
        this.infoTexts[i].Render();
    };

}


GameScene.prototype.TakeControl = function (player)
{
    this.activePlayer = player;
    this.mainStatBar = new StatBar(ScreenCanvas.Canvas.width * 0.4, 10, 25, this.activePlayer,"#FFF",["HP","PS","PH","TI"]);
    this.mainStatBar.SetBallRef(this.ball);
    this.subStatBars = [];
    this.blockers = [];

}

GameScene.prototype.SetGoalKeeper = function (player)
{
    player.SetGoalKeeper(this.goals[player.team]);
}

GameScene.prototype.CheckInput = function ()
{

     if(!!this.activeMenu)
     {
            var y = 0;

            if(KeyboardInput.isKeyDown("down")) y ++;
            if(KeyboardInput.isKeyDown("up")) y --;

            if(y!=0)
                this.activeMenu.Move(y);

            KeyboardInput.ExhaustKey("down");
            KeyboardInput.ExhaustKey("up");

            switch(this.activeMenu.name)
            {
                case "chooseAction" :
                    if(KeyboardInput.isKeyDown("space", true))
                    {

                        var rep = this.activeMenu.Validate();

                        switch(rep)
                        {
                            case "Nothing" :
                                this.CloseMenu();
                            break;

                            case "Shoot" :
                                if(this.blockers.length > 0)
                                {
                                    this.menuArgs.menuAfterForcing ="chooseSkillShoot";
                                    this.OpenMenu("forcing");
                                }
                                else
                                {
                                    this.OpenMenu("chooseSkillShoot");
                                    
                                }

                            break;

                            case "Forcing" :
                                this.OpenMenu("forcing");
                            break;

                            case "Pass" :
                                if(this.blockers.length > 0)
                                {
                                    this.menuArgs.menuAfterForcing ="passToWho";
                                    this.OpenMenu("forcing");
                                }
                                else
                                    this.OpenMenu("passToWho");
                            break;
                        }
             
                    } 

                break;

                case "forcing" :


                    if(y!=0 || this.subStatBars.length == 0)
                    {
                        var targetPlayer = [];
                        for (var i = 0; i < this.players[this.activePlayer.otherTeam].length; i++) {
                            if(this.players[this.activePlayer.otherTeam][i].name == this.activeMenu.Validate())
                                targetPlayer.push(this.players[this.activePlayer.otherTeam][i]);
                        };


                        this.CleanSubStatBars();
                        this.AddSubStatBarBlockers();


                    }

                    if(KeyboardInput.isKeyDown("space", true))
                    {

                        var rep = this.activeMenu.Validate();

                        if(rep == "Back")
                        {
                          this.OpenMenu("chooseAction");
                        }
                        else if(rep != "No One")
                        {

                            var PH = this.activePlayer.stats.PH;
                            while (this.blockers.length > 0)
                            {
                                var initPower = PH;
                                PH = Math.max(PH - this.blockers[0].stats.AT,0);

                                this.AddInfoText("PH : " + PH + " ( " + initPower + " - " + this.blockers[0].stats.AT + " AT) by " + this.blockers[0].name);
                                if(PH == 0)
                                {
                                    this.activePlayer.LooseBall();
                                    this.blockers[0].Grab(this.ball);
                                    this.TakeControl(this.blockers[0]);
                                    this.CloseMenu();
                                    break;
                                }
                                else
                                {

                                    var blocker = this.blockers.splice(0,1);

                                    this.CleanSubStatBars();
                                    this.AddSubStatBarBlockers();
                                    console.log(PH)
                                    this.mainStatBar.SimulMajStat("PH",PH);

                                }

                                if(blocker[0].name == rep)
                                {
                                    this.OpenMenu(this.menuArgs.menuAfterForcing); 
                                    break;
                                }
                             
                            };
                        }
                        else
                        {
                            this.OpenMenu(this.menuArgs.menuAfterForcing); 
                        }


                    }
                break;

                case "passToWho" :

                    if(y!=0 || this.subStatBars.length == 0)
                    {
                        var targetPlayer = null;
                        for (var i = 0; i < this.players[this.activePlayer.team].length; i++) {
                            if(this.players[this.activePlayer.team][i].name == this.activeMenu.Validate())
                                targetPlayer = this.players[this.activePlayer.team][i];
                        };
                        if(!!targetPlayer)
                        {
                            this.CleanSubStatBars();
                            this.AddSubStatBarBlockers();
                            this.subStatBars.push(new StatBar(ScreenCanvas.Canvas.width * 0.41, 45 + 30*this.subStatBars.length, 25, targetPlayer,"#FFFF00", ["HP","PS","PH","TI"]));
                        }
                        else
                            this.CleanSubStatBars();

                    }

                    if(KeyboardInput.isKeyDown("space", true))
                    {
                        var rep = this.activeMenu.Validate();
                        if(rep == "Back")
                        {
                            this.CleanSubStatBars();
                            this.OpenMenu("chooseAction");

                        }
                        else
                        {
                            for (var i = 0; i < this.players[this.activePlayer.team].length; i++) 
                            {
                                if(this.players[this.activePlayer.team][i].name == rep)
                                {
                                    
                                    this.OpenMenu("chooseSkillPass");
                                    this.menuArgs.targetPlayerForPass = this.players[this.activePlayer.team][i];
                                    break;
                                }
                            };
                        }

                        
                    }
                break;

                case "chooseSkillPass" :
                    if(y!=0)
                    {
                        var rep = this.activeMenu.Validate();
                        var skillLevel = rep.substring(rep.indexOf(" ") + 1).length;
                        var skillName = rep.substring(0,rep.indexOf(" "));

                        this.mainStatBar.SimulSkill("PS",this.statSkills[skillName] * skillLevel);

                    }
                    else if(KeyboardInput.isKeyDown("space", true))
                    {
                        var rep = this.activeMenu.Validate();
                        if(rep == "Back")
                        {
                            this.CleanSubStatBars();
                            this.OpenMenu("passToWho");

                        }
                        else
                        {

                            if(rep == "Classical")
                            {
                                this.activePlayer.Pass(this.menuArgs.targetPlayerForPass,this.activePlayer.stats.PS);
                                this.mainStatBar.AlterSource("PS"); 

                                this.CloseMenu();
                            }
                            else
                            {
                                var skillLevel = rep.substring(rep.indexOf(" ") + 1).length;
                                var skillName = rep.substring(0,rep.indexOf(" "));
                                this.activePlayer.Pass(this.menuArgs.targetPlayerForPass,this.activePlayer.stats.PS + (this.statSkills[skillName] * skillLevel) , rep);
                                this.mainStatBar.AlterSource("PS");   

                                this.CloseMenu();

                            }

                            this.CheckInterception();


                        }
                    }
                break;

                 case "chooseSkillShoot" :

                    if(y!=0)
                    {
                        var rep = this.activeMenu.Validate();
                        var skillLevel = rep.substring(rep.indexOf(" ") + 1).length;
                        var skillName = rep.substring(0,rep.indexOf(" "));

                        this.mainStatBar.SimulSkill("TI",this.statSkills[skillName] * skillLevel);

                    }
                    else if(KeyboardInput.isKeyDown("space", true))
                    {
                        var rep = this.activeMenu.Validate();
                        if(rep == "Back")
                        {
                            this.CleanSubStatBars();
                            this.OpenMenu("chooseAction");

                        }
                        else
                        {
                            var diffy = ( this.goals[this.activePlayer.team].y - this.activePlayer.y );
                            var diffx = ( this.goals[this.activePlayer.team].x - this.activePlayer.x );
                            var coef = diffy/diffx;
                            
                            var x;
                            var y;
                            

                            y = this.activePlayer.GetSens() * coef;
                            x =  this.activePlayer.GetSens() * 1;

                            var max = Math.max(Math.abs(x),Math.abs(y));

                            y = y/max;
                            x = x/max;

                            var trueX = x/((Math.abs(x)+Math.abs(y)));
                            var trueY = y/((Math.abs(x)+Math.abs(y)));


                          

                            if(rep == "Classical")
                            {
                                this.activePlayer.Shoot(trueX,trueY,this.activePlayer.stats.TI);
                                this.mainStatBar.AlterSource("TI");
                            }
                            else
                            {
                                var skillLevel = rep.substring(rep.indexOf(" ") + 1).length;
                                var skillName = rep.substring(0,rep.indexOf(" "));
                                this.activePlayer.Shoot(trueX,trueY,this.activePlayer.stats.TI + (this.statSkills[skillName] * skillLevel), rep);
                                this.mainStatBar.AlterSource("TI");
 

                            }

                            this.CheckInterception();

                            this.CloseMenu();

                        }
                    }

                  
                break;

            }

           

     }
     else
     {
        if(this.activePlayer.canMove)
        {
            var x = 0;
            var y = 0;

            if(KeyboardInput.isKeyDown("right")) x ++;
            if(KeyboardInput.isKeyDown("left")) x --;
            if(KeyboardInput.isKeyDown("down")) y ++;
            if(KeyboardInput.isKeyDown("up")) y --;

            if(!this.activePlayer.isGoalKeeper)
                this.activePlayer.Move(x,0);
            
            this.activePlayer.Move(0,y);
 
        }

        if(KeyboardInput.isKeyDown("space", true))
        {
            this.activePlayer.Grab(this.ball);
            this.OpenMenu("chooseAction");
        }

     }
     
}
GameScene.prototype.CheckGoal = function()
{

    var goalKeeper =  this.players[this.ball.controller.otherTeam][0];

    //Check  Intercept
    if(Collisions.CheckCollision(this.ball,"Circle", {"x" : goalKeeper.x, "y" : goalKeeper.y, "r" : goalKeeper.range}, "Circle"))
    {
        console.log("Red GoalKeeper Try to catch this shot and ...");
        this.AddInfoText(goalKeeper.stats.AR + " AR vs " + this.ball.power + " TI");

        var winClash = goalKeeper.Clash("AR",this.ball.power) ;
        if(winClash > 0)
        {
            goalKeeper.Grab(this.ball);
            this.TakeControl(goalKeeper);
            console.log("Succed !!");
        }
        else if( winClash == 0)
        {
            console.log("Drive it away !!");
        }
        else
        {
            console.log("Fail completly !! What a shitty goal keeper !!");
            this.Goooaaal(goalKeeper.otherTeam);
        }

    }



    //Check Goal
    if(Collisions.CheckCollision(this.ball,"Circle", this.goals.redTeam, "Box"))
    {
        this.Goooaaal("redTeam");

    }
    else if(Collisions.CheckCollision(this.ball,"Circle", this.goals.greenTeam, "Box"))
    {
        this.Goooaaal("greenTeam");
    }


}

GameScene.prototype.AddSubStatBarBlockers = function()
{
    if(this.blockers.length > 0)
    {
        for (var i = 0; i < this.blockers.length; i++) {
            this.subStatBars.push(new StatBar(ScreenCanvas.Canvas.width * 0.41, 45 + 30*this.subStatBars.length, 25,  this.blockers[i],"#FFFF00", ["HP","IN","AT","TI"]));
        };
    }
}

GameScene.prototype.CheckInterception = function()
{

    for (var i = 0; i < this.blockers.length; i++) {
        var initPower = this.ball.power;

        this.ball.power = Math.max(this.ball.power - this.blockers[i].stats.IN, 0);
        this.AddInfoText("Ball power : " + this.ball.power + " ( " + initPower + " - " + this.blockers[i].stats.IN + " IN) ");

        if(this.ball.power == 0)
        {
            this.blockers[i].Grab(this.ball)
            this.TakeControl(this.blockers[i]);
            break;
        }
    };
}

GameScene.prototype.AddInfoText = function(text)
{
    var infoTxt = new InfoText(text,ScreenCanvas.Canvas.width*0.5 - (text.length * 6) ,ScreenCanvas.Canvas.height/2 - (30*this.infoTexts.length), 25);
    infoTxt.Start();

    this.infoTexts.push(infoTxt);
    setTimeout(this.RemoveInfoText, 5000,infoTxt, this.infoTexts);
}

GameScene.prototype.RemoveInfoText = function(infoText, list)
{
    list.splice(list.indexOf(infoText),1);
}

GameScene.prototype.Kickoff = function()
{
     //AT YOUR POST
    var deviance = this.players.redTeam[1].range;
    this.players.redTeam[1].SetPosition(ScreenCanvas.Canvas.width/2 + deviance, ScreenCanvas.Canvas.height/2);
    this.players.greenTeam[1].SetPosition(ScreenCanvas.Canvas.width/2 -  deviance, ScreenCanvas.Canvas.height/2);

    this.players.greenTeam[2].SetPosition(ScreenCanvas.Canvas.width * 0.25 - deviance , ScreenCanvas.Canvas.height*0.25);
    this.players.redTeam[2].SetPosition(ScreenCanvas.Canvas.width * 0.25 +deviance, ScreenCanvas.Canvas.height*0.25);

    this.players.redTeam[3].SetPosition(ScreenCanvas.Canvas.width * 0.75 + deviance, ScreenCanvas.Canvas.height*0.25);
    this.players.greenTeam[3].SetPosition(ScreenCanvas.Canvas.width * 0.75 - deviance , ScreenCanvas.Canvas.height*0.25);

    this.players.greenTeam[4].SetPosition(ScreenCanvas.Canvas.width * 0.75 - deviance, ScreenCanvas.Canvas.height*0.75);
    this.players.redTeam[4].SetPosition(ScreenCanvas.Canvas.width * 0.75 + deviance , ScreenCanvas.Canvas.height*0.75);

    this.players.greenTeam[5].SetPosition(ScreenCanvas.Canvas.width * 0.25 - deviance, ScreenCanvas.Canvas.height*0.75);
    this.players.redTeam[5].SetPosition(ScreenCanvas.Canvas.width * 0.25 + deviance, ScreenCanvas.Canvas.height*0.75);

}

GameScene.prototype.Goooaaal = function(team)
{
    switch(team)
    {
        case "greenTeam" :
             console.log("Goal for greenTeam !!");
            //Score update
            this.scores.greenTeam++;
            //Kickoff
            this.Kickoff();
            this.players.redTeam[1].Grab(this.ball);
            this.TakeControl(this.players.redTeam[1]); 
        break;

        case "redTeam":
            console.log("Goal for redTeam !!");
            //Score update
            this.scores.redTeam++;

            //Kickoff
            this.Kickoff();
            this.players.greenTeam[1].Grab(this.ball);
            this.TakeControl(this.players.greenTeam[1]);
        break;
    }
}

GameScene.prototype.CheckPass = function()
{
    if(!!this.ball.target && this.ball.isMoving && this.ball.target != "goal")
    {

        for (var i = 0; i < this.players[this.ball.controller.team].length; i++) 
        {
            if(this.players[this.ball.controller.team][i].name == this.ball.target)
            {
                var targetPlayer = this.players[this.ball.controller.team][i];
            }
        };


        if(Collisions.CheckCollision(this.ball,"Circle", targetPlayer, "Circle"))
        {
            targetPlayer.Grab(this.ball);
            this.TakeControl(targetPlayer);
        }
    }
}

GameScene.prototype.CloseMenu = function()
{
    delete this.activeMenu;
    this.mainStatBar.ResetSimul();
    this.menuArgs = {};
}

GameScene.prototype.OpenMenu = function(name)
{
    switch(name)
    {
        case "chooseAction" :
            this.blockers = [];
            for (var i = 0; i < this.players[this.activePlayer.otherTeam].length; i++) 
            {
                if(this.players[this.activePlayer.otherTeam][i].isGoalKeeper)
                    continue;

                if(Collisions.CheckCollision({"x" : this.activePlayer.x, "y" : this.activePlayer.y, "r" : this.activePlayer.range}, "Circle",
                                             {"x" : this.players[this.activePlayer.otherTeam][i].x , "y" : this.players[this.activePlayer.otherTeam][i].y, "r" : this.players[this.activePlayer.team][i].r}, "Circle"))
                {
                    this.blockers.push(this.players[this.activePlayer.otherTeam][i]);
                }
            };
            this.activeMenu = new Menu(50,50,100,["Shoot", "Pass","Nothing"], name);
        break;

        case "forcing" :
            var list = [];
            for (var i = 0; i < this.blockers.length; i++) {
                list.push(this.blockers[i].name);
            };
            list.push("No One");
            list.push("Back");
            this.activeMenu = new Menu(50,50,160,list,name);
        break;

        case "passToWho" :
            var list = [];
            for (var i = 0; i < this.players[this.activePlayer.team].length; i++) 
            {
                if(this.activePlayer != this.players[this.activePlayer.team][i])
                    list.push(this.players[this.activePlayer.team][i].name);
            };
            list.push("Back");
            this.activeMenu = new Menu(50,50,160,list,name);
        break;

        case "chooseSkillShoot" :
            
            this.CleanSubStatBars();

            this.AddSubStatBarBlockers();

            this.subStatBars.push(new StatBar(ScreenCanvas.Canvas.width * 0.41, 45 + 30 * this.subStatBars.length, 25, this.players[this.activePlayer.otherTeam][0],"#FFFF00",["HP","PS","PH","AR"]));
            

            var list = JSON.parse(JSON.stringify(this.activePlayer.skills.shoot));;
            list.push("Back");
            this.activeMenu = new Menu(50,50,100,list, name);
        break;

        case "chooseSkillPass" :
            var list = JSON.parse(JSON.stringify(this.activePlayer.skills.pass));;
            list.push("Back");
            this.activeMenu = new Menu(50,50,100,list, name);
        break;
    }

}

GameScene.prototype.CleanSubStatBars = function()
{
    this.subStatBars = [];

}

GameScene.prototype.RenderField = function ()
{
        var cx = ScreenCanvas.Context;
        cx.beginPath();
        cx.moveTo(ScreenCanvas.Canvas.width,ScreenCanvas.Canvas.height/2 - 50);
        cx.lineTo(ScreenCanvas.Canvas.width - 20,ScreenCanvas.Canvas.height/2 - 50);
        cx.lineTo(ScreenCanvas.Canvas.width - 20,ScreenCanvas.Canvas.height/2 + 50);
        cx.lineTo(ScreenCanvas.Canvas.width,ScreenCanvas.Canvas.height/2 + 50);

        cx.closePath();
        cx.fillStyle = "#FF0000";
        cx.fill();


        cx.beginPath();
        cx.moveTo(0,ScreenCanvas.Canvas.height/2 - 50);
        cx.lineTo(20,ScreenCanvas.Canvas.height/2 - 50);
        cx.lineTo(20,ScreenCanvas.Canvas.height/2 + 50);
        cx.lineTo(0,ScreenCanvas.Canvas.height/2 + 50);

        cx.closePath();
        cx.fillStyle = "#00FF00";
        cx.fill();
}

GameScene.prototype.RenderScore = function ()
{
    var cx = ScreenCanvas.Context;
    cx.font = "40px Verdana";
    cx.fillStyle = this.greenColor;
    cx.fillText(this.scores.greenTeam,ScreenCanvas.Canvas.width *0.82, ScreenCanvas.Canvas.height *0.95);
    cx.fillStyle = "#000";
    cx.fillText(" - ",ScreenCanvas.Canvas.width *0.87, ScreenCanvas.Canvas.height *0.95);
    cx.fillStyle = this.redColor;
    cx.fillText(this.scores.redTeam,ScreenCanvas.Canvas.width *0.92, ScreenCanvas.Canvas.height *0.95);


}


