import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

function Modal({ onClose }) {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Configuración</AlertDialogTitle>
          <AlertDialogDescription>
          <p>Cambiar color de barra de enemigos</p>
<Input type="color" id="enemyBarColor" />
<Separator className='my-5'/>
<p>Cambiar color de barra de jugador</p> 
<Input type="color" id="playerBarColor" />
<Separator className='my-5'/>
<p>Numero de oleadas</p>
<Input type="number" id="waveCount" />
<Separator className='my-5'/>
<p>Porcentaje de enemigos por oleada (Ej: 2%)</p>
<Input type="number" id="enemyPercentagePerWave" />
<Separator className='my-5'/>
<p>Vida del jugador</p>
<Input type="number" id="playerHealth" />
<Separator className='my-5'/>
<p>Vida del enemigo</p>
<Input type="number" id="enemyHealth" />
<Separator className='my-5'/>
<p>Daño de las balas del jugador</p>
<Input type="number" id="playerBulletDamage" />
<Separator className='my-5'/>
<p>Daño de las balas del enemigo</p>
<Input type="number" id="enemyBulletDamage" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Modal;
