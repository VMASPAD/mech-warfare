import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@radix-ui/react-label";

function Modal({ onClose} : any ) {

    function saveNewData(name: string, data: any) {
        localStorage.setItem(name, data);
    }
    function getData(name: string) {
        const data = localStorage.getItem(name);
        if (data === null) {
            localStorage.setItem(name, "");
            return "";
        }
        return data;
        return data
    }
    function saveData() {
        const enemyBarColor = document.getElementById("enemyBarColor") as HTMLInputElement;
        const playerBarColor = document.getElementById("playerBarColor") as HTMLInputElement;
        const waveCount = document.getElementById("waveCount") as HTMLInputElement;
        const enemyPercentagePerWave = document.getElementById("enemyPercentagePerWave") as HTMLInputElement;
        const playerHealth = document.getElementById("playerHealth") as HTMLInputElement;
        const enemyHealth = document.getElementById("enemyHealth") as HTMLInputElement;
        const playerBulletDamage = document.getElementById("playerBulletDamage") as HTMLInputElement;
        const enemyBulletDamage = document.getElementById("enemyBulletDamage") as HTMLInputElement;

        saveNewData("enemyBarColor", enemyBarColor.value);
        saveNewData("playerBarColor", playerBarColor.value);
        saveNewData("waveCount", waveCount.value);
        saveNewData("enemyPercentagePerWave", enemyPercentagePerWave.value);
        saveNewData("playerHealth", playerHealth.value);
        saveNewData("enemyHealth", enemyHealth.value);
        saveNewData("playerBulletDamage", playerBulletDamage.value);
        saveNewData("enemyBulletDamage", enemyBulletDamage.value);
    }


    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Configuration</AlertDialogTitle>
                    <AlertDialogDescription>
                        <p>Change enemy bar color (ONLY HEX)</p>
                        <Label htmlFor="enemyBarColor">{getData("enemyBarColor")}</Label>
                        <Input type="color" id="enemyBarColor" />
                        <Separator className="my-3" />
                        <p>Change player bar color (ONLY HEX)</p>
                        <Label htmlFor="playerBarColor">{getData("playerBarColor")}</Label>
                        <Input type="color" id="playerBarColor" />
                        <Separator className="my-3" />
                        <p>Number of waves</p>
                        <Label htmlFor="waveCount">{getData("waveCount")}</Label>
                        <Input type="number" id="waveCount" />
                        <Separator className="my-3" />
                        <p>Enemy percentage per wave (e.g., 2%)</p>
                        <Label htmlFor="enemyPercentagePerWave">{getData("enemyPercentagePerWave")}</Label>
                        <Input type="number" id="enemyPercentagePerWave" />
                        <Separator className="my-3" />
                        <p>Player health</p>
                        <Label htmlFor="playerHealth">{getData("playerHealth")}</Label>
                        <Input type="number" id="playerHealth" />
                        <Separator className="my-3" />
                        <p>Enemy health</p>
                        <Label htmlFor="enemyHealth">{getData("enemyHealth")}</Label>
                        <Input type="number" id="enemyHealth" />
                        <Separator className="my-3" />
                        <p>Player bullet damage</p>
                        <Label htmlFor="playerBulletDamage">{getData("playerBulletDamage")}</Label>
                        <Input type="number" id="playerBulletDamage" />
                        <Separator className="my-3" />
                        <p>Enemy bullet damage</p>
                        <Label htmlFor="enemyBulletDamage">{getData("enemyBulletDamage")}</Label>
                        <Input type="number" id="enemyBulletDamage" />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => saveData()}>Aceptar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default Modal;
