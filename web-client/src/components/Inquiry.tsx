import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InquiryRuntime from "./InquiryRuntime";
import { Main } from "@inquirescript/runtime-types"
import firebase from "firebase/app"
import { HeadingSmall, ParagraphMedium } from "baseui/typography";
import { Block } from "baseui/block";

const Inquiry = () => { 
    let { inquiryId } = useParams<{ inquiryId: string }>()
    let [main, setMain] = useState(() => null as Main | null)
    let [status, setStatus] = useState("DEFAULT" as "DEFAULT" | "INQUIRY_NOT_FOUND")
    let [responseStatus, setResponseStatus] = useState("UNSUBMITTED" as "UNSUBMITTED" | "SUBMITING" | "SUBMITTED")

    useEffect(() => {
        let isUnsubscribed = false
        let unsubscribe = firebase.firestore().doc(`/inquiries/${inquiryId}`).onSnapshot(ref => {
            let inquiry = ref.data()
            if (isUnsubscribed) return;
            if (!inquiry) {
                setStatus("INQUIRY_NOT_FOUND")
                return;
            } else {
                setMain(() => new Function("return " + inquiry!.main)() as Main)
            }
        })
        return () => {
            unsubscribe()
            isUnsubscribed = true;
        }
    }, [inquiryId])

    const onResponse = (response: string[]) => {
        setResponseStatus("SUBMITING")
        firebase.functions().httpsCallable("insertResponse")({
            inquiryId,
            response
        }).then(() => {
            setResponseStatus("SUBMITTED")
        }) // TODO: catch
    }
    
    return <>{
        status === "DEFAULT" && main 
            ? <InquiryRuntime main={main} onResponse={onResponse} responseStatus={responseStatus} /> :
        status === "INQUIRY_NOT_FOUND"
            ? <Block padding="scale800">
                <HeadingSmall>Inquiry not found</HeadingSmall>
                <ParagraphMedium>You probably you made some typo in url</ParagraphMedium>
            </Block> :
        null
    }</>
}

export default Inquiry;