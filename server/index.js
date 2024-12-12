const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

let estadoCartas = [];

/**
 * Endpoint para obtener el estado de las cartas.
 */
app.get('/api/items', (req, res) => {
    try {
        res.json(estadoCartas);
    } catch (error) {
        console.error('Error al obtener el estado:', error);
        res.status(500).json({ message: 'Error al obtener el estado' });
    }
});

/**
 * Endpoint para guardar el estado de las cartas.
 */
app.post('/api/items', (req, res) => {
    try {
        estadoCartas = req.body;
        res.status(201).json({ message: 'Estado guardado' });
    } catch (error) {
        console.error('Error al guardar el estado:', error);
        res.status(500).json({ message: 'Error al guardar el estado' });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});