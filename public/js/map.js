window.onload = ()=>{
    var config = {
        type: Phaser.AUTO,
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight-document.getElementById("menu").scrollHeight,
        physics: {
            default: 'arcade',
        },
        scene: {
            preload: preload,
            create: create
        }
    };

    var game = new Phaser.Game(config);

    function preload ()
    {
        this.load.image('sky', '/public/map.jpg')
        this.load.image('logo', '/public/tests.png')
        this.load.image('red', '/public/particle.png');
    }

    function getRandomInt(max) {
            return Math.floor(Math.random() * max);
    }

    function create ()
    {
        let sky = this.add.image(1920/2, 1080/2, 'sky');
        sky.setDisplaySize(1920, 1080)
        var particles = this.add.particles('red');

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 0.1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');
        
        logo.setDisplaySize(200, 200)

        

        logo.setVelocity(400, 500);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }
}