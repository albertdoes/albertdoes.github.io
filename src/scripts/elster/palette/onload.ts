import { createState } from "witting";
import { download } from "@scripts/utils";
import type { ColorSpace } from "./core";
import { Catalogue, Configurator, PaleniaInitializer } from "./components";

window.addEventListener("load", function() {
    //return
    const configurator = Configurator("palenia-configure");
    const catalogue = Catalogue();
    const { addNew, removeCurrent, changeFormat, currentPalette } = PaleniaInitializer(configurator, catalogue);
    document.getElementById("color-board")?.append(catalogue.element);
    
    document.getElementById("add-palette")?.addEventListener("click", addNew);
    document.getElementById("remove-palette")?.addEventListener("click", removeCurrent);
    document.getElementById("color-space")?.addEventListener("input", e => changeFormat((e.target as HTMLSelectElement).value as ColorSpace));
    document.getElementById("save")?.addEventListener("click", () => {
        const obj: Record<string, string> = {};
        const colors = currentPalette();
        colors.forEach((c, i) => { obj[`--color-${colors.length - i}`] = c; });

        download(`palenia-${Date.now()}`, JSON.stringify(obj, undefined, 4));
    })

    const showLabel = createState(false);
    showLabel.attend(state => {
        document.getElementById("color-board")?.setAttribute("data-show-patch-label", String(state));
        document.getElementById("view-colors")?.setAttribute("data-show-patch-label", String(state));
    }, undefined, true);
    document.getElementById("view-colors")?.addEventListener("click", () => showLabel.set(!showLabel.get()));
})