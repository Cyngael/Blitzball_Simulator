

*************************
#BLITZBALL SIMULATOR 
*************************

###Controls : 
	* Arrow to move the player who have the ball
	* Space to open the menu
*************************
###Stats :
	* HP : Health Point, use to perform actions, ALL stats/2 when HP = 0
	* VT : Vitesse, the charactere speed
	
	* PH : Physique, use to resiste tackle (vs AT)
	* AT : Attaque , use to calcul tackle power (vs PH)
	
	* PS : Passe, use to calcul pass power (vs IN)
	* IN : Interception, use to intercept pass or shoot (vs PS or TI)
	* TI : Tir, use to calcul shoot power (vs AR or IN)
	* AR : Arret, use only by the goalKeeper, use to resiste shoot (vs TI)
*************************
###Skills : 
	* Venom : ATK + (3 * skill_lvl); Apply Venom ( continuous loose of HP )
	* Carnage : ATK + (5 * skill_lvl); Apply Carnage ( Big loose of HP )
	* Tse-Tse : ATK + (2 * skill_lvl); Apply Sleep ( Player enable to perform any action for a given time )
	* Saignee : ATK + (1 * skill_lvl); Apply Leech ( Stole an amount of HP )
	* Anti-[X] : cancel the effect of any [X] skill
	* Sphere Shot :
	* Jet Shot :

*************************
*************************
##TODO :
	* Skill Tacles
	* Skill Effects
	* Fumbles ( PS = 0, diff presque egal 0 ...)
	* Match end
	* Exp
	* IA
	* Multi Online