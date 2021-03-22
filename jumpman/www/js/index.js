//document.addEventListener('deviceready', onDeviceReady, false);

//function onDeviceReady() {}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }, //GRAVEDAD EN TODO EL MUNDO, SI SE PONE "-" (MENOS) CARECE DE GRAVEDAD EL MUNDO
            debug: false
        }
    },
};

var game = new Phaser.Game(config);
var button;
var star;
var scoreText;
var score = 0;

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    this.load.spritesheet('dude2',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

let platforms;

function collectStar(player, star) {
    star.disableBody(true, true);
    console.log('Estrella!!!');
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}
function collectStar2(player2, star) {
    star.disableBody(true, true);
    console.log('Estrella!!!');
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var z = (player2.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        

        var bomb = bombs.create(z, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}

function hitBomb(player, bomb) {
    score -= 3;
    // this.physics.pause();
    player.anims.play('turn');
    // gameOver = true;
}
function hitBomb2(player2, bomb) {
    score -= 3;
    // this.physics.pause();
    player2.anims.play('turn');
    // gameOver = true;
}

function create() {

    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude'); //POSICIÓN DEL DUDE
    player2 = this.physics.add.sprite(200, 450, 'dude');

    player.setBounce(0.2); // REBOTE 
    player.setCollideWorldBounds(true);

    player2.setBounce(0.2); // REBOTE 
    player2.setCollideWorldBounds(true);

    //GIRO DEL PERSONAJE A MEDIDA QUE APRIETO LAS TECLAS
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    player.body.setGravityY(30);  //GRAVEDAD EN EL MUNDO PARA EL PERSONAJE
    this.physics.add.collider(player, platforms);

    player2.body.setGravityY(30);  //GRAVEDAD EN EL MUNDO PARA EL PERSONAJE
    this.physics.add.collider(player2, platforms);
    // ESTRELLAS ******************************************************************
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player2, stars, collectStar2, null, this);

    // ******************************************************************************
    /*SCORE  *********************************************************************/
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    // ******************************************************************************
    // BOMBAS  **********************************************************************
    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(player2, bombs, hitBomb2, null, this);
    // ******************************************************************************

}

function update() {
    const cursors = this.input.keyboard.createCursorKeys();

    const upButton = this.input.keyboard.addKey('W');
    const downButton = this.input.keyboard.addKey('S');
    const leftButton = this.input.keyboard.addKey('A');
    const rightButton = this.input.keyboard.addKey('D');

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }

    // Player2 controls...
    if (leftButton.isDown) {
        player2.setVelocityX(-160);
        player2.anims.play('left', true);
    } else if (rightButton.isDown) {
        player2.setVelocityX(160);
        player2.anims.play('right', true);
    } else {
        player2.setVelocityX(0);
        player2.anims.play('turn');
    }

    if (upButton.isDown && player2.body.touching.down) {
        player2.setVelocityY(-330);
    }
}
