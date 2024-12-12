export class Carta {
    static crearCarta(palo, numero) {
        const carta = document.createElement('div');
        carta.classList.add('carta', palo);
        carta.dataset.palo = palo;
        carta.id = `${palo}${numero}`;
        carta.textContent = numero;
        return carta;
    }
}