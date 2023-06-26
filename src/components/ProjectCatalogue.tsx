import { useState, useEffect } from "react";

import Project from "./Project";

export default function(props: { url?: string }) {
    const [ projectUrls, setProjectUrls ] = useState([undefined, undefined] as (string | undefined)[]);
    const [ loaded, setLoaded ] = useState(false);

    function toUrl(identifier: string) { return props.url + "/" + identifier; }

    props.url && useEffect(() => {
        fetch((props.url as string) + "/index.json")
        .then((res) => res.json())
        .then((data: { names: string[] }) => {
            if(!loaded) setProjectUrls(data.names.map(toUrl));
            setLoaded(true);
        })
    }, []);

    return (
        <ul className="no-marker flex flex-col gap-lg">
            {
                projectUrls.map((u) => 
                    <li key={Math.random()}>
                        <Project url={u} />
                    </li>
                )
            }
        </ul>
    )
}