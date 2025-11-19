// ELEMENTOS DEL DOM
const gamesContainer = document.getElementById("gamesContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const storeFilter = document.getElementById("storeFilter");
const priceOrder = document.getElementById("priceOrder");

// BASE
const API_BASE = "https://www.cheapshark.com/api/1.0/deals?pageSize=12";

// =========================================================
// FUNCIÓN PRINCIPAL PARA CARGAR JUEGOS
// =========================================================
async function cargarJuegos(url = API_BASE) {
    try {
        loading.classList.remove("hidden");
        errorMessage.classList.add("hidden");

        const res = await fetch(url);
        const juegos = await res.json();

        gamesContainer.innerHTML = "";

        if (juegos.length === 0) {
            gamesContainer.innerHTML = `
                <p class="text-center text-gray-600 w-full col-span-3 text-xl mt-10">
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

// =========================================================
// BUSCADOR
// =========================================================
searchBtn.addEventListener("click", () => {
    const texto = searchInput.value.trim();

    if (texto === "") {
        cargarJuegos(API_BASE);
        return;
    }

    const url = `${API_BASE}&title=${texto}`;
    cargarJuegos(url);
});

// =========================================================
// FILTRO POR TIENDA
// =========================================================
storeFilter.addEventListener("change", () => {
    const storeID = storeFilter.value;

    let url = API_BASE;

    if (storeID !== "") {
        url = `${API_BASE}&storeID=${storeID}`;
    }

    cargarJuegos(url);
});

// =========================================================
// ORDENAMIENTO POR PRECIO
// =========================================================
priceOrder.addEventListener("change", () => {
    const order = priceOrder.value;

    let url = API_BASE;

    if (order === "asc") {
        url = `${API_BASE}&sortBy=price`;
    }

    if (order === "desc") {
        url = `${API_BASE}&sortBy=price&desc=1`;
    }

    cargarJuegos(url);
});

// =========================================================
// CARGA INICIAL
// =========================================================
cargarJuegos(API_BASE);
