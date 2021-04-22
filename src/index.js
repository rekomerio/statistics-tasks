import "purecss";
import "purecss/build/grids-responsive.css";
import "./style.scss";
import "whatwg-fetch";
import Articles from "./Articles";

const articles = new Articles();

function getCurrentPage() {
    return window.location.pathname.split("/")[1] || 1;
}

function onLoadPage() {
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

    articles.getAndDisplayArticles(page);
}

window.addEventListener("load", onLoadPage);
