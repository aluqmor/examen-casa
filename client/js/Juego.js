import { uiDrag } from "../js/uiDrag.js";
import { Carta } from "../js/Carta.js";

/**
 * Clase principal del juego que maneja la creación de cartas,
 * el arrastre y la carga/guardado del estado.
 */
export class Juego {
    constructor(contenedorCartasSelector, contenedorSelector, cartaSelector) {
        this.contenedorCartasSelector = contenedorCartasSelector;
        this.contenedorSelector = contenedorSelector;
        this.cartaSelector = cartaSelector;
        this.palos = ['bastos', 'espadas', 'copas', 'oros'];
        this.numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    /**
     * Inicializa el juego creando los elementos DOM,
     * cargando el estado y configurando el arrastre.
     */
    async iniciar() {
        this.crearElementosDOM();
        await this.cargarEstado();
        this.crearCartas();
        this.drag();
    }

    /**
     * Crea los elementos DOM necesarios para el juego.
     */
    crearElementosDOM() {
        const body = document.body;
        const mesa = document.createElement('div');
        mesa.classList.add('mesa');
        const contenedores = [
            { palo: 'bastos', texto: 'BASTOS (VERDE)' },
            { palo: 'espadas', texto: 'ESPADAS (AZUL)' },
            { palo: 'copas', texto: 'COPAS (ROJO)' },
            { palo: 'oros', texto: 'OROS (AMARILLO)' }
        ];
        contenedores.forEach(contenedorInfo => {
            const contenedor = document.createElement('div');
            contenedor.classList.add('contenedor');
            contenedor.dataset.palo = contenedorInfo.palo;
            contenedor.textContent = contenedorInfo.texto;
            mesa.appendChild(contenedor);
        });
        const contenedorCartas = document.createElement('div');
        contenedorCartas.classList.add('contenedor-cartas');
        body.appendChild(mesa);
        body.appendChild(contenedorCartas);
        this.contenedorCartas = contenedorCartas;
    }

    /**
     * Crea las cartas y las añade al contenedor de cartas.
     */
    crearCartas() {
        this.palos.forEach(palo => {
            this.numeros.forEach(numero => {
                const carta = Carta.crearCarta(palo, numero);
                this.contenedorCartas.appendChild(carta);
            });
        });
    }

    /**
     * Inicializa la funcionalidad de arrastre y suelta.
     */
    async drag() {
        uiDrag.init(this.contenedorSelector, this.cartaSelector, this.guardarEstado.bind(this));
    }

    /**
     * Guarda el estado actual de las cartas en el servidor.
     */
    async guardarEstado() {
        try {
            const cartas = Array.from(document.querySelectorAll(this.cartaSelector)).map(carta => ({
                id: carta.id,
                palo: carta.dataset.palo,
                numero: carta.textContent,
                contenedor: carta.parentElement.dataset.palo || 'contenedor-cartas',
                left: carta.style.left,
                top: carta.style.top
            }));

            const response = await fetch('http://localhost:3000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartas)
            });

            if (!response.ok) {
                throw new Error('Error al guardar el estado');
            }
        } catch (error) {
            console.error('Error al guardar el estado:', error);
        }
    }

    /**
     * Carga el estado de las cartas desde el servidor.
     */
    async cargarEstado() {
        try {
            const response = await fetch('http://localhost:3000/api/items');
            if (!response.ok) {
                throw new Error('Error al cargar el estado');
            }
            const cartas = await response.json();

            cartas.forEach(carta => {
                const cartaElement = Carta.crearCarta(carta.palo, carta.numero);
                const contenedor = document.querySelector(`[data-palo="${carta.contenedor}"]`) || this.contenedorCartas;
                cartaElement.style.position = "absolute";
                cartaElement.style.left = carta.left;
                cartaElement.style.top = carta.top;
                contenedor.appendChild(cartaElement);
            });
        } catch (error) {
            console.error('Error al cargar el estado:', error);
        }
    }
}