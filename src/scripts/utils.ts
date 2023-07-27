import { State, createState } from "witting";

function fetchFill(root: Element | HTMLElement | Document, act: (e: Element | HTMLElement, value: string) => void) {
    const fetchingRegister: { [key in string]: any } = {};
    root.querySelectorAll("[data-fetch]").forEach(function(e) {
        let [uri, key] = e.getAttribute("data-fetch")?.split(":") as string[];
        fetchingRegister[uri]
        ? act(e, fetchingRegister[uri][key])
        : fetch(uri)
            .then(res => res.json())
            .then(data => {
                fetchingRegister[uri] = data;
                act(e, fetchingRegister[uri][key]);
            })
            .catch(e => console.log(e));
    });
}

function provideSlots(root: HTMLElement | ShadowRoot | Document) {
    root.querySelectorAll("[data-slots]").forEach(e => {
        e.getAttribute("data-slots")?.split(" ").forEach(n => {
            const slot = document.createElement("slot");
            slot.setAttribute("name", n);
            e.append(slot);
        })
    })
}

function fadedMarquee(element: HTMLElement, direction: "x" | "y") {
    const mask: State<"s" | "e" | "i"> = createState("s" as "s" | "e" | "i");
    mask.attend((state) => {
        element.setAttribute("data-marquee-direction", state);
    }, undefined, true)
    element?.addEventListener("scroll", function() {
        switch (direction === "x" ? element.scrollLeft : element.scrollTop) {
            case 0:
                mask.set("s");
                break;
            case direction === "x" ? (element.scrollWidth - element.offsetWidth) : (element.scrollHeight - element.offsetHeight):
                mask.set("e");
                break;
            default:
                mask.set("i");
                break;
        }
    })
}

function access(obj: any, key: string, val?: any, setter?: (ref: any, key: string, value: any) => void) {
    const propOrder = key.split(".");
    let result, k, kNext;
    setter ??= (ref: any, key: string, value: any) => { ref[key] = value; }
    try {
        if(propOrder.length === 1) result = obj;
        else {
            if(obj[propOrder[0]] === undefined) obj[propOrder[0]] = {};
            result = obj[propOrder[0]];
            for(let i = 1; i < propOrder.length - 1; i++) {
                [ k, kNext ] = propOrder.slice(i, i+2);
                if(result[k] === undefined) result[k] = {};
                if(result[k][kNext] === undefined) result[k][kNext] = {};
                result = result[k];
            }
        }
        val && setter(result, propOrder.at(-1) as string, val);
        return result[propOrder.at(-1) as string];
    }
    catch(err) { console.log(err); return; }
}

function download(name: string, data: string) {
    const a = document.createElement("a");
    a.download = name;
    a.href = "data:application/json," + encodeURIComponent(data);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
}

function isNumeric(str: string) {
    const numbers = "0123456789";
    for(let c of str) {
        if(!numbers.includes(c)) return false;
    }
    return true;
}

export { fetchFill, provideSlots, fadedMarquee, access, download, isNumeric };