import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import bg from '../units/bg';
import { Player } from '../units/player';
import { Enemy } from '../units/enemy';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.player = null;
        this.enemies = [];
        this.wave = 1;
        this.enemyCount = 10;
        this.maxWaves = 1;
        this.waveText = null;
        this.maxWaveText = null;
        this.isPaused = false;
        this.pauseButton = null;
        this.pauseMenu = null;
        this.pauseOverlay = null;
        this.returnMenu = null;
        this.isGameOver = false
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('bullet', 'ball.png');
        this.load.image('enemyBullet', 'ballEnemy.png');
        this.load.image('mech', 'mech.png');
        this.load.image('bullet', 'bullet.png');
        this.load.image('cannonTank', 'canonTank.png');
        this.load.spritesheet("spriteBall", "spriteBall.png", { frameWidth: 32, frameHeight: 20 });
        this.load.image('pause', 'pause.png');
        this.load.image('bgStart', 'bgStart.png'); 

        this.player = new Player(this);
        this.player.preload();
    }

    create() {
        // Asegúrate de que el juego no esté en pausa al iniciar
        this.isPaused = false;
        this.physics.resume();

        bg(this);
    
        this.player = new Player(this);
        this.player.create();
        this.player.player.setDepth(2);
    
        this.physics.world.setBounds(0, 0, 1920, 1080);
    
        EventBus.emit('current-scene-ready', this);
        this.anims.create({
            key: 'ballAnim',
            frames: this.anims.generateFrameNumbers('spriteBall', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        this.createHUD();
        this.startWave();

        this.input.on('pointerdown', () => {
            if (!this.isPaused) {
                const bullet = this.player.shoot();
                if (bullet) {
                    this.enemies.forEach(enemy => {
                        this.physics.add.collider(bullet, enemy.enemy, () => {
                            enemy.takeDamage(bullet.x, bullet.y);
                        });
                    });
                }
            }
        });

        this.createPauseButton();
    }

    createPauseButton() {
        this.pauseButton = this.add.image(1890, 30, 'pause')
            .setOrigin(2, -1)
            .setScale(1)
            .setInteractive()
            .setDepth(10);

        this.pauseButton.on('pointerdown', () => {
            this.togglePause();
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.showPauseMenu();
            this.physics.pause();
        } else {
            this.hidePauseMenu();
            this.resumeGame();
        }
    }

    showPauseMenu() {
        this.pauseOverlay = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.7).setDepth(20);
        this.pauseMenu = this.add.container(960, 540).setDepth(21);

        const menuBg = this.add.rectangle(0, 0, 400, 300, 0xffffff).setOrigin(0.5);
        this.pauseMenu.add(menuBg);

        const title = this.add.text(0, -100, 'Paused', { fontSize: '32px', color: '#000' }).setOrigin(0.5);
        this.pauseMenu.add(title);

        const resumeButton = this.add.text(-75, 0, 'Resume', { fontSize: '24px', color: '#000' })
            .setInteractive()
            .on('pointerdown', () => this.resumeGame());
        this.pauseMenu.add(resumeButton);

        const quitButton = this.add.text(75, 0, 'Quit', { fontSize: '24px', color: '#000' })
            .setInteractive()
            .on('pointerdown', () => {
                this.resumeGame();  // Asegúrate de reanudar el juego antes de cambiar de escena
                this.scene.start('Start');
            });
        this.pauseMenu.add(quitButton);
    }
 

    resumeGame() {
        this.isPaused = false;
        this.hidePauseMenu();
        this.physics.resume();
    }

    hidePauseMenu() {
        if (this.pauseMenu) {
            this.pauseMenu.destroy();
            this.pauseMenu = null;
        }
        if (this.pauseOverlay) {
            this.pauseOverlay.destroy();
            this.pauseOverlay = null;
        }
    }

    createHUD() { 
        // Crear el texto para la oleada máxima
        this.maxWaveText = this.add.text(30, 48, `Oleada: ${this.wave} / ${this.maxWaves}`, {
            fontSize: '32px',
            color: '#fff', // Cambié el color del texto a blanco 
        }).setDepth(10);
    }

    startWave() {
        this.spawnEnemies(this.enemyCount);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.isGameOver && this.enemies.every(enemy => !enemy.isAlive)) {
                    this.wave++;
                    this.enemyCount = Math.floor(this.enemyCount * 1.05);
                    this.updateHUD();
                    if (this.wave < this.maxWaves) {
                        this.spawnEnemies(this.enemyCount);
                    } else {
                        this.gameOver();
                    }
                }
            },
            callbackScope: this,
            loop: true,
        });
    }

    updateHUD() { 
        this.maxWaveText.setText(`Oleada: ${this.wave} / ${this.maxWaves}`);
    }

    spawnEnemies(count) {
        this.enemies = [];

        for (let i = 0; i < count; i++) {
            const x = Phaser.Math.Between(0, 1920);
            const y = Phaser.Math.Between(0, 1080);
            const enemy = new Enemy(this, this.player.player);
            enemy.create(x, y);
            this.enemies.push(enemy);
        }
    }

    gameOver() {
        if (this.isGameOver) return; // Si ya está en estado de game over, no hacer nada
        
        this.isGameOver = true; // Marcar el juego como terminado
        this.physics.pause();
        console.log('¡Juego terminado! Has alcanzado la oleada máxima.');
        this.add.text(960, 540, '¡Has ganado!', { fontSize: '64px', color: '#ff0000' }).setOrigin(0.5);
        this.returnMenu = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY + 100, 
            'Return Menu', 
            { fontSize: '32px', color: '#ffffff' }
        ).setOrigin(0.5).setInteractive();
        this.returnMenu.on('pointerdown', () => {
            this.isGameOver = false;
            this.wave = 0
            this.scene.start('Start'); // Cambiar a la escena de inicio
        });
    }

    update(time) {
        if (!this.isPaused && !this.isGameOver) {
            if (this.player) {
                this.player.update();
            }
            this.enemies.forEach(enemy => {
                if (enemy.isAlive) {
                    enemy.update();
                }
            });
        }
    }
}