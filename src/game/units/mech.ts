import { Player } from './player';

export class Mech extends Phaser.Scene {
    constructor() {
        super({ key: 'Mech' });
    }

    preload() {
        this.load.setPath('assets');
        // Preload cualquier recurso necesario aquí
    }

    create() { 
        this.playerScene = new Player(this);
        this.playerScene.preload();
        this.playerScene.create();
    
        this.input.on('pointerdown', () => {
            this.playerScene.shoot();
        });
    
        this.enemyBulletsGroup = this.physics.add.group();
        this.physics.add.collider(this.playerScene.player, this.enemyBulletsGroup, this.handlePlayerHit, null, this);
    }
    

    update() {
        this.playerScene.update();
    }

    handlePlayerHit(player, bullet) {
        bullet.destroy(); // Destroy the bullet
        
        // Apply damage to the player
        if (player.damage && typeof player.damage === 'function') {
            player.damage(); // Call the player's damage method to reduce health
        } else {
            console.warn('Player damage method not found');
        }
    }
    
}
