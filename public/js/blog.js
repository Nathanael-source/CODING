async function loadBlog() {

    const blogList =
        document.getElementById(
            "blogList"
        );

    try {

        const data =
            await apiRequest(
                "/blog"
            );

        if (
            !data.posts ||
            data.posts.length === 0
        ) {
            blogList.innerHTML =
                "<p>Belum ada artikel.</p>";

            return;
        }

        blogList.innerHTML =
            data.posts
                .map(post => {

                    return `
                    <article
                        class="service-card"
                    >

                        <span
                            class="text-blue-400"
                        >
                            ${escapeHTML(post.category || "Umum")}
                        </span>

                        <h2
                            class="text-2xl font-bold mt-3"
                        >
                            ${escapeHTML(post.title)}
                        </h2>

                        <p
                            class="text-gray-400 mt-4"
                        >
                            ${escapeHTML(
                                post.content.substring(0, 150)
                            )}...
                        </p>

                        <p
                            class="text-gray-500 mt-5"
                        >
                            Oleh
                            ${escapeHTML(
                                post.author || "Admin"
                            )}
                        </p>

                    </article>
                    `;

                })
                .join("");

    } catch (error) {

        blogList.textContent =
            error.message;
    }
}

loadBlog();