import React from "react";
import { useParams } from "react-router-dom";
import InquiryRuntime from "./InquiryRuntime";

const Inquiry = () => { 
    let { identifier } = useParams<{ identifier: string }>()
    
    return <InquiryRuntime main={async ({ ui, guard }) => {
        await ui.writeText({
            id: 0,
            content: "Hi teenagers we want your help!",
            size: "display-small"
        })
    
        await ui.writeSpace({
            id: 1,
            size: "scale1000"
        })
    
        let age = await ui.readNumber({
            id: 2,
            label: `What is your age?`,
            guard: guard.pipe(
                guard.required("age"),
                { checker: age => Number(age.toFixed(0)) === age
                , errorProvider: () => "Age can't be in decimal"
                }
            )
        })
    
    
        if (age < 13) {
            await ui.writeText({
                id: 4,
                content: `Hehe, you're ${age} which makes you a little ${age < 10 ? "too" : ""} young to be a teenager!`,
                size: "paragraph-medium"
            })
            return;
        }
    
        if (age > 18) {
            await ui.writeText({
                id: 5,
                content: `Heya, you're ${age} which makes you a little ${age > 21 ? "too" : ""} old to be a teenager!`,
                size: "paragraph-medium"
            })
            return;
        }
    
        let name = await ui.readText({
            id: 7,
            label:  "What's your name?",
            helpText: "Hey, be honest no bogus names!",
            guard: guard.required("name")
        })
    
        let hobby = await ui.readText({
            id: 9,
            label: `Hi ${name}, What's your hobby?`,
            helpText: "You can keep it blank if you don't really have one it's okay",
            guard: guard.required("hobby")
        })
    
        return [name, age.toString(), hobby]
    
    }} />
}

export default Inquiry;