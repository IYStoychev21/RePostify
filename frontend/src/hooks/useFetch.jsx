import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetch(url) {
    let [data, setData] = useState(null)

    useEffect(() => {
        axios.get(url, { withCredentials: true })
        .then((res) => {
            setData(res.data)
        })
    }, [url])

    return { data }
}