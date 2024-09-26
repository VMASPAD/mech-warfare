import { Scene } from "phaser";

export class Start extends Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        // Aquí puedes cargar imágenes o fuentes necesarias
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.text(centerX, centerY - 200, 'Menú Principal', { 
            fontSize: '48px', 
            fill: '#ffffff', 
            fontFamily: "Montserrat" 
        }).setOrigin(0.5);

        const button1 = this.add.text(centerX, centerY - 100, 'Jugar', { 
            fontSize: '32px', 
            fill: '#000000', 
            fontFamily: "Montserrat", 
            backgroundColor: '#ffffff', 
            padding: { x: 100, y: 5 } 
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.scene.start('Game'));

        const button2 = this.add.text(centerX, centerY, 'Configuración', { 
            fontSize: '32px', 
            fill: '#000000', 
            fontFamily: "Montserrat", 
            backgroundColor: '#ffffff', 
            padding: { x: 100, y: 5 } 
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            // Emitir el evento personalizado 'openModal' para ser capturado en React
            this.game.events.emit('openModal');
        });
    }
}
