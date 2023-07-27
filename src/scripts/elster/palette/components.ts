import type { CubicBezierEaseHandles } from "../../bezier";
import type { Config, ColorSpace, HSLColor, RGBColor } from "./core";

import { createState, State } from "witting";
import { createPalette, HEXString, HSLString, HSLToHEX, HSLToRGB, RGBString } from "./core";
import { access, isNumeric } from "@scripts/utils";

function _transformer (hsl: HSLColor, format: ColorSpace) {
    let colorString;
    if(format === "hex") colorString = HEXString(HSLToHEX(hsl))
    else if(format === "rgb") colorString = RGBString(HSLToRGB(hsl));
    else colorString = HSLString(hsl)
    return colorString;
}

const COLOR_SPACE = createState("hex" as ColorSpace);

function Patch() {
    const element = document.createElement("div");
    element.classList.add("palenia-patch");

    const color: State<HSLColor> = createState({ hue: 0, saturation: 0, luminosity: 0 });
    function attend(hsl: HSLColor, format: ColorSpace) {
        const hex = _transformer(hsl, "hex");

        element.style.backgroundColor = hex;
        element.setAttribute("data-patch-contrast", (parseInt(hex.slice(1), 16) > 0xffffff / 2) ? "black" : "white");
        element.setAttribute("data-patch-label", _transformer(hsl, format));
    }
    color.attend(state => attend(state, COLOR_SPACE.get()));
    COLOR_SPACE.attend(state => attend(color.get(), state), undefined, true);

    function setColor(newColor: HSLColor) {
        color.set(newColor);
    }

    return {
        element,
        setColor,
    };
}
type Patch = ReturnType<typeof Patch>;

function Palette() {
    const element = document.createElement("div");
    element.classList.add("palenia-palette");

    const isSelectedState = createState(false);
    isSelectedState.attend(state => {
        element.setAttribute("data-palette-selected", String(state));
    }, undefined, true);

    let onSelectCallback = () => {};

    element.addEventListener("click", () => {
        select();
        element.scrollIntoView();
    });

    const patches: Patch[] = [];

    function push() {
        const patch = Patch();
        element.appendChild(patch.element);
        patches.push(patch);
    }

    function pop() {
        const patch = patches.pop()
        patch && element.removeChild(patch.element);
    }

    function select() {
        isSelectedState.set(true);
        onSelectCallback();
    }

    function unselect() {
        isSelectedState.set(false);
    }

    function isSelected() {
        return isSelectedState.get();
    }

    function setPalette(colors: HSLColor[]) {
        if(colors.length !== patches.length) {
            const diff = patches.length - colors.length;
            const act = diff > 0 ? pop : push;
            for(let i = 0; i < Math.abs(diff); i++) { act(); }
        }
        colors.forEach((c, i) => patches[i].setColor(c));
    }

    function onSelected(callback: () => void) {
        onSelectCallback = callback;
    }

    return {
        element,
        select,
        unselect,
        isSelected,
        setPalette,
        onSelected,
    }
}
type Palette = ReturnType<typeof Palette>;

function Catalogue() {
    const element = document.createElement("div");
    element.classList.add("palenia-catalogue");

    const palettes: Palette[] = [];

    let onPaletteSwitchCallback = (index: number) => {};

    function push() {
        const palette = Palette();
        palettes.push(palette);
        element.appendChild(palette.element);
        palette.onSelected(() => {
            palettes.forEach(p => p !== palette && p.unselect());
            palettes.forEach((p, i) => {
                p.isSelected() && onPaletteSwitchCallback(i);
            })
        });

        palettes.length == 1 && palette.select();
    }

    function remove(index: number) {
        const deleted = palettes.splice(index, 1)[0];
        element.removeChild(deleted.element);
        (palettes[index] ?? palettes[index - 1]).select();
    }

    function setPalette(colors: HSLColor[], index?: number) {
        if(index === undefined || !palettes[index]) {
            push();
            setPalette(colors, palettes.length - 1);
        }
        else { palettes[index].setPalette(colors) };
    }

    function onPaletteSwitch(callback: (index: number) => void) {
        onPaletteSwitchCallback = callback;
    }

    return {
        element,
        remove,
        setPalette,
        onPaletteSwitch,
    }
}
type Catalogue = ReturnType<typeof Catalogue>;

const FROM_KEYS = [
    "steps",
    "range.a.start",
    "range.a.end",
    "range.b.start",
    "range.b.end",
    "range.c.start",
    "range.c.end",
    "easing.a",
    "easing.b",
    "easing.c",
] as const;

type FormKeys = typeof FROM_KEYS[number];
type FormElements = HTMLFormControlsCollection & {
    [key in FormKeys]: HTMLInputElement;
};

function Configurator(formID: string) {
    const configs: Config[] = [];
    const form: HTMLFormElement = document.getElementById(formID) as HTMLFormElement;
    const inputs: FormElements = form.elements as FormElements;

    let onFormChangeCallback = { cb: () => {} };

    for(let k of FROM_KEYS) {
        inputs[k].addEventListener("input", () => onFormChangeCallback.cb());
    }

    function setConfig(configIndex?: number) {
        if(configIndex === undefined || !configs[configIndex]) {
            push();
            setConfig(configs.length - 1);
        } else {
            for(let k of FROM_KEYS) {
                const input = inputs[k];
                "value" in input && (input.value = access(configs[configIndex], k));
            }
        }
    }

    function registerConfig(config: Config) {
        configs.push(config);
    }

    function getForm(configIndex: number) {
        for(let k of FROM_KEYS) {
            const input = inputs[k];
            "value" in input && access(configs[configIndex], k, input.value, (r, k, v) => {
                r[k] = isNumeric(v) ? Number(v) : v;
            })
        }
    }

    function onFormChange(callback: () => void) {
        onFormChangeCallback.cb = callback;
    }

    function paletteFrom(index?: number) {
        return createPalette(configs.at(index ?? -1) as Config) as HSLColor[];
    }

    function push() {
        const initial = configs.at(-1)
            ? structuredClone(configs.at(-1) as Config)
            : {
                steps: 4,
                range: {
                    a: { start: 276, end: 276 },
                    b: { start: 45, end: 45 },
                    c: { start: 3, end: 97 },
                },
                easing: {
                    a: "linear" as CubicBezierEaseHandles,
                    b: "linear" as CubicBezierEaseHandles,
                    c: "easeInOut" as CubicBezierEaseHandles,
                },
                format: "hsl" as ColorSpace
            }
        configs.push(initial);
    }

    function remove(index: number) {
        configs.splice(index, 1);
    }

    return {
        push,
        remove,
        setConfig,
        getForm,
        paletteFrom,
        onFormChange,
        registerConfig,
    }
}
type Configurator = ReturnType<typeof Configurator>;

function PaleniaInitializer(configurator: Configurator, catalogue: Catalogue) {
    const current = createState(-1);
    
    current.attend(state => {
        configurator.setConfig(state);
        catalogue.setPalette(configurator.paletteFrom(state), state);
    });

    configurator.onFormChange(() => {
        const i = current.get();
        configurator.getForm(i);
        catalogue.setPalette(configurator.paletteFrom(i), i);
    });

    catalogue.onPaletteSwitch((currentPaletteIndex: number) => {
        current.set(currentPaletteIndex);
    });

    function addNew() {
        configurator.push();
        catalogue.setPalette(configurator.paletteFrom());
    }

    function removeCurrent() {
        configurator.remove(current.get());
        catalogue.remove(current.get())
    }

    function currentPalette() {
        return configurator.paletteFrom(current.get()).map((c) => _transformer(c, COLOR_SPACE.get()));
    }

    function changeFormat(format: ColorSpace) {
        COLOR_SPACE.set(format);
    }

    return {
        addNew,
        removeCurrent,
        currentPalette,
        changeFormat,
    }
}

export { Catalogue, Configurator, PaleniaInitializer };