export class Player {
    scene: Phaser.Scene;
    player: Phaser.Physics.Arcade.Sprite | null;
    cursors: any;
    health: number;
    isInitialized: boolean;
    healthBar: Phaser.GameObjects.Graphics; // Nueva propiedad para la barra de vida

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.player = null;
        this.cursors = null;
        this.health = 3;
        this.isInitialized = false;
        this.healthBar = null; // Inicializar la barra de vida
    }

    preload() {
        this.scene.load.setPath("assets");
        this.scene.load.image('mech', 'mech.png'); // Asegúrate de que esta ruta sea correcta
        this.scene.load.image('tank', 'tank.png'); // Imagen del tanque
        this.scene.load.image('cannonTank', 'canonTank.png'); // Imagen del cañón
        this.scene.load.image('enemyBullet', 'ball.png'); // Imagen de la bala enemiga
        this.scene.load.image("spriteBall", "spriteBall.png"); // Cargar el sprite que aparecerá al recibir daño

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

            this.cursors = this.scene.input.keyboard.addKeys({
                W: Phaser.Input.Keyboard.KeyCodes.W,
                A: Phaser.Input.Keyboard.KeyCodes.A,
                S: Phaser.Input.Keyboard.KeyCodes.S,
                D: Phaser.Input.Keyboard.KeyCodes.D
            });

            this.isInitialized = true;
            console.log('Player initialized successfully');
            
            // Crear la barra de vida
            this.createHealthBar();
        } catch (error) {
            console.error('Error initializing player:', error);
        }
    }

    createHealthBar() {
        const barWidth = 50;
        const barHeight = 5;
        const xOffset = 0;
        const yOffset = -30; // Ajuste para que esté sobre el jugador

        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        // Posicionar la barra de vida sobre el jugador
        this.healthBar.setDepth(4); // Asegúrate de que esté sobre otros objetos
    }

    updateHealthBar() {
        const healthPercentage = this.health / 3; // Cambiar a 3 si la salud máxima es 3
        this.healthBar.clear();
        this.healthBar.fillStyle(0x00ff00, 1); // Verde para vida
        this.healthBar.fillRect(
            this.player.x - 25, // Centrar la barra
            this.player.y - 30, // Posición ajustada
            50 * healthPercentage,
            5
        );
    }

    damage() {
        if (!this.isInitialized || !this.player) return;

        this.health -= 1; // Disminuye la salud en 1
        console.log(`Player health: ${this.health}`);
        
        this.updateHealthBar(); // Actualiza la barra de vida

        if (this.health <= 0) {
            console.log('Player is dead!');
            if (this.player) {
                this.player.destroy(); // Destruye solo el jugador
                this.isInitialized = false; // Marca al jugador como no inicializado

                // Aquí puedes mostrar un mensaje de "Game Over" o pasar a otra escena
                /* this.scene.time.delayedCall(1000, () => {
                    this.scene.scene.start('GameOverScene'); // Cambia a la escena de Game Over después de 1 segundo
                }); */
            }
        }
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

        const speed = 500;
        this.player.setVelocity(0);

        if (this.cursors.W.isDown) this.player.setVelocityY(-speed);
        if (this.cursors.S.isDown) this.player.setVelocityY(speed);
        if (this.cursors.A.isDown) this.player.setVelocityX(-speed);
        if (this.cursors.D.isDown) this.player.setVelocityX(speed);

        const pointer = this.scene.input.activePointer;
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
        this.player.rotation = angle;

        // Actualizar la barra de salud para que siga al jugador
        this.updateHealthBar();
    }
}
