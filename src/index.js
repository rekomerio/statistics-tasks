import "purecss";
import "purecss/build/grids-responsive.css";
import "./style.scss";
import "whatwg-fetch";
import Articles from "./Articles";

function getCurrentPage() {
    return (parseInt(window.location.hash.substr(1)) || 1) - 1;
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

    // Set the load more button for mobile version
    const btnLoadMore = document.getElementById("load-more");

    btnLoadMore.addEventListener("click", () => {
        articles.loadMoreAndDisplay(btnLoadMore);
    });

    // Set the pagination buttons
    const buttonGroup = document.getElementById("button-group");
    for (let i = 0; i < 3; i++) {
        const btn = document.createElement("button");
        btn.textContent = (i + 1).toString();
        btn.setAttribute("class", "pagination-button");
        btn.addEventListener("click", () => {
            for (const button of document.getElementsByClassName("pagination-button")) {
                button.removeAttribute("data-selected");
            }

            articles.getAndDisplayArticles(i);
            btn.setAttribute("data-selected", "true");
            window.history.pushState("Julkaisut", "Title", "/#" + (i + 1).toString());
        });

        if (page === i) {
            btn.setAttribute("data-selected", "true");
        }
        buttonGroup.appendChild(btn);
    }

    articles.getAndDisplayArticles(page);

    // In case of going back in history
    window.addEventListener("hashchange", () => {
        articles.getAndDisplayArticles(getCurrentPage());
    });
}

window.addEventListener("load", onLoadPage);
