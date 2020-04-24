import React from "react";
import { useParams } from "react-router-dom";

const Inquiry = () => {
    let { identifier } = useParams<{ identifier: string }>()

    return <div>Inquiry {identifier}</div>
}

export default Inquiry;