const productList =
    document.getElementById(
        "productList"
    );

let products = [];

function getCart() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}

function updateCartCount() {
    const cart = getCart();

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    document
        .getElementById("cartCount")
        .textContent = count;
}

function addToCart(productId) {
    const cart = getCart();

    const existing =
        cart.find(
            item =>
                item.productId === productId
        );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            productId,
            quantity: 1
        });
    }

    saveCart(cart);

    updateCartCount();
}

async function loadProducts() {
    try {

        const data =
            await apiRequest(
                "/products"
            );

        products =
            data.products;

        productList.innerHTML =
            products
                .map(product => {

                    return `
                    <article
                        class="service-card"
                    >

                        <img
                            src="${escapeHTML(product.image_url)}"
                            alt="${escapeHTML(product.name)}"
                            class="w-full h-56 object-cover rounded-xl mb-5"
                            loading="lazy"
                        >

                        <h2
                            class="text-2xl font-bold"
                        >
                            ${escapeHTML(product.name)}
                        </h2>

                        <p
                            class="text-gray-400 mt-3"
                        >
                            ${escapeHTML(product.description)}
                        </p>

                        <p
                            class="text-xl font-bold mt-5"
                        >
                            ${formatRupiah(product.price)}
                        </p>

                        <p
                            class="text-gray-500 mt-2"
                        >
                            Stok:
                            ${product.stock}
                        </p>

                        <button
                            class="btn-primary w-full mt-5"
                            onclick="addToCart(${product.id})"
                        >
                            Tambah ke Keranjang
                        </button>

                    </article>
                    `;
                })
                .join("");

    } catch (error) {

        productList.innerHTML =
            `<p>${escapeHTML(error.message)}</p>`;
    }
}

loadProducts();

updateCartCount();