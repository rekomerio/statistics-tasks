import { differenceInDays } from "date-fns";
import * as GLOBALS from "./globals";

export default class Articles {
    Articles() {
        this.data = null;
        this.articles = [];
        this.isCompact = false;
        this.previousPage = 1;
    }

    getAndDisplayArticles(page) {
        fetch(GLOBALS.API_ENDPOINT + page)
            .then((response) => response.json())
            .then((data) => {
                this.data = data.response;
                this.articles = data.response.docs;
                document.getElementById(
                    "num-results"
                ).textContent = `${data.response.numFound} tulosta`;
                this.render();
            })
            .catch((err) => void console.error(err));
    }

    loadMoreAndDisplay() {
        ++this.previousPage;
        fetch(GLOBALS.API_ENDPOINT + this.previousPage)
            .then((response) => response.json())
            .then((data) => {
                this.articles = [...this.articles, ...data.response.docs];
                this.render();
            })
            .catch((err) => void console.error(err));
    }

    setCompactMode(isCompact) {
        if (isCompact === this.isCompact) return;

        this.isCompact = isCompact;
        this.render();
    }

    render() {
        const articleElements = this.articles.map((article) =>
            this.createArticleElement(article)
        );
        // Use fragment for better performance
        const fragment = document.createDocumentFragment();

        articleElements.forEach((element) => {
            fragment.appendChild(element);
        });

        const articlesContainer = document.getElementById("articles");

        if (this.isCompact) {
            articlesContainer.setAttribute("class", "compact");
        } else {
            articlesContainer.removeAttribute("class");
        }

        // Remove all existing children
        while (articlesContainer.childElementCount) {
            articlesContainer.removeChild(articlesContainer.childNodes[0]);
        }

        articlesContainer.appendChild(fragment);
    }

    createArticleElement(article) {
        const container = document.createElement("div");
        container.setAttribute("class", this.withCompact("article-container"));

        const idText = document.createElement("span");
        idText.textContent = article.site_id;

        const content = document.createElement("div");
        content.setAttribute("class", "article-content");

        const type = document.createElement("span");
        type.setAttribute("class", this.withCompact("article-type"));
        type.textContent = article.content_type;

        const date = document.createElement("span");
        date.setAttribute("class", "article-date");
        date.textContent =
            differenceInDays(new Date(), new Date(article.content_date)) + " päivää sitten";

        const title = document.createElement("a");
        title.setAttribute("class", this.withCompact("article-title"));
        title.setAttribute("href", article.id);
        title.textContent = article.title_original;

        const authors = document.createElement("span");
        authors.setAttribute("class", "authors");
        authors.textContent = article.author ? article.author.join(", ") : "";

        const divider = document.createElement("div");
        const hr = document.createElement("hr");
        hr.setAttribute("class", "vertical");
        divider.appendChild(hr);

        if (this.isCompact) {
            container.appendChild(title);
            const compactContainer = document.createElement("div");
            compactContainer.setAttribute("class", "article-compact-content");
            idText.setAttribute("class", "article-id-compact");
            compactContainer.appendChild(idText);
            compactContainer.appendChild(type);
            compactContainer.appendChild(divider);
            compactContainer.appendChild(date);
            compactContainer.appendChild(authors);
            container.appendChild(compactContainer);
        } else {
            const id = document.createElement("div");
            id.setAttribute(
                "class",
                "article-id ".concat(this.getContentType(article.content_type)).trimEnd()
            );

            if (this.getContentType(article.content_type) === "") {
                idText.style.color = getComputedStyle(
                    document.documentElement
                ).getPropertyValue("--primary-color");
            }

            id.appendChild(idText);
            container.appendChild(id);

            const img = document.createElement("img");
            img.setAttribute("src", article.img_url);
            container.appendChild(img);
            date.appendChild(authors);
            const dividerAndType = document.createElement("span");
            dividerAndType.setAttribute("class", "flex");
            divider.style.display = "inline";
            divider.style.marginRight = "8px";
            dividerAndType.appendChild(divider);
            dividerAndType.appendChild(type);
            content.appendChild(dividerAndType);
            content.appendChild(date);
            content.appendChild(title);

            container.appendChild(content);
        }
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

    withCompact(className, alt = "") {
        return className
            .concat(" ")
            .concat(this.isCompact ? "compact" : alt)
            .trimEnd();
    }
}
