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
    articles.getAndDisplayArticles(page);
}

window.addEventListener("load", onLoadPage);
