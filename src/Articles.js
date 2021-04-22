import { differenceInDays } from "date-fns";
import * as GLOBALS from "./globals";

export default class Articles {
    Articles() {
        this.data = null;
        this.isCompact = false;
    }

    getAndDisplayArticles(page) {
        fetch(GLOBALS.API_ENDPOINT + page)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.response);
                this.data = data.response;
                document.getElementById(
                    "num-results"
                ).textContent = `${data.response.numFound} tulosta`;
                this.render();
            })
            .catch((err) => void console.error(err));
    }

    setCompactMode(isCompact) {
        this.isCompact = isCompact;
        this.render();
    }

    render() {
        const articleElements = this.data.docs.map((article) =>
            this.createArticleElement(article)
        );
        // Use fragment for better performance
        const fragment = document.createDocumentFragment();

        articleElements.forEach((element) => {
            fragment.appendChild(element);
        });

        const articlesContainer = document.getElementById("articles");
        // Remove all existing children
        while (articlesContainer.childElementCount) {
            articlesContainer.removeChild(articlesContainer.childNodes[0]);
        }

        articlesContainer.appendChild(fragment);
    }

    createArticleElement(article) {
        const container = document.createElement("div");
        container.setAttribute("class", "article-container");

        const id = document.createElement("div");
        id.setAttribute(
            "class",
            "article-id ".concat(this.getContentType(article.content_type)).trimEnd()
        );
        const idText = document.createElement("p");
        idText.textContent = article.site_id;

        if (this.getContentType(article.content_type) === "") {
            idText.style.color = getComputedStyle(document.documentElement).getPropertyValue(
                "--primary-color"
            );
        }

        id.appendChild(idText);

        if (!this.isCompact) {
            const img = document.createElement("img");
            img.setAttribute("src", article.img_url);
            container.appendChild(img);
        }

        const content = document.createElement("div");
        content.setAttribute("class", "article-content");

        const type = document.createElement("p");
        type.setAttribute("class", "article-type");
        type.textContent = article.content_type;

        const date = document.createElement("p");
        date.setAttribute("class", "article-date");
        date.textContent =
            differenceInDays(new Date(), new Date(article.content_date)) + " päivää sitten";

        const title = document.createElement("a");
        title.setAttribute("class", "article-title");
        title.setAttribute("href", article.id);
        title.textContent = article.title_original;

        container.appendChild(id);

        content.appendChild(type);
        content.appendChild(date);
        content.appendChild(title);

        container.appendChild(content);

        return container;
    }

    getContentType(contentType) {
        if (contentType === "blogi") {
            return "blog";
        }
        if (contentType === "indikaattori") {
            return "indicator";
        }
        return "";
    }
}
