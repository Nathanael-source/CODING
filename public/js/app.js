const API = "/api";

function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = String(value ?? "");

    return div.innerHTML;
}

function formatRupiah(value) {
    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(value);
}

async function apiRequest(
    url,
    options = {}
) {
    const response = await fetch(
        `${API}${url}`,
        {
            credentials: "include",

            headers: {
                "Content-Type":
                    "application/json",

                ...(options.headers || {})
            },

            ...options
        }
    );

    const data =
        await response.json()
            .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Request gagal."
        );
    }

    return data;
}


document
    .getElementById("contactForm")
    ?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const name =
                document
                    .getElementById(
                        "contactName"
                    )
                    .value
                    .trim();

            const email =
                document
                    .getElementById(
                        "contactEmail"
                    )
                    .value
                    .trim();

            const message =
                document
                    .getElementById(
                        "contactMessage"
                    )
                    .value
                    .trim();

            const result =
                document
                    .getElementById(
                        "contactResult"
                    );

            if (
                name.length < 2 ||
                email.length < 5 ||
                message.length < 5
            ) {
                result.textContent =
                    "Data belum valid.";

                return;
            }

            result.textContent =
                "Pesan berhasil disiapkan. Backend contact dapat dihubungkan berikutnya.";

        }
    );


window.escapeHTML =
    escapeHTML;

window.formatRupiah =
    formatRupiah;

window.apiRequest =
    apiRequest;