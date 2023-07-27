import type { CubicBezierEaseHandles } from "../../bezier";
import { CubicBezierEasing, flowEasing } from "../../bezier"

// --------------------------------

type RawColor = {
    a: number,
    b: number,
    c: number,
}

type HSLColor = {
    hue: number,
    saturation: number,
    luminosity: number,
}

type RGBColor = {
    red: number,
    green: number,
    blue: number,
}

type HEXColor = {
    red: string,
    green: string,
    blue: string,
}

type Range = {
    start: number,
    end: number,
}

type ChannelWiseRange = {
    a: Range,
    b: Range,
    c: Range,
}

type ChannelWiseEasing = {
    a: CubicBezierEaseHandles | number[],
    b: CubicBezierEaseHandles | number[],
    c: CubicBezierEaseHandles | number[],
}

type Config = {
    steps: number,
    range: ChannelWiseRange,
    easing: ChannelWiseEasing,
    format: ColorSpace
}

type ColorSpace = "hsl" | "rgb" | "hex";
// --------------------------------------------------

function _validateConfig(configRaw: any): Config {
    return {
        steps: configRaw.steps ?? 4,
        range: {
            a: {
                start: (
                    configRaw.range.a
                    ? configRaw.range.a.start
                    : 0
                ),
                end: (
                    configRaw.range.a
                    ? configRaw.range.a.end
                    : 0
                ),
            },
            b: {
                start: (
                    configRaw.range.b
                    ? configRaw.range.b.start
                    : 0
                ),
                end: (
                    configRaw.range.b
                    ? configRaw.range.b.end
                    : 0
                ),
            },
            c: {
                start: (
                    configRaw.range.c
                    ? configRaw.range.c.start
                    : 0
                ),
                end: (
                    configRaw.range.c
                    ? configRaw.range.c.end
                    : 100
                ),
            },
        },
        easing: {
            a: configRaw.easing ? ( configRaw.easing.a ?? "linear" ) : "linear",
            b: configRaw.easing ? ( configRaw.easing.b ?? "linear" ) : "linear",
            c: configRaw.easing ? ( configRaw.easing.c ?? "linear" ) : "linear",
        },
        format: configRaw.format ?? "hsl",
    };
}

function _producePoints(easing: ChannelWiseEasing, steps: number): RawColor[] {
    const result = [];

    const aEase = CubicBezierEasing(flowEasing(easing.a));
    const bEase = CubicBezierEasing(flowEasing(easing.b));
    const cEase = CubicBezierEasing(flowEasing(easing.c));

    const totalSteps = steps * 2 + 1;
    for(let i = 0; i < totalSteps; i++) {
        const t = i / (totalSteps - 1);
        result.push({
            a: aEase(t),
            b: bEase(t),
            c: cEase(t),
        });
    }

    return result;
}

function createPalette(configRaw: Config): HSLColor[] | RGBColor[] {
    const config = _validateConfig(configRaw);
    const points = _producePoints(config.easing, config.steps);
    const ranges = config.range;
    const format = config.format;
    const generated = points.map(raw => ({
        a: ranges.a.start + (ranges.a.end - ranges.a.start) * raw.a,
        b: ranges.b.start + (ranges.b.end - ranges.b.start) * raw.b,
        c: ranges.c.start + (ranges.c.end - ranges.c.start) * raw.c,
    }))

    if(format === "hsl") {
        return generated.map(gen => ({
            hue: Math.round(gen.a),
            saturation: Math.round(gen.b),
            luminosity: Math.round(gen.c)
        }));
    } else {
        return generated.map(gen => ({
            red: Math.round(gen.a),
            green: Math.round(gen.b),
            blue: Math.round(gen.c)
        }));
    }
}

function HSLToRGB(hsl: HSLColor): RGBColor {
    const h = hsl.hue;
    const s = hsl.saturation / 100;
    const l = hsl.luminosity / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    const x = c * (1 - Math.abs(hPrime % 2 - 1));
    const m = l - c / 2;

    let [r, g, b] = [0, 0, 0];

    (hPrime >= 0 && hPrime < 1) && ([r, g, b] = [c, x, 0]);
    (hPrime >= 1 && hPrime < 2) && ([r, g, b] = [x, c, 0]);
    (hPrime >= 2 && hPrime < 3) && ([r, g, b] = [0, c, x]);
    (hPrime >= 3 && hPrime < 4) && ([r, g, b] = [0, x, c]);
    (hPrime >= 4 && hPrime < 5) && ([r, g, b] = [x, 0, c]);
    (hPrime >= 5 && hPrime < 6) && ([r, g, b] = [c, 0, x]);

    [r, g, b] = [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]

    return { red: r, green: g, blue: b };
}

function RGBToHEX(rgb: RGBColor) {
    const { red: r, green: g, blue: b } = rgb;
    return {
        red: r.toString(16).padStart(2, "0").toUpperCase(),
        green: g.toString(16).padStart(2, "0").toUpperCase(),
        blue: b.toString(16).padStart(2, "0").toUpperCase(),
    };
}

function HSLToHEX(hsl: HSLColor) {
    return RGBToHEX(HSLToRGB(hsl));
}

function HSLString(hsl: HSLColor) {
    const { hue, saturation, luminosity } = hsl;
    const h = String(hue).padStart(3, " ");
    const s = String(saturation).padStart(3, " ");
    const l = String(luminosity).padStart(3, " ");
    return `hsl(${h},${s}%,${l}%)`;
}

function RGBString(rgb: RGBColor) {
    const { red, green, blue } = rgb;
    const r = String(red).padStart(3, " ");
    const g = String(green).padStart(3, " ");
    const b = String(blue).padStart(3, " ");
    return `rgb(${r},${g},${b})`;
}

function HEXString(hex: HEXColor) {
    let { red: r, green: g, blue: b } = hex;
    return `#${r}${g}${b}`;
}

export type { HSLColor, RGBColor, HEXColor, ChannelWiseRange, ChannelWiseEasing, ColorSpace, Config };
export { createPalette, HSLString, RGBString, HEXString, HSLToRGB, RGBToHEX, HSLToHEX };