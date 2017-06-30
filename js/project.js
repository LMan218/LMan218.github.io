/****************** Variables ******************/
var height = 700;
var width = 700;
var golfBall;
var player;
var player2;
var shopButton;
var characters;
var pauseButton;
var paused = true;
var ai = false;
var shopOptions;
/********************* Setup ********************/
var background = new Raster("images/golfPongBackground.jpg", [350, 350]);


golfBall = new Object({
    skin: new Raster("images/golfBallClipArt.gif", [350, 350]),
    xSpeed:-5,
    ySpeed:1,
    
});

player = new Object({
    skin: new Raster("images/penguinArt.png", [50, 350]),
    speed: 5,
    score: 0,
    scoreDisplay: new PointText({
                    point: [15, 50],
                    content: "P1\n0",
                    fillColor: '#007700',
                    fontSize: 25,
                    style: {justification:'center'}
                }), 
});

player2 = new Object({
    skin: new Raster("images/penguinArt.png", [650, 350]),
    speed: 5,
    aispeed: 4.9,
    score: 0,
    scoreDisplay: new PointText({
                    point: [50, 50],
                    content: "P2\n0",
                    fillColor: '#007700',
                    fontSize: 25,
                    style: {justification:'center'}
                }), 
});

/****************** Shop ****************/

function newShopOption(animal, xy) {
    obj = new Object({
        skin: new Raster("images/" + animal + "Art.png", xy),
    });
    obj.skin.onClick = function(event) {
        swapPlayerSkins(player, "images/" + animal + "Art.png");
        swapPlayerSkins(player2, "images/" + animal + "Art.png");
    }
    return obj;
}

shopOptions = [
    newShopOption("penguin",     [200, -200]),
    newShopOption("owl",         [300, -200]),
    newShopOption("marshmallow", [400, -200]),
    newShopOption("cow",         [500, -200]),
    newShopOption("elephant",    [200, -300]),
    newShopOption("panda",       [300, -300]),
    newShopOption("pig",         [400, -300]),
    newShopOption("goat",        [500, -300]),
    newShopOption("squirrel",    [300, -400]),
    newShopOption("octopus",     [400, -400]),
]

shopButton = new Object({
    skin: new Raster("images/shopSignCartoon.png", [325, 50]),
});

var shop = false;
 shopButton.skin.onClick = function(event) {
     paused = true;
     for (var i = 0; i < shopOptions.length; i++) {
         shopOptions[i].skin.position.y *= -1;
     }
 }

 

pauseButton = new Object({
    skin: new Raster("images/pauseButton.png", [625, 50]),
});

 pauseButton.skin.onClick = function(event) {
     paused = !paused;
 }

 


function swapPlayerSkins(p, newSkin) {
    // Save the stuff we want to keep
    var position = p.skin.position;
    var controls = p.skin.onFrame;
    
    // Get rid of the old skin
    p.skin.remove();
    
    // Create the new skin
    var newSkin = new Raster(newSkin, position);
    newSkin.height = 100;
    newSkin.width = 100;
    newSkin.onFrame = controls;
    
    // Set the new skin into player
    p.skin = newSkin;
}

 
/****************** Player One ******************/
player.skin.onFrame = function(event) {
    if (ai) {
        if (Key.isDown('down') && player.skin.position.y < height - 50) {
            paused = false;
            player.skin.position.y += player.speed;
        } else if (Key.isDown('up') && player.skin.position.y > 50) {
            paused = false;
            player.skin.position.y += player.speed * -1;
        }
    } else {
        if (Key.isDown('s') && player.skin.position.y < height - 50) {
            paused = false;
            player.skin.position.y += player.speed;
        } else if (Key.isDown('w') && player.skin.position.y > 50) {
            paused = false;
            player.skin.position.y += player.speed * -1;
        }
    }
    
}
 
/****************** Player Two ******************/
function aiDown() {
    return golfBall.skin.position.y > player2.skin.position.y;
}

function aiUp() {
    return golfBall.skin.position.y < player2.skin.position.y;
}

var jiggle = false;
function aiSpeed() {
    if (jiggle) {
        return player2.aispeed;
    } else {
        return Math.min(player2.aispeed, Math.abs(golfBall.ySpeed));
    }
}

 player2.skin.onFrame = function(event) {
     if (ai) {
        if (!paused) {
            if (aiDown() && player2.skin.position.y < height - 50) {
                player2.skin.position.y += aiSpeed();
            } else if (aiUp() && player2.skin.position.y > 50) {
                player2.skin.position.y += aiSpeed() * -1;
            }
        }
     } else {
         if (Key.isDown('down') && player2.skin.position.y < height - 50) {
            paused = false;
            player2.skin.position.y += player2.speed;
        } else if (Key.isDown('up') && player2.skin.position.y > 50) {
            paused = false;
            player2.skin.position.y += player2.speed * -1;
        }
     }
}


 
/****************** Game Start ******************/
 function randomAISkin() {
    
}

function resetGame() {
    golfBall.skin.position = [350, 350];
    if (Math.random() < 0.5) {
        golfBall.xSpeed = -5;
    } else {
        golfBall.xSpeed = 5;
    }
    golfBall.ySpeed = Math.random() * 4 - 2;
    player.skin.position = [50, 350];
    player2.skin.position = [650, 350];
}
 
function collisionCheck() {
    var playerHitbox = player.skin.bounds;
    var player2Hitbox = player2.skin.bounds;
    var golfBallHitbox = golfBall.skin.bounds;
    
    if (playerHitbox.intersects(golfBallHitbox)) {
        golfBall.xSpeed = Math.abs(golfBall.xSpeed);
        golfBall.ySpeed = .1 * (golfBall.skin.position.y-player.skin.position.y);
    }
    
    if (player2Hitbox.intersects(golfBallHitbox)) {
        golfBall.xSpeed = -1*Math.abs(golfBall.xSpeed);
        golfBall.ySpeed = .1 * (golfBall.skin.position.y-player2.skin.position.y);
    }
    
    // bounce golfBall
    if (golfBall.skin.position.y < 0) {
        golfBall.ySpeed = Math.abs(golfBall.ySpeed);
    } else if (golfBall.skin.position.x < 0) {
        // golfBall.xSpeed = Math.abs(golfBall.xSpeed);
        // GOAL CODE HERE P1
        player2.score += 1;
        player2.scoreDisplay.content = "P2\n" + player2.score;
        resetGame();
    } else if (golfBall.skin.position.y > height) {
        golfBall.ySpeed = -1*Math.abs(golfBall.ySpeed);
    } else if (golfBall.skin.position.x > width) {
        // golfBall.xSpeed = -1*Math.abs(golfBall.xSpeed);
        // GOAL CODE HERE P2
        player.score += 1;
        player.scoreDisplay.content = "P1\n" + player.score;
        resetGame();
    }
}
  
/******************* Game Play ******************/
function onFrame(event) {
    if (!paused) {
        golfBall.skin.position.x += golfBall.xSpeed;
        golfBall.skin.position.y += golfBall.ySpeed;
    }
    collisionCheck();
}
