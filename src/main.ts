import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preloader } from './scenes/Preloader'
import { Start } from './scenes/Start'
import { Game } from './scenes/Game'
import { GameOver } from './scenes/GameOver'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: '躲避60秒挑战',
    parent: 'root',
    width: 1280,
    height: 720,
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { x: 0, y: 0 },
        },
    },
    scene: [Boot, Preloader, Start, Game, GameOver],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
}

new Phaser.Game(config)
