async function loadDashboard() {

    const userInfo =
        document.getElementById(
            "userInfo"
        );

    try {

        const data =
            await apiRequest(
                "/auth/me"
            );

        const user =
            data.user;

        userInfo.innerHTML = `
            <h2 class="text-2xl font-bold">
                Halo, ${escapeHTML(user.name)}
            </h2>

            <p class="text-gray-400 mt-2">
                Email:
                ${escapeHTML(user.email)}
            </p>

            <p class="text-gray-400 mt-2">
                Role:
                ${escapeHTML(user.role)}
            </p>
        `;

        if (user.role === "admin") {
            loadAdmin();
        }

    } catch {

        window.location.href =
            "/login.html";
    }
}


async function loadAdmin() {

    const adminPanel =
        document.getElementById(
            "adminPanel"
        );

    const usersContainer =
        document.getElementById(
            "users"
        );

    adminPanel.classList.remove(
        "hidden"
    );

    try {

        const data =
            await apiRequest(
                "/admin/users"
            );

        usersContainer.innerHTML = `
            <div class="overflow-x-auto">

                <table class="w-full text-left">

                    <thead>
                        <tr class="border-b border-gray-700">
                            <th class="p-3">ID</th>
                            <th class="p-3">Nama</th>
                            <th class="p-3">Email</th>
                            <th class="p-3">Role</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${data.users.map(user => `
                            <tr class="border-b border-gray-800">

                                <td class="p-3">
                                    ${user.id}
                                </td>

                                <td class="p-3">
                                    ${escapeHTML(user.name)}
                                </td>

                                <td class="p-3">
                                    ${escapeHTML(user.email)}
                                </td>

                                <td class="p-3">
                                    ${escapeHTML(user.role)}
                                </td>

                            </tr>
                        `).join("")}

                    </tbody>

                </table>

            </div>
        `;

    } catch (error) {

        usersContainer.textContent =
            error.message;
    }
}


document
    .getElementById("logoutButton")
    ?.addEventListener(
        "click",
        async () => {

            await apiRequest(
                "/auth/logout",
                {
                    method: "POST"
                }
            );

            window.location.href =
                "/login.html";
        }
    );


loadDashboard();