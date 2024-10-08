export class Enemy {
    scene: Phaser.Scene;
    healthBar: Phaser.GameObjects.Graphics;
    player: any;
    enemy: Phaser.Physics.Arcade.Sprite | null;
    cannon: Phaser.Physics.Arcade.Sprite | null;
    health: number;
    bullets: Phaser.Physics.Arcade.Group;
    shootDelay: number;
    isAlive: boolean;
    tankRotationSpeed: number;
    cannonRotationSpeed: number;

    constructor(scene: Phaser.Scene, player: any) {
        this.scene = scene;
        this.player = player;
        this.enemy = null;
        this.cannon = null;
        this.health = parseInt(localStorage.getItem('enemyHealth') || '5');
        this.healthBar = this.scene.add.graphics();
        this.bullets = this.scene.physics.add.group();
        this.shootDelay = 1000; // Intervalo de disparo en milisegundos
        this.isAlive = true; // Bandera para verificar si el enemigo está vivo
        this.tankRotationSpeed = 0.1; // Velocidad de rotación del tanque (más lenta)
        this.cannonRotationSpeed = 0.2; // Velocidad de rotación del cañón (más rápida)
    }

    preload() { 
    }

    create(x: number, y: number) {
        // Crear el tanque
        this.enemy = this.scene.physics.add.sprite(x, y, "tank");
        if (this.enemy) {
            this.enemy.setCollideWorldBounds(true); // Asegura que el enemigo no salga del mundo
        }
        this.enemy.setDepth(2); // Establecer la profundidad del enemigo

        // Crear el cañón del tanque en la misma posición
        this.cannon = this.scene.physics.add.sprite(x, y, "cannonTank");
        this.cannon.setCollideWorldBounds(true);
        this.cannon.setDepth(3); // Establecer una profundidad mayor para que aparezca sobre el tanque

        // Crear la barra de vida sobre el tanque
        this.createHealthBar();

        // Configurar las colisiones
        this.scene.physics.add.collider(
            this.enemy,
            this.player,
            this.handlePlayerHit,
            undefined,
            this
        );

        // Configurar disparo del enemigo cada cierto tiempo
        this.scene.time.addEvent({
            delay: this.shootDelay,
            callback: this.shoot,
            callbackScope: this,
            loop: true,
        });
    }

    createHealthBar() {
        const barWidth = 50;
        const barHeight = 10; // Cambia la altura a 10px
        const xOffset = 0;
        const yOffset = -30; // Ajustado para que esté más cerca del tanque

        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        // Posicionar la barra de vida sobre el tanque
        this.healthBar.setDepth(4); // Establecer una profundidad mayor para que aparezca sobre todo
    }

    updateHealthBar() {
        const healthPercentage = this.health / 5;
        this.healthBar.clear();
        this.healthBar.fillStyle(parseInt("0x" + localStorage.getItem('enemyBarColor') || '0x00ff00'), 1); // Verde para vida
        if (this.enemy) {
            this.healthBar.fillRect(
                this.enemy.x - 25,
                this.enemy.y - 30, // Ajustado para que esté más cerca del tanque
                50 * healthPercentage,
                5 // Cambia la altura a 10px
            );
        }
    }

    shoot() {
        if (!this.isAlive) return; // Salir si el enemigo no está vivo

        if (!this.cannon) {
            console.warn('Cannon is not initialized');
            return;
        }

        const bullet = this.bullets.create(
            this.cannon.x,
            this.cannon.y,
            "enemyBullet"
        );
        const angle = Phaser.Math.Angle.Between(
            this.cannon.x,
            this.cannon.y,
            this.player.x,
            this.player.y
        );
        bullet.setRotation(angle);
        bullet.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
        bullet.setCollideWorldBounds(true);
        bullet.body.onWorldBounds = true;

        // Detectar si la bala golpea al jugador
        this.scene.physics.add.collider(
            bullet,
            this.player,
            this.hitPlayer as unknown as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        );

        // Destruir la bala cuando sale de los límites del mundo
        this.scene.physics.world.on('worldbounds', (body: { gameObject: any; }) => {
            if (body.gameObject === bullet) {
                bullet.destroy();
            }
        });
    }

    hitPlayer(bullet: { destroy: () => void; }, playerSprite: { damage: () => void; }) {
        bullet.destroy(); // Destruir la bala

        if (playerSprite.damage && typeof playerSprite.damage === "function") {
            playerSprite.damage(); // Reducir la salud del jugador
        } else {
            console.warn("Player damage method not found");
        }
    }

    handlePlayerHit(enemy: any, player: any) {
        // Lógica de lo que pasa cuando el enemigo colisiona con el jugador
    }

    takeDamage(Xball: number, Yball: number) {
        this.health -= parseInt(localStorage.getItem('playerBulletDamage') || '5'); // Reducir la salud del enemigo
         console.log(this.health); 
        this.updateHealthBar(); // Actualizar la barra de vida

        const sprite = this.scene.add.sprite(Xball, Yball, 'spriteBall');
        sprite.play('ballAnim').setDepth(2); 

        sprite.on('animationcomplete', () => {
            sprite.destroy(); // Eliminar el sprite
        });
        
        if (this.health <= 0) {
            console.log("Enemy destroyed!");
            this.isAlive = false; // Establecer que el enemigo ya no está vivo
            if (this.enemy) {
                this.enemy.destroy(); // Destruir el tanque enemigo
            }
            if (this.cannon) {
                this.cannon.destroy(); // Destruir el cañón
            }
            this.healthBar.destroy(); // Destruir la barra de vida
            this.scene.time.delayedCall(1000, this.onEnemyDestroyed, [], this); // Espera un segundo antes de permitir el movimiento de los enemigos
        }
    }

    onEnemyDestroyed() {
        // Lógica para permitir que los enemigos se muevan nuevamente
        // Por ejemplo, reiniciar su posición o estado
    }

    update() {
        // Verificar si el enemigo está vivo, inicializado y el jugador también está presente
        if (!this.isAlive || !this.enemy || !this.player) {
            console.warn('Enemy is not alive or not initialized, skipping update');
            return;
        }
    
        const angle = Phaser.Math.Angle.Between(this.enemy.x, this.enemy.y, this.player.x, this.player.y);
        const speed = 100;
    
        if (!this.player || !this.player.x || !this.player.y) {
            console.warn('Player no está disponible, omitiendo movimiento del enemigo');
            return;
        }
    
        // Verificar si `this.enemy` está definido antes de llamar a `moveTo`
        if (this.enemy && this.enemy.body) {
            this.scene.physics.moveTo(this.enemy, this.player.x, this.player.y, speed);
        } else {
            console.warn('Enemy no está disponible o no tiene cuerpo físico');
            return;
        }
    
        // Hacer que el tanque gire más lentamente
        this.enemy.rotation = Phaser.Math.Angle.Wrap(
            Phaser.Math.Angle.RotateTo(
                this.enemy.rotation,
                angle,
                this.tankRotationSpeed
            )
        );
    
        if (this.cannon && this.enemy) {
            this.cannon.x = this.enemy.x;
            this.cannon.y = this.enemy.y;
        }
    
        // Hacer que el cañón gire más rápidamente
        if (this.cannon) {
            this.cannon.rotation = Phaser.Math.Angle.Wrap(
                Phaser.Math.Angle.RotateTo(
                    this.cannon.rotation,
                    angle,
                    this.cannonRotationSpeed
                )
            );
        }
    
        // Actualizar la barra de vida para que siga al enemigo
        this.updateHealthBar();
    }
    
}
