export default function bg(scene: Phaser.Scene): void {
    scene.load.setPath('assets');
    scene.load.image('bg', 'bg.png');
    scene.load.once('complete', () => {
        const background = scene.add.image(1000, 0, 'bg').setOrigin(0.5, 0.5);

        // Escalar la imagen de 1280x720 a 1920x1080
        const scaleX = 1920 / background.width;
        const scaleY = 1080 / background.height;
        background.setScale(scaleX, scaleY);

        // Ajustar los límites del mundo al nuevo tamaño de la imagen escalada
        const bgWidth = background.width * scaleX;
        const bgHeight = background.height * scaleY;

        // Establecer el tamaño del mundo al tamaño del fondo escalado
        scene.physics.world.setBounds(0, 0, bgWidth, bgHeight);

        // Ajustar el tamaño de la cámara para que coincida con el tamaño del fondo escalado
        scene.cameras.main.setBounds(0, 0, bgWidth, bgHeight);

        // Centrar la imagen de fondo
        background.setPosition(bgWidth / 2, bgHeight / 2);

        // Centrar la cámara en la imagen de fondo
        scene.cameras.main.centerOn(bgWidth / 2, bgHeight / 2);
    });
    scene.load.start();
}
