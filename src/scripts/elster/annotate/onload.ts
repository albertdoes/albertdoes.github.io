type User = {
    id: string,
    authorization: {
        permanent_token: string,
        session_token: string,
    }
}

type Project = {
    id: string,
    dataset_url: string,
    annotator_id: string,
}