let thingX
let thingY
let config = {
     /*  -==+ Debug +==-  */
     

     
     //Good Luck! -jahames
     levelToLoad: "levels/Sigma.json"
     ,
     ShowFps: true
     ,
     quickLaunch:false
     ,
     quickLaunchOnline:true
     ,
     ShowDeltaTime: false
     ,
     //THIS IS DEPRECATED AND WILL CRASH THE GAME DUE TO THE CODE BEING REMOVED
     //animationTester: false,
     
     /*  -==+ Display +==-  */

     //the Resolution the game is played in set in width of the screen.Height is auto calculated ==Type Int
     // default: 600
     Resolution: 600
     ,
     //Sets the max frame rate set to null for no limit or type Int to set.Please note that most browsers automatically limit it to 60 fps meaning values higher than 60 may have no effect.==null,Type Int
     //Default: 60
     MaxFrameRate: 60
     ,
     //If the tile grid is active ==true,false
     //Default:false
     showGrid: false
     ,
     //If particles should be rendered or not ==true,false
     // default:true
     //Dev Note:NOT WORKING
     showParticles: true
     ,
     //If the screen should be stretched to fit(true) or maintain aspect ratio(false) ==true,false
     // default:false
     //Dev Note:NOT WORKING
     StretchScreen: false
     ,
     /* -==+ Charactor Controller +==-  */
     //The multipliers for the walljump x and y respectivly.Lower values will weaken wallJumps and larger ones will stregthen them. ==Type Int
     //Default:1,1
     WallJumpX: 1
     ,
     WallJumpY: 1
     ,
     //Player Jump Height modifier
     JumpHeight: 1
     ,
     //The Player's max speed. Be cautious as anything more than 20 is 
     PlayerMaxSpeed: 15
     ,
     /* -==+ Gameplay +==-  */

     //Optimizes collisions.Highly increases performence but clipping could happen if the player is moving too fast
     OptimizeCollisions: true



}
