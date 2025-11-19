// ELEMENTOS DEL DOM
const gamesContainer = document.getElementById("gamesContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const storeFilter = document.getElementById("storeFilter");
const priceOrder = document.getElementById("priceOrder");

// MODAL
const modal = document.getElementById("gameModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

// API base
const API_BASE = "https://www.cheapshark.com/api/1.0/deals?pageSize=12";


// ==============================================
// Cargar juegos
// ==============================================
async function cargarJuegos(url = API_BASE) {
    try {
        loading.classList.remove("hidden");
        errorMessage.classList.add("hidden");

        const res = await fetch(url);
        const juegos = await res.json();

        gamesContainer.innerHTML = "";

        if (juegos.length === 0) {
            gamesContainer.innerHTML = `
                <p class="text-center text-gray-600 col-span-3 text-xl mt-10">
                    No se encontraron resultados.
                </p>
            `;
            return;
        }

        juegos.forEach(juego => {
            const card = document.createElement("div");
            card.className = "bg-white shadow-lg rounded-lg p-4";

            card.innerHTML = `
                <img src="${juego.thumb}" class="w-full h-40 object-cover rounded-md" />

                <h3 class="text-xl font-semibold mt-3">${juego.title}</h3>

                <p class="text-gray-500 line-through text-sm">
                    Precio normal: $${juego.normalPrice}
                </p>

                <p class="text-green-600 font-bold text-lg">
                    Oferta: $${juego.salePrice}
                </p>

                <button onclick="verDetalle('${juego.gameID}')"
                    class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Ver detalle
                </button>
            `;

            gamesContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error API:", error);
        errorMessage.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
    }
}


// ==============================================
// Ver detalle con MODAL
// ==============================================
async function verDetalle(id) {
    modal.classList.remove("hidden");

    modalContent.innerHTML = `
        <p class="text-center text-gray-600">Cargando detalles...</p>
    `;

    const url = `https://www.cheapshark.com/api/1.0/games?id=${id}`;
    const res = await fetch(url);
    const data = await res.json();

    const info = data.info;
    const cheap = data.deals[0];

    modalContent.innerHTML = `
        <img src="${info.thumb}" class="w-full rounded mb-3"/>

        <h2 class="text-2xl font-bold mb-2">${info.title}</h2>

        <p><strong>Precio más barato:</strong> $${cheap.price}</p>
        <p><strong>Rating Steam:</strong> ${info.steamRatingText || "N/A"}</p>
        <p><strong>Desarrollador:</strong> ${info.developer}</p>
        <p><strong>Publisher:</strong> ${info.publisher}</p>
        <p><strong>Lanzado en:</strong> ${
            info.releaseDate
                ? new Date(info.releaseDate * 1000).toLocaleDateString()
                : "N/D"
        }</p>
    `;
}


// ==============================================
// Cerrar modal
// ==============================================
closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
});


// ==============================================
// Buscador
// ==============================================
searchBtn.addEventListener("click", () => {
    const text = searchInput.value.trim();

    if (text === "") return cargarJuegos(API_BASE);

    const url = `${API_BASE}&title=${text}`;
    cargarJuegos(url);
});


// ==============================================
// Filtro por tienda
// ==============================================
storeFilter.addEventListener("change", () => {
    const storeID = storeFilter.value;

    let url = API_BASE;
    if (storeID !== "") url = `${API_BASE}&storeID=${storeID}`;

    cargarJuegos(url);
});


// ==============================================
// Ordenar por precio
// ==============================================
priceOrder.addEventListener("change", () => {
    const order = priceOrder.value;

    let url = API_BASE;

    if (order === "asc") url = `${API_BASE}&sortBy=price`;
    if (order === "desc") url = `${API_BASE}&sortBy=price&desc=1`;

    cargarJuegos(url);
});


// ==============================================
// CARGA INICIAL
// ==============================================
cargarJuegos();
