import { Scene } from "phaser";

export class Start extends Scene {
    constructor() {
        super({ key: "Start" });
        this.isModalOpen = false;

    }

    preload() {
        this.load.setPath("assets");
        this.load.image("bgStart", "bgStart.png");
    }

    create() {
        const background = this.add
            .image(1000, 0, "bgStart")
            .setOrigin(0.5, 0.5);
        console.log(background);
        // Escalar la imagen de 1280x720 a 1920x1080
        const scaleX = 1920 / background.width;
        const scaleY = 1080 / background.height;
        background.setScale(scaleX, scaleY);

        // Ajustar los límites del mundo al nuevo tamaño de la imagen escalada
        const bgWidth = background.width * scaleX;
        const bgHeight = background.height * scaleY;

        // Establecer el tamaño del mundo al tamaño del fondo escalado
        this.physics.world.setBounds(0, 0, bgWidth, bgHeight);

        // Ajustar el tamaño de la cámara para que coincida con el tamaño del fondo escalado
        this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);

        // Centrar la imagen de fondo
        background.setPosition(bgWidth / 2, bgHeight / 2);

        // Centrar la cámara en la imagen de fondo
        this.cameras.main.centerOn(bgWidth / 2, bgHeight / 2);
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
 

        const button1 = this.add
            .text(centerX, centerY - 100, "Jugar", {
                fontSize: "32px",
                color: "#000000",
                fontFamily: "Montserrat",
                backgroundColor: "#ffffff",
                padding: { x: 100, y: 5 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => this.scene.start("Game"));

        const button2 = this.add
            .text(centerX, centerY, "Configuración", {
                fontSize: "32px",
                color: "#000000",
                fontFamily: "Montserrat",
                backgroundColor: "#ffffff",
                padding: { x: 100, y: 5 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => {
                // Emitir el evento personalizado 'openModal' para ser capturado en React
                this.game.events.emit("openModal");
            });
    }
}
