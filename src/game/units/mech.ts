import { Player } from './player';

export class Mech extends Phaser.Scene {
    playerScene: Player;
    enemyBulletsGroup: Phaser.Physics.Arcade.Group;

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
        if (this.playerScene.player) {
            this.physics.add.collider(this.playerScene.player, this.enemyBulletsGroup, this.handlePlayerHit as unknown as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        } else {
            console.warn('Player is not initialized');
        }
    }
    

    update() {
        this.playerScene.update();
    }

    handlePlayerHit(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        const playerWithDamage = player as unknown as { damage: () => void };
        const bulletWithDestroy = bullet as unknown as { destroy: () => void };
        
        bulletWithDestroy.destroy(); // Destroy the bullet
        
        // Apply damage to the player
        if (playerWithDamage.damage && typeof playerWithDamage.damage === 'function') {
            playerWithDamage.damage(); // Call the player's damage method to reduce health
        } else {
            console.warn('Player damage method not found');
        }
    
        bullet.destroy(); // Destroy the bullet
        
        // Apply damage to the player 
        if (playerWithDamage.damage && typeof playerWithDamage.damage === 'function') {
            playerWithDamage.damage(); // Call the player's damage method to reduce health
        } else {
            console.warn('Player damage method not found');
        }
    }
    
}
