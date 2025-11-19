// ELEMENTOS DEL DOM
const gamesContainer = document.getElementById("gamesContainer");
const loading = document.getElementById("loading") || null;
const errorMessage = document.getElementById("errorMessage") || null;

// API BASE – carga 12 juegos por defecto
const API_URL = "https://www.cheapshark.com/api/1.0/deals?pageSize=12";

// FUNCIÓN PRINCIPAL PARA CARGAR JUEGOS
async function cargarJuegos() {
    try {
        if (loading) loading.classList.remove("hidden");
        if (errorMessage) errorMessage.classList.add("hidden");

        const respuesta = await fetch(API_URL);
        const juegos = await respuesta.json();

        gamesContainer.innerHTML = "";

        juegos.forEach(juego => {
            const card = document.createElement("div");
            card.className = "bg-white shadow-md rounded p-4";

            card.innerHTML = `
                <img src="${juego.thumb}" class="w-full h-40 object-cover rounded"/>
                <h3 class="text-xl font-semibold mt-3">${juego.title}</h3>
                <p class="line-through text-gray-500">Precio normal: $${juego.normalPrice}</p>
                <p class="text-green-600 font-bold">Oferta: $${juego.salePrice}</p>
            `;

            gamesContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        if (errorMessage) errorMessage.classList.remove("hidden");
    } finally {
        if (loading) loading.classList.add("hidden");
    }
}

// CARGAR JUEGOS AL INICIO
cargarJuegos();
