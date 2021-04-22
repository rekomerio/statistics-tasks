import "purecss";
import "purecss/build/grids-responsive.css";
import "./style.scss";
import "whatwg-fetch";

import * as GLOBALS from "./globals";

function getAndDisplayArticles(page) {
    fetch(GLOBALS.API_ENDPOINT + page)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.response);
            renderArticles(data.response.docs);
        })
        .catch((err) => void console.error(err));
}

function renderArticles(articles) {
    const articleElements = articles.map(createArticleElement);
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

function createArticleElement(article, size) {
    const container = document.createElement("div");
    container.setAttribute("class", "article-container");

    const id = document.createElement("div");
    id.setAttribute(
        "class",
        "article-id ".concat(getContentType(article.content_type)).trimEnd()
    );
    const idText = document.createElement("p");
    idText.textContent = article.site_id;

    if (getContentType(article.content_type) === "") {
        idText.style.color = getComputedStyle(document.documentElement).getPropertyValue(
            "--primary-color"
        );
    }

    id.appendChild(idText);

    const img = document.createElement("img");
    img.setAttribute("src", article.img_url);

    const content = document.createElement("div");
    content.setAttribute("class", "article-content");

    const type = document.createElement("p");
    type.setAttribute("class", "article-type");
    type.textContent = article.content_type;

    const date = document.createElement("p");
    date.setAttribute("class", "article-date");
    date.textContent = article.content_date;

    const title = document.createElement("a");
    title.setAttribute("class", "article-title");
    title.setAttribute("href", article.id);
    title.textContent = article.title_original;

    container.appendChild(id);
    container.appendChild(img);

    content.appendChild(type);
    content.appendChild(date);
    content.appendChild(title);

    container.appendChild(content);

    return container;
}

function getContentType(contentType) {
    if (contentType === "blogi") {
        return "blog";
    }
    if (contentType === "indikaattori") {
        return "indicator";
    }
    return "";
}

function getCurrentPage() {
    return window.location.pathname.split("/")[1] || 1;
}

function onLoadPage() {
    const page = getCurrentPage();
    getAndDisplayArticles(page);
}

window.addEventListener("load", onLoadPage);
