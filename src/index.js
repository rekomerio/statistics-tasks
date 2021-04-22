import "purecss";
import "purecss/build/grids-responsive.css";
import "./style.scss";
import "whatwg-fetch";
import Articles from "./Articles";

function getCurrentPage() {
    return parseInt(window.location.hash.substr(1)) || 0;
}

function onLoadPage() {
    const articles = new Articles();

    const page = getCurrentPage();

    const clearActiveAttribute = () => {
        for (const button of document.getElementsByClassName("view-button")) {
            button.removeAttribute("data-active");
        }
    };

    const btnWide = document.getElementById("button-wide");

    btnWide.addEventListener("click", (e) => {
        clearActiveAttribute();
        btnWide.setAttribute("data-active", "true");
        articles.setCompactMode(false);
    });

    const btnNarrow = document.getElementById("button-narrow");

    btnNarrow.addEventListener("click", (e) => {
        clearActiveAttribute();
        btnNarrow.setAttribute("data-active", "true");
        articles.setCompactMode(true);
    });

    const btnLoadMore = document.getElementById("load-more");

    btnLoadMore.addEventListener("click", () => {
        articles.loadMoreAndDisplay(btnLoadMore);
    });

    articles.getAndDisplayArticles(page);
}

window.addEventListener("load", onLoadPage);
