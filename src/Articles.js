import * as GLOBALS from "./globals";
import { niceDateFormat } from "./utils";

const States = {
    Error: 0,
    Loading: 1,
    Default: 2,
};

export default class Articles {
    constructor() {
        this.data = null;
        this.articles = [];
        this.isCompact = false;
        this.currentPage = 0;
        this.state = States.Default;
    }

    getAndDisplayArticles(page) {
        this.currentPage = page;
        this.state = States.Loading;
        this.render();
        fetch(GLOBALS.API_ENDPOINT + page)
            .then((response) => response.json())
            .then((data) => {
                this.state = States.Default;

                if (!data.response) {
                    this.articles = [];
                    return;
                }

                this.data = data.response;
                this.articles = data.response.docs;
                document.getElementById(
                    "num-results"
                ).textContent = `${data.response.numFound} tulosta`;
            })
            .catch((err) => {
                console.error(err);
                this.state = States.Error;
            })
            .finally(() => {
                this.render();
            });
    }

    loadMoreAndDisplay(element) {
        let isEmptyResponse = false;
        element.disabled = true;
        ++this.currentPage;
        this.state = States.Loading;
        this.render();
        fetch(GLOBALS.API_ENDPOINT + this.currentPage)
            .then((response) => response.json())
            .then((data) => {
                this.state = States.Default;

                if (!data.response) {
                    isEmptyResponse = true;
                    return;
                }

                this.articles = [...this.articles, ...data.response.docs];
            })
            .catch((err) => {
                console.error(err);
                this.state = States.Error;
            })
            .finally(() => {
                if (this.articles.length < this.data.numFound && !isEmptyResponse) {
                    element.disabled = false;
                } else {
                    element.textContent = "Ei lisää julkaisuja";
                }
                this.render();
            });
    }

    setCompactMode(isCompact) {
        if (isCompact === this.isCompact) return;

        this.isCompact = isCompact;
        this.render();
    }

    render() {
        this.removeOverlay();
        switch (this.state) {
            case States.Default:
                this.renderArticles();
                break;
            case States.Error: {
                this.renderOverlay("Virhe tapahtui. Päivitä sivu");
                break;
            }
            case States.Loading: {
                this.renderOverlay("Ladataan...");
                break;
            }
        }
    }

    renderOverlay(msg) {
        const overlay = document.createElement("div");
        overlay.setAttribute("id", "overlay");
        const text = document.createElement("h1");
        text.textContent = msg;
        overlay.appendChild(text);
        document.body.appendChild(overlay);
    }

    removeOverlay() {
        const overlay = document.getElementById("overlay");

        if (!overlay) {
            return;
        }

        document.body.removeChild(overlay);
    }

    renderArticles() {
        const articlesContainer = document.getElementById("articles");

        if (!articlesContainer) {
            console.error("Cannot find #articles element!");
            return;
        }

        // Remove all existing children
        while (articlesContainer.childElementCount) {
            articlesContainer.removeChild(articlesContainer.childNodes[0]);
        }

        if (!this.articles.length) {
            const msg = document.createElement("h1");
            msg.textContent = "404";
            articlesContainer.appendChild(msg);
            return;
        }

        const articleElements = this.articles.map((article) =>
            this.createArticleElement(article)
        );
        // Use fragment for better performance
        const fragment = document.createDocumentFragment();

        articleElements.forEach((element) => {
            fragment.appendChild(element);
        });

        if (this.isCompact) {
            articlesContainer.setAttribute("class", "compact");
        } else {
            articlesContainer.removeAttribute("class");
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
        date.textContent = niceDateFormat(new Date(), new Date(article.content_date));

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
