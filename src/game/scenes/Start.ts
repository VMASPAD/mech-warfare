import { Scene } from "phaser";

export class Start extends Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        // Aquí puedes cargar imágenes o fuentes necesarias
    }

    create() {
        // Texto grande en la parte superior
        this.add.text(400, 100, 'Menú Principal', { fontSize: '48px', fill: '#ffffff',fontFamily:"Montserrat" }).setOrigin(0.5);

        // Botón 1: Ir a la escena Game
        const button1 = this.add.text(400, 200, 'Jugar', { fontSize: '32px', fill: '#000000',fontFamily:"Montserrat", backgroundColor: '#ffffff', padding: { x: 100, y: 5 } })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Game'));

        // Botón 2: Abrir Modal 1
        const button2 = this.add.text(400, 300, 'Modal 1', { fontSize: '32px', fill: '#000000',fontFamily:"Montserrat", backgroundColor: '#ffffff', padding: { x: 100, y: 5 } })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.openModal('Este es el Modal 1'));

        // Botón 3: Abrir Modal 2
        const button3 = this.add.text(400, 400, 'Modal 2', { fontSize: '32px', fill: '#000000',fontFamily:"Montserrat", backgroundColor: '#ffffff', padding: { x: 100, y: 5 } })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.openModal('Este es el Modal 2'));

        // Botón 4: Abrir Modal 3
        const button4 = this.add.text(400, 500, 'Modal 3', { fontSize: '32px', fill: '#000000',fontFamily:"Montserrat", backgroundColor: '#ffffff', padding: { x: 100, y: 5 } })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.openModal('Este es el Modal 3'));
    }

    openModal(message) {
        // Aquí puedes implementar la lógica para abrir un modal
        console.log(message); // Solo como ejemplo, puedes reemplazarlo por un modal real
    }
}
