export const uiDrag = {
    init: (contenedorSelector, cartaSelector, guardarEstadoCallback) => {
        document.querySelectorAll(contenedorSelector).forEach((contenedor) => {
            contenedor.addEventListener("drop", (event) => {
                event.preventDefault();
                const data = JSON.parse(event.dataTransfer.getData("text"));
                const draggedElement = document.getElementById(data.id);
                const rect = event.target.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const offsetY = event.clientY - rect.top;

                // Solo permite soltar en contenedores con el mismo palo
                if (event.target.dataset.palo === draggedElement.dataset.palo) {
                    draggedElement.style.position = "absolute";
                    draggedElement.style.left = offsetX - (draggedElement.offsetWidth / 2) + "px";
                    draggedElement.style.top = offsetY - (draggedElement.offsetHeight / 2) + "px";

                    if (!event.target.contains(draggedElement)) {
                        event.target.appendChild(draggedElement);
                    }

                    guardarEstadoCallback();
                }
            });

            contenedor.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
        });

        document.querySelectorAll(cartaSelector).forEach((carta) => {
            carta.setAttribute("draggable", "true");
            carta.addEventListener("dragstart", (event) => {
                const sendData = {
                    id: event.target.id
                };
                event.dataTransfer.setData("text", JSON.stringify(sendData));
            });
        });
    }
};