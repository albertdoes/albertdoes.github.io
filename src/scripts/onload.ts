import type { State } from "witting";
import { createState } from "witting";
import { fetchFill, fadedMarquee } from "./utils";

window.addEventListener("load", function() {
    Handling_dark_mode: {
        const isDark = createState(sessionStorage.getItem("albertdoes-mode") === "dark");
        isDark.attend((state) => {
            const mode = state ? "dark" : "light";
            sessionStorage.setItem("albertdoes-mode", mode);
            document.documentElement.setAttribute("data-mode", mode);
        }, undefined, true);
        document.getElementById("toggle-dark-mode")?.addEventListener("click", () => isDark.set(!isDark.get()));
        window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", (e) => isDark.set(e.matches))
    }

    Page_menu: {
        const menuExpandedBtn = document.getElementById("expand-menu");
        const menu = document.querySelector("#page-menu > :last-child") as HTMLElement;

        const menuExpanded = createState(false);
        menuExpanded.attend(state => {
            menu?.setAttribute("data-menu-expanded", String(state));
            menuExpandedBtn?.setAttribute("data-menu-expanded", String(state));
        });

        document.getElementById("expand-menu")?.addEventListener("click", () => menuExpanded.set(!menuExpanded.get()));
        menu?.querySelectorAll("a").forEach(e => e.addEventListener("click", () => menuExpanded.set(false)));
    }

    Hide_Reveal_Buttons: {
        const actionDict = { "hider": "true", "revealer": "false" };
        type ActorType = keyof typeof actionDict;
        for(let type in actionDict) {
            document.querySelectorAll(`[data-${type}]`).forEach(e => {
                const targetID = e.getAttribute(`data-${type}`) as string;
                const target = document.getElementById(targetID);
                e.addEventListener("click", () => {
                    target?.setAttribute("data-hidden", actionDict[type as ActorType]);
                });
            });
        }
    }

    Tabs: {
        document.querySelectorAll(".tab-wrapper").forEach(p => {
            const tabs: { [key: string]: State<boolean> } = {};
            const switchWrapper = p.querySelector(`.tab-switches`) as HTMLElement;
            p.querySelectorAll(`.tab-body > *`).forEach(tab => {
                const tabSwitch = document.createElement("div");
                tabSwitch.innerHTML = `<span>${tab.id.split("_").join(" ")}</span>`;
                switchWrapper.appendChild(tabSwitch);

                const selected = createState(false);
                selected.attend(state => {
                    tabSwitch.setAttribute("data-tab-selected", String(state));
                    tab.setAttribute("data-tab-selected", String(state));
                    if(!state) return;
                    for(let k in tabs) k !== tab.id && tabs[k].set(false);
                    tabSwitch.scrollIntoView();
                    tab.scrollIntoView();
                }, undefined, true);
                tabs[tab.id] = selected;

                tabSwitch.addEventListener("click", () => selected.set(true));
            })
            tabs[Object.keys(tabs)[0]].set(true);
        })
    }

    Misc: {
        fetchFill(document, (e, value) => e.setAttribute("href", value));
        document.querySelectorAll(".marquee-x").forEach(e => fadedMarquee(e as HTMLElement, "x"));
        document.querySelectorAll(".marquee-y").forEach(e => fadedMarquee(e as HTMLElement, "y"));

        document.querySelectorAll("[data-goto]").forEach(e => {
            e.addEventListener("click", () => {
                const a = document.createElement("a");
                a.setAttribute("href", e.getAttribute("data-goto") as string);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
        })
    }
});