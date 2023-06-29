import { createState } from "witting";

const mode = createState("dark");
mode.attend((state) => {
    sessionStorage.setItem("mode", state);
    document.documentElement.setAttribute("data-mode", state);
})

const menuExpanded = createState("false");
menuExpanded.attend((state) => {
    document.getElementById("page-menu")?.setAttribute("data-expanded", state);
})

// -----------------------------------------------------------

document.getElementById("toggle-dark-mode")?.addEventListener("click", function() {
    mode.set(mode.get() === "light" ? "dark" : "light");
})

document.getElementById("expand-menu")?.addEventListener("click", function() {
    menuExpanded.set(menuExpanded.get() === "false" ? "true" : "false");
})

document.getElementById("page-menu")?.querySelectorAll("a").forEach(e => {
    e.addEventListener("click", () => menuExpanded.set("false"));
})

window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", function(e) {
    mode.set(e.matches ? "dark" : "light");
})

function fetchAndFill(act: (data: any, key: string, e: Element, uri: string) => void) {
    const fetchingRegister: { [key in string]: any } = {};
    document.querySelectorAll("[data-fetch]").forEach(function(e) {
        const [uri, key] = e.getAttribute("data-fetch")?.split(":") as string[];
        fetchingRegister[uri]
        ? act(fetchingRegister[uri], key, e, uri)
        : fetch(uri)
        .then(res => res.json())
        .then(data => {
                fetchingRegister[uri] = data;
                act(data, key, e, uri);
            });
        });
    }
    
window.addEventListener("load", async function() {
    mode.set(sessionStorage.getItem("mode") as string ?? "dark");

    function handle(data: any, key: string, e: Element, uri: string) {
        uri === "links.json" && e.setAttribute("href", data[key]);
    }
    fetchAndFill(handle);
    (document.querySelector("#page-menu > :last-child") as HTMLElement).style.top = `${document.getElementsByTagName("header")[0].clientHeight}px`;
});