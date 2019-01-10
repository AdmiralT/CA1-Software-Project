class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
        this.active;
        this.currentScene;

        this.menubg;
    }

    preload() {
        this.load.image('menubg', 'assets/mainMenu.png');
        this.load.image('button', 'assets/startButton.png');
        this.load.image('options', 'assets/optionsButton.png');

    }
    create() {
        let menubg = this.add.sprite(0, 0, 'menubg');
        let button = this.add.sprite(200, 200, 'button');
        let options = this.add.sprite(450, 0, 'options');
        menubg.setOrigin(0, 0);
        button.setOrigin(0, 0);
        options.setOrigin(0, 0);
        button.setInteractive();
        options.setInteractive();
        button.on('pointerdown', () => this.scene.start('Game'));
        options.on('pointerdown', () => menu_music.stop());




    }
}
let gameScene = new Phaser.Scene('Game');



gameScene.init = function () {
    this.playerSpeed = 5;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;
    this.treasureMaxY = 320;
    this.treasureMinY = 0;

}

var score = 0; //variables for the score function 
var scoreText;

var timedEvent;
var player;


// create a new game, pass the configuration


gameScene.preload = function () {

    this.load.image('background1', 'assets/background2.png'); //loads the background image
    this.load.image('player', 'assets/MrPinchy.png'); //loads the player sprite and assigns it to player
    this.load.image('enemy1', 'assets/Seagull.png'); //loads the enemy sprite and assigns it to enemy
    this.load.image('treasure', 'assets/PlanktonTrophy.png'); //loads collectable trophy and assigns it to the treasure 



};


gameScene.create = function () {

    let bg = this.add.sprite(0, 0, 'background1'); /*load background and set its origin point to the top left corner*/
    bg.setOrigin(0, 0);

    this.player = this.physics.add.sprite(300, this.sys.game.config.height / 1.3, 'player'); /*adds sprite for the player, sets the height*/
    this.player.setScale(0.4);
    this.player.body.allowGravity = false;



    this.treasure = this.physics.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
    this.treasure.setScale(0.4); /*sets the treasure's height, its size and its speed'*/
    this.treasure.treasureSpeed = 0.8;


    this.enemies = this.physics.add.group({ /*adds a group of enemies that are repeating across the screen*/
        key: 'enemy1',
        repeat: 3,
        setXY: {
            x: 30,
            y: 100,
            stepX: 200,
            stepY: 40
        }
    })



    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);


    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.speed = (Math.random() * 1) + 0.3;     /*sets the speed of the enemy's movement across the group*/
        
        enemy.body.allowGravity = false;
    }, this);

    this.isPlayerAlive = true;
    scoreText = this.add.text(16, 16, 'Food Collected: ', {
        fontSize: '32px',
        fill: '#000'
    });

    this.treasures = this.physics.add.group({    /*creates a group for treasures and repeats them*/
        key: 'treasure',
        repeat: 4,
        setXY: {
            x: 0,
            y: 50,
            stepX: 150,
            stepY: 50

        }
    })

    Phaser.Actions.Call(this.treasures.getChildren(), function (treasure) {
        treasure.speed = this.treasure.treasureSpeed; /*similar to enemies, this sets the speed of the treasure acrossthe entire group and also sets the requirements for allowing the player to pass through the treasure and increment the score when it does*/
        treasure.treasureSpeed += .2;
        treasure.body.allowGravity = false;
    }, this);
    this.physics.add.overlap(this.player, this.treasures, collectPlankton, null, this);

};


// this is called up to 60 times per second
gameScene.update = function () {
    if (this.input.activePointer.downX > 300) {    /*sets the coordinates for movement using the pointer*/
        this.player.x += this.playerSpeed;
    } else if (this.input.activePointer.downX < 150) {

        this.player.x -= this.playerSpeed;
    }

    let treasures = this.treasures.getChildren();
    let numTreasures = treasures.length;
    for (let i = 0; i < numTreasures; i++) {

        // move enemies
        treasures[i].y += treasures[i].speed;
        if (treasures[i].y >= this.treasureMaxY && treasures[i].speed > 0) {
            treasures[i].speed *= -1;
        } else if (treasures[i].y <= this.treasureMinY && treasures[i].speed < 0) {
            treasures[i].speed *= -1;
        }


        let enemies = this.enemies.getChildren();
        let numEnemies = enemies.length;
        for (let i = 0; i < numEnemies; i++) {

            enemies[i].y += enemies[i].speed;
            if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
                enemies[i].speed *= -1;
            } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
                enemies[i].speed *= -1;
            }
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
                this.gameOver();
                break;
            }


        }
    }




};

function collectPlankton(player, treasures) {   /*the function that allows the treasure to be incremented based on contact with the player*/

    console.log("Collect treasure scalled");
    treasures.disableBody(true, true);
    score += 5;
    scoreText.setText('Food Collected: ' + score);

    if (score % 25 == 0) {
        this.treasures.children.iterate(function (child) {


            child.enableBody(true, child.x, 100, true, true);


        });
    }

}
class End extends Phaser.Scene {  /*this is the scene for the End screen of the game whenthe player dies*/
    constructor() {
        super('End');
        this.active;
        this.endScreen;

    }
    preload() {
        this.load.image('endScreen', 'assets/deathScreen.png');
        this.load.image('restart', 'assets/restartButton.png'); /*loading assets*/
        this.load.image('backToMainMenu', 'assets/mainMenuButton.png');


    }
    create() {
        let endScreen = this.add.sprite(0, 0, 'endScreen');
        let restart = this.add.sprite(0, 300, 'restart');
        let backToMainMenu = this.add.sprite(400, 300, 'backToMainMenu');
        restart.setOrigin(0, 0);
        backToMainMenu.setOrigin(0, 0);
        endScreen.setOrigin(0, 0);
        restart.setInteractive();  /* sets all the buttons and interaction on those buttons to go to the requisitie scenes*/
        backToMainMenu.setInteractive();
        restart.on('pointerdown', () => this.scene.start('Game'));
        backToMainMenu.on('pointerdown', () => this.scene.start('Menu'));

    }

}

gameScene.gameOver = function () {
    this.isPlayerAlive = false;
    this.time.delayedCall(250, function () {
        this.cameras.main.fade(250);
    }, [], this);

    this.isPlayerAlive
    this.time.delayedCall(500, function () {
        this.scene.start('End');

    }, [], this);

}

let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 640,
    height: 360,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    scene: [Menu, gameScene, End]
};
let game = new Phaser.Game(config);