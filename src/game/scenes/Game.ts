import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import bg from '../units/bg';
import { Player } from '../units/player';
import { Enemy } from '../units/enemy';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.player = null; // Jugador
        this.enemies = []; // Arreglo de enemigos
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('bullet', 'ball.png'); // Carga la imagen de la bala
        this.load.image('enemyBullet', 'ball.png'); // Carga la imagen de la bala enemiga
        this.load.image('mech', 'mech.png');
        this.load.image('bullet', 'bullet.png'); // Carga la imagen de la bala
        this.load.image('cannonTank', 'canonTank.png');
        this.load.spritesheet("spriteBall", "spriteBall.png", { frameWidth: 32, frameHeight: 20 });


        this.player = new Player(this); // Pasa la escena actual al jugador
        this.player.preload(); // Llama al método preload del jugador
        
    }

    create() {
        bg(this); // Cargar el fondo primero
    
        this.player = new Player(this);
        this.player.create();
        this.player.player.setDepth(2);
    
        // Configura los límites del mundo
        this.physics.world.setBounds(0, 0, 1280, 900); // Ajusta según el tamaño de tu mapa
    
        EventBus.emit('current-scene-ready', this);
        this.anims.create({
            key: 'ballAnim',
            frames: this.anims.generateFrameNumbers('spriteBall', { start: 0, end: 5 }), // N es el número del último frame
            frameRate: 10, // Velocidad de la animación (frames por segundo)
            repeat: 0 // Repetir indefinidamente
        });

        // Generar enemigos
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, 700); // Rango dentro del mapa visible
            const y = Phaser.Math.Between(100, 500);
            const enemy = new Enemy(this, this.player.player);
            enemy.create(x, y); // Posición aleatoria del enemigo
            this.enemies.push(enemy);
        }
    
        this.input.on('pointerdown', () => {
            const bullet = this.player.shoot(); // Llama al método shoot del jugador
            if (bullet) {
                this.enemies.forEach(enemy => {
                    this.physics.add.collider(bullet, enemy.enemy, () => {
                        enemy.takeDamage(bullet.x,bullet.y); // Reduce la vida del enemigo al recibir el impacto
                    });
                });
            }
        });
    }
    
    
    

    update(time) {
        if (this.player) {
            this.player.update(); // Llama al método update del jugador
        }
        this.enemies.forEach(enemy => {
            enemy.update();
        });
    }
}