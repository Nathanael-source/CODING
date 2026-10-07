const loginForm =
    document.getElementById(
        "loginForm"
    );

const registerForm =
    document.getElementById(
        "registerForm"
    );


loginForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        const result =
            document
                .getElementById("result");

        try {

            const data =
                await apiRequest(
                    "/auth/login",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

            result.textContent =
                data.message;

            window.location.href =
                "/dashboard.html";

        } catch (error) {

            result.textContent =
                error.message;
        }
    }
);


registerForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const name =
            document
                .getElementById("name")
                .value
                .trim();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        const result =
            document
                .getElementById("result");

        try {

            const data =
                await apiRequest(
                    "/auth/register",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );

            result.textContent =
                data.message;

            setTimeout(() => {
                window.location.href =
                    "/login.html";
            }, 1000);

        } catch (error) {

            result.textContent =
                error.message;
        }
    }
);