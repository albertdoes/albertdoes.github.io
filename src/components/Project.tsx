import { useEffect, useState } from "react"
import Icon from "./Icon"

type Project = {
    name: string,
    description: string,
    url: string,
}

// -------------------------------------------------------

export default function Project(props: { url?: string }) {
    const [ info, setInfo ] = useState({} as Project);
    const [ loaded, setLoaded ] = useState(false);

    props.url && useEffect(() => {
        fetch(props.url+"/meta.json")
        .then((res) => res.json())
        .then((data) => {
            if(!loaded) setInfo({...data});
            setLoaded(true);
        })
    }, []);

    return (
        <article className="card">
            <div>
                <h4 className="flex items-center gap-[1rem]">
                    <span className={info.name ? "" : "preview"}>
                        {info.name ?? "Project Name"}
                    </span>
                    <a className="button-like" href={info.url}>
                        <span><Icon name="arrow-right" /></span>
                    </a>
                </h4>
                <div>
                    <span className={info.description ? "" : "preview"}>
                        {info.description ?? "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam quia nobis incidunt doloribus molestiae provident minus perspiciatis neque."}
                    </span>
                </div>
            </div>
        </article>
    )
}