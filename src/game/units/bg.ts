export default function bg(scene: Phaser.Scene): void {
    scene.load.setPath('assets');
    scene.load.image('bg', 'bg.png');
    scene.load.once('complete', () => {
        const background = scene.add.image(1000, 0, 'bg').setOrigin(0.5, 0.5);

        // Ajustar los límites del mundo al tamaño del fondo
        const bgWidth = background.width;
        const bgHeight = background.height;

        // Establecer el tamaño del mundo al tamaño del fondo
        scene.physics.world.setBounds(0, 0, bgWidth, bgHeight);

        // Ajustar el tamaño de la cámara para que coincida con el tamaño del fondo
        scene.cameras.main.setBounds(0, 0, bgWidth, bgHeight);

        // Centrar la imagen de fondo
        background.setPosition(bgWidth / 2, bgHeight / 2);

        // Centrar la cámara en la imagen de fondo
        scene.cameras.main.centerOn(bgWidth / 2, bgHeight / 2);
    });
    scene.load.start();
}