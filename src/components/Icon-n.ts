import { createState } from "witting";

async function getSVG(iconifyID: string) {
    if(iconifyID === "logo") return "";
    const [ prefix, name ] = iconifyID.split(":");
    try {
        const res = await fetch(`https://api.iconify.design/${prefix}/${name}.svg`);
        const svg = await res.text();
        return svg;
    } catch (error) {
        console.log(error);
        return "";
    }
}