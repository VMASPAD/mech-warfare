import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Types } from "phaser";
import { Start } from './scenes/Start';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#0084B1',
    physics: {
        default: 'arcade',
        arcade: { 
            debug: false,
            fps: 144
        }
    },
    scene: [
        Start,
        MainGame
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
