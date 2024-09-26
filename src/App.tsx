import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
import Modal from './game/scenes/Modal'; // Tu componente modal

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (phaserRef.current?.game) {
            // Escuchar el evento 'openModal' emitido desde Phaser
            phaserRef.current.game.events.on('openModal', () => {
                setIsModalOpen(true); // Mostrar el modal cuando se emita el evento
            });
        }

        return () => {
            if (phaserRef.current?.game) {
                phaserRef.current.game.events.off('openModal');
            }
        };
    }, []);

    return ( 
        <div id="app">
        <PhaserGame ref={phaserRef} />
        {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </div>
    );
}

export default App;
