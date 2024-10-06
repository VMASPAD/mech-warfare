export class Player {
    scene: Phaser.Scene;
    player: Phaser.Physics.Arcade.Sprite & { damage?: () => void } | null;
    cursors: any;
    health: number;
    isInitialized: boolean;
    healthBar: Phaser.GameObjects.Graphics;
    gameOverText: Phaser.GameObjects.Text | null; // Texto de Game Over
    restartButton: Phaser.GameObjects.Text | null; // Botón para reiniciar
    returnMenu: Phaser.GameObjects.Text | null; // Botón para ir al menu
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.player = null;
        this.cursors = null;
        this.health = parseInt(localStorage.getItem('enemyBulletDamage') || '5');
        this.isInitialized = false;
        this.healthBar = this.scene.add.graphics();
        this.gameOverText = null; // Inicializar el texto de Game Over
        this.restartButton = null; // Inicializar el botón de reinicio
        this.returnMenu = null; // Inicializar el botón de reinicio
    }

    preload() {
        this.scene.load.setPath("assets");
        this.scene.load.image('mech', 'mech.png');
        this.scene.load.image('tank', 'tank.png');
        this.scene.load.image('cannonTank', 'canonTank.png');
        this.scene.load.image('enemyBullet', 'ball.png');
        this.scene.load.image("spriteBall", "spriteBall.png");
        this.scene.load.image('bullet', 'bullet.png'); // Cargar la imagen de la bala
    }

    create() {
        if (this.isInitialized) {
            console.warn('Player already initialized');
            return;
        }

        try {
            this.player = this.scene.physics.add.sprite(400, 300, 'mech');
            if (!this.player) {
                throw new Error('Failed to create player sprite');
            }
            this.player.setCollideWorldBounds(true);
            this.player.damage = this.damage.bind(this);

            if (this.scene.input.keyboard) {
                this.cursors = this.scene.input.keyboard.addKeys({
                    W: Phaser.Input.Keyboard.KeyCodes.W,
                    A: Phaser.Input.Keyboard.KeyCodes.A,
                    S: Phaser.Input.Keyboard.KeyCodes.S,
                    D: Phaser.Input.Keyboard.KeyCodes.D
                });
            } else {
                console.warn('Keyboard input not available');
            }

            this.isInitialized = true;
            console.log('Player initialized successfully');
            
            this.createHealthBar();
        } catch (error) {
            console.error('Error initializing player:', error);
        }
    }

    createHealthBar() {
        const barWidth = 50;
        const barHeight = 5;
        const xOffset = 0;
        const yOffset = -30;

        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        this.healthBar.setDepth(4);
    }

    updateHealthBar() {
        const healthPercentage = this.health / 3;
        this.healthBar.clear();
        this.healthBar.fillStyle(parseInt("0x" + localStorage.getItem('playerBarColor') || '0x00ff00'), 1);
        if (this.player) {
            this.healthBar.fillRect(
                this.player.x - 25,
                this.player.y - 30,
                50 * healthPercentage,
                5
            );
        }
    }

    damage() {
        if (!this.isInitialized || !this.player) return;

        this.health -= parseInt(localStorage.getItem('enemyBulletDamage') || '5');
        console.log(`Player health: ${this.health}`);
        
        this.updateHealthBar();

        if (this.health <= 0) {
            console.log('Player is dead!');
            this.playerDied();
        }
    }

    playerDied() {
        if (this.player) {
            this.player.destroy();
            this.isInitialized = false;
        }
        
        this.scene.physics.pause();

        this.gameOverText = this.scene.add.text(
            this.scene.cameras.main.centerX, 
            this.scene.cameras.main.centerY - 50, 
            'Game Over', 
            { fontSize: '64px', color: '#ff0000' }
        ).setOrigin(0.5);

        this.restartButton = this.scene.add.text(
            this.scene.cameras.main.centerX, 
            this.scene.cameras.main.centerY + 50, 
            'Restart Game', 
            { fontSize: '32px', color: '#ffffff' }
        ).setOrigin(0.5).setInteractive();

        this.restartButton.on('pointerdown', () => {
            this.scene.scene.restart();
        });
        
        this.returnMenu = this.scene.add.text(
            this.scene.cameras.main.centerX, 
            this.scene.cameras.main.centerY + 100, 
            'Return Menu', 
            { fontSize: '32px', color: '#ffffff' }
        ).setOrigin(0.5).setInteractive();
        this.returnMenu.on('pointerdown', () => {
            this.scene.scene.start('Start');
        });
    }

    shoot() {
        if (!this.isInitialized || !this.player) return;

        const bullet = this.scene.physics.add.sprite(this.player.x, this.player.y, 'bullet');
        const pointer = this.scene.input.activePointer;
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
        bullet.setRotation(angle);
        bullet.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
        bullet.setCollideWorldBounds(true);
        bullet.setBounce(1);
        
        bullet.body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
            if (body.gameObject === bullet) {
                bullet.destroy();
            }
        });
    
        return bullet;
    }

    update() {
        if (!this.isInitialized || !this.player || !this.cursors) {
            console.warn('Player not fully initialized, skipping update');
            return;
        }

        const speed = 300;
        this.player.setVelocity(0);

        if (this.cursors.W.isDown) this.player.setVelocityY(-speed);
        if (this.cursors.S.isDown) this.player.setVelocityY(speed);
        if (this.cursors.A.isDown) this.player.setVelocityX(-speed);
        if (this.cursors.D.isDown) this.player.setVelocityX(speed);

        const pointer = this.scene.input.activePointer;
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
        this.player.rotation = angle;

        this.updateHealthBar();
    }
}
