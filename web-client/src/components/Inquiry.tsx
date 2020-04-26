import React from "react";
import { useParams } from "react-router-dom";
import InquiryRuntime from "./InquiryRuntime";
import { Main } from "@inquirescript/runtime-types";

const Inquiry = () => { 
    let { identifier } = useParams<{ identifier: string }>()

    // eslint-disable-next-line no-eval
    return <InquiryRuntime main={eval(`async (ui, g) => {
        await ui.writeText({
            id: 0,
            content: "Hi, this is Devansh! I just wanted to ask you some things about your front-end stack.",
            size: "display-small"
        })
        
        await ui.writeSpace({
            id: 1,
            size: "scale1000"
        })

        let name = await ui.readText({
            id: 2,
            label:  "What's your name?",
            helpText: "Hey, be honest no bogus names!",
            guard: g.required("name")
        })

        ui.writeSpace({ id: 3, size: "scale400" })

        const OTHER = "Other"
        let framework = await ui.readChoiceList({
            id: 4,
            label: \`Hi \${name} ssup! What framework / library do you use?\`,
            options: ["React", "Vue", "Angular", "No framework / library", OTHER],
            labelProvider: o => o,
            valueProvider: o => o
        })

        ui.writeSpace({ id: 5, size: "scale400" })

        if (framework === OTHER) {
            framework = await ui.readText({
                id: 6,
                label: \`Interesing, what's its name?\`,
                guard: g.required("name")
            })  
        }

        return [name, framework]
    }`) as Main} />
}

export default Inquiry;