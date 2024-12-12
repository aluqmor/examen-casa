import { Juego } from "./Juego.js";

document.addEventListener("DOMContentLoaded", async () => {
    const juego = new Juego('.contenedor-cartas', '.contenedor', '.carta');
    juego.iniciar();
});