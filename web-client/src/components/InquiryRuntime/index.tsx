import React, { useState, useEffect } from "react"
import { Main, Runtime } from "@inquirescript/runtime-types"
import exec, { ExecState } from "./exec";
import ViewUi from "./ViewUi";
import { Block } from "baseui/block";
import { useStyletron } from "baseui";
import { Button } from "baseui/button"
import { SIZE } from "baseui/input";

const InquiryRuntime = ({ main }: { main: Main }) => {
	let [execState, setExecState] = useState({ status: "SUSPENDED", views: [] } as ExecState)
	
	const onViewStateValue = <V extends View.Stateful>(view: V, value: V["state"]["value"]) => {
		let views = [...execState.views]
		views.splice(
			views.findIndex(v => v.request.id === view.request.id),
			1,
			{ ...view, state: { ...view.state, value } }
		)
		setExecState({ ...execState, views })

		exec(views, main).then(setExecState)
	}

	useEffect(() => {
		exec([], main).then(setExecState)
	}, [main])

	let [, theme] = useStyletron();

	return <Block
		width={["auto", "auto", "80%", "60%"]}
		padding={[
			theme.sizing.scale1200,
			theme.sizing.scale1200,
			theme.sizing.scale1200,
			theme.sizing.scale1600
		]}>
			{execState.views.map(view =>
				<ViewUi
					view={view}
					onStateValue={resultValue => isViewStateful(view) && onViewStateValue(view, resultValue)}
					key={view.request.id} />
			)}
			{execState.status === "COMPLETE" && <>
				<Block height={theme.sizing.scale1600}/>
				<Button size={SIZE.large}>Submit</Button>
			</>}
	</Block>;
}
export default InquiryRuntime;

const isViewStateful = (view: View.Any): view is View.Stateful =>
	view.request.type !== "writeText" && view.request.type !== "writeSpace" 

export declare namespace View {
    export type Any = {
            [T in keyof Runtime]:
                & {
                    request: {
                        id: number | string,
                        type: T,
                        props: Omit<Parameters<Runtime[T]>[0], "id">,
                    }
                }
                & (ReturnType<Runtime[T]> extends Promise<void> 
                    ? {}
                    : { state: {
                        value: Runtime[T] extends (...args: any[]) => Promise<infer U> ? U | undefined : never,
                        validity:
                            | { isValid: true }
                            | { isValid: false, reason: string }
                    } })
        }[keyof Runtime]


    /** @internal */
    type _FromType<T extends keyof Runtime, V extends View.Any = View.Any> =
        V extends { request: { type: T } } ? V : never
    
    export type FromType<T extends keyof Runtime> =
        _FromType<T>

    export type Stateful =
        View.FromType<Exclude<keyof Runtime, "writeText" | "writeSpace">>

}