 import PlatformScene from "../scenes/PlatformScene.js"
 import PreloaderGame from "../scenes/PreloaderGame.js"
 const availableScreenWidth = window.screen.availWidth
 const availableScreenHeight = window.screen.availHeight
 
 let gameWidth = availableScreenWidth > 800 ? 800 : availableScreenWidth
 let gameHeight = availableScreenHeight > 600 ? 600 : availableScreenWidth
 
 const scene = [PreloaderGame, PlatformScene]

 const config = {
     type: Phaser.AUTO,
     width: gameWidth, //800
     height: gameHeight, //600
     backgroundColor: "#000",
     parent: "game",
     pixelArt: true,
     scene: scene,
     physics: {
         default: "arcade",
         arcade: {
             gravity: {
                 y: 111
             }
         }
     }
 };

 const game = new Phaser.Game(config);