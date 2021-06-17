import BombSpawner from '../ui/BombSpawner.js';
import ScoreLabel from "../ui/ScoreLabel.js";
import onSetupFormSubmit from "../src/submit_score.js";


export default class PlatformScene extends Phaser.Scene {
  constructor() {
    super({
      key: `PlatformScene`
    });
    this.cursors = null;
    this.player = null;
    this.stars = null;
    this.bombSpawner = undefined;
    this.gameOver = false;
    this.scoreLabel = undefined;
    this.button = null;
  }

  preload() {

  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    let gameWidth = this.game.config.width > 800 ? 800 : this.game.config.width
    let gameHeight = this.game.config.height > 600 ? 600 : this.game.config.height
    const firstPlatform = {
      width: gameWidth - 50,
      heigh: gameHeight / 3
    }
    const secondPlatform = {
      width: 50,
      heigh: gameHeight / 3 + 100 // что бы человечек проходил
    }
    const threePlatform = {
      width: gameWidth / 4 * 3,
      heigh: gameHeight / 3 * 2
    }
    // создаем 4платформы разного размера
   
    platforms.create(firstPlatform.width, firstPlatform.heigh, `ground`);
    platforms.create(secondPlatform.width, secondPlatform.heigh, `ground`);
    platforms.create(threePlatform.width, threePlatform.heigh, `ground`);
    platforms.create(gameWidth / 2, gameHeight - 33, `ground`).setScale(2).refreshBody(); // setScale увеличили и потом надо обновить refreshBody() Земля
    return platforms; // возвращаем экземпляр
  }

  createPlayer() {
    // создаем спрайт (по умолчанию динамического типа)
    const player = this.physics.add.sprite(100, 450, `dude`);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.anims.create({
      key: `left`, // Анимация left использует кадры 0, 1, 2 и 3 и работает со скоростью 10 кадров в секунду.
      frames: this.anims.generateFrameNumbers(`dude`, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1, // Значение -1 свойства repeat указывает, что анимация будет циклично повторяться.
    });

    this.anims.create({
      key: `turn`,
      frames: [{
        key: `dude`,
        frame: 4,
      }],
      frameRate: 20,
    });

    this.anims.create({
      key: `right`,
      frames: this.anims.generateFrameNumbers(`dude`, {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
    return player; // возвращаем экземпляр
  }

  createStars() {
    const repeat = 11
    const stepWidth = this.game.config.width/(repeat+1)
    const stars = this.physics.add.group({
      key: `star`,
      repeat: repeat,
      setXY: {
        x: 12,
        y: 0,
        stepX: stepWidth,
      }, // с x: 12, y: 0 через интервал в 70 пикселей.
    });

    stars.children.iterate((child) => {
      // eslint-disable-next-line new-cap
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    return stars;
  }

  collectStar(player, stars) {
    stars.disableBody(true, true);
    // добавляем 10 очков к счету
    this.scoreLabel.add(10);

    if (this.stars.countActive(true) === 0) { // countActive - чтобы увидеть, сколько у нас активных звезд
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });

      this.bombSpawner.spawn(player.x);
    }
  }

  createScoreLabel(x, y, score) {
    const style = {
      fontSize: `32px`,
      fill: `#000`,
    };
    const label = new ScoreLabel(this, x, y, score, style);
    this.add.existing(label);
    return label;
  }

  hitBomb(player, bomba) {
    this.physics.pause();
    bomba.destroy();
    const particles = this.add.particles(`red`);

    // создаем класс динамических тел
    const emitter = particles.createEmitter({
      speed: 100,
      scale: {
        start: 1,
        end: 0,
      },
      blenMode: `ADD`,
    });

    emitter.startFollow(player); // емитер следуй за лого ))

    this.cursors.left.reset();

    this.cursors.right.reset();

    this.cursors.up.reset();

    this.cursors.down.reset();
    const data = this.scoreLabel.getScore()
    onSetupFormSubmit(data)
    this.time.addEvent({
      delay: 3000,
      callback: this.restart,
      callbackScope: this
    });
  }

  restart() {
    this.scene.restart();

  }

  create() {
    this.add.image(400, 300, `sky`); // по умолчанию в Phaser 3 координаты всех игровых объектов задаются их центром
    // Если этот способ размещения вам не подходит, измените его с помощью метода setOrigin
    this.add.text(400, 300, "Беригись бомб !", {
      font: `22px monospace`,
      color: `grey`
    }).setOrigin(0.5);;
    // Порядок отображения объектов на холсте зависит от того в каком порядке они были объявлены в коде

    // Теперь получаем из методов экземпляры объектов для платформы и игрока
    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.stars = this.createStars();
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.bombSpawner = new BombSpawner(this, `bomb`);
    // Создаем константу для хранения бомб

    this.physics.add.collider(this.player, platforms); // берет два объекта и проверяет, сталкиваются ли они
    this.physics.add.collider(this.stars, platforms); // проверка на столкновения
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    // добавим бобмы
    const bombsGroup = this.bombSpawner.group;
    this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play(`left`, true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play(`right`, true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play(`turn`);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      // также проверяем, касается ли он платформы
      this.player.setVelocityY(-330);
    }
  }
}