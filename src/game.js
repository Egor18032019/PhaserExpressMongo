 import PlatformScene from "../scenes/PlatformScene.js"
 import PreloaderGame from "../scenes/PreloaderGame.js"

 const scene = [PreloaderGame, PlatformScene]

 const config = {
     type: Phaser.AUTO,
     width: 800,
     height: 600,
     backgroundColor: "#000",
     parent: "game",
     pixelArt: true,
     scene: scene,
     physics: {
         default: "arcade",
         arcade: {
             gravity: {
                 y: 300
             }
         }
     }
 };

 const game = new Phaser.Game(config);