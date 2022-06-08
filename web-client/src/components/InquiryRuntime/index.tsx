import React, { useState, useEffect } from "react"
import { Main, Ui } from "@inquirescript/runtime-types"
import exec, { ExecState } from "./exec";
import ViewUi from "./ViewUi";
import { Block } from "baseui/block";
import { useStyletron } from "baseui";
import { Button } from "baseui/button"
import { SIZE } from "baseui/input";
import { LabelMedium } from "baseui/typography";

const InquiryRuntime = ({ main, onResponse, responseStatus }: {
	main: Main,
	onResponse: (r: string[]) => void,
	responseStatus: "UNSUBMITTED" | "SUBMITING" | "SUBMITTED"
}) => {
	let [execState, setExecState] = useState({ status: "SUSPENDED", views: [] } as ExecState)
	
	const onViewStateValue = <V extends View.Stateful>(view: V, value: V["state"]["value"]) => {
		let views = [...execState.views]
		views.splice(
			views.findIndex(v => v.request.id === view.request.id),
			1, { ...view, state: { ...view.state, value } }
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
			{responseStatus !== "SUBMITTED" && <>
				{execState.views.map(view =>
					<ViewUi
						view={view}
						onStateValue={resultValue => isViewStateful(view) && onViewStateValue(view, resultValue)}
						isDisabled={responseStatus === "SUBMITING"}
						key={view.request.id} />
				)}
				<Block height={[
					theme.sizing.scale1200,
					theme.sizing.scale1200,
					theme.sizing.scale1200,
					theme.sizing.scale1600
				]}/>
			</>}
			{execState.status === "COMPLETE" && execState.response !== undefined && <>
				
				{responseStatus === "UNSUBMITTED" || responseStatus === "SUBMITING" ?
					<Button
						onClick={() => {
							if (execState.status !== "COMPLETE" || execState.response === undefined) return;
							onResponse(execState.response)
						}}
						size={SIZE.large}
						isLoading={responseStatus === "SUBMITING"}>
							Submit
					</Button> :
				responseStatus === "SUBMITTED" ?
					<LabelMedium>Submitted your response</LabelMedium> :
				null}
			</>}
	</Block>;
}
export default InquiryRuntime;

const isViewStateful = (view: View.Any): view is View.Stateful =>
	view.request.type !== "writeText" && view.request.type !== "writeSpace" 

export declare namespace View {
    export type Any = {
            [T in keyof Ui]:
                & {
                    request: {
                        id: number | string,
                        type: T,
                        props: Omit<Props<Ui[T]>, "id">,
                    }
                }
                & (ReturnType<Ui[T]> extends Promise<void> 
                    ? {}
                    : { state: {
                        value: ResultValue<Ui[T]> | undefined,
                        validity:
                            | { isValid: true }
							| { isValid: false, reason: string }
                    } })
        }[keyof Ui]


    /** @internal */
    type _FromType<T extends keyof Ui, V extends View.Any = View.Any> =
        V extends { request: { type: T } } ? V : never
    
    export type FromType<T extends keyof Ui> =
        _FromType<T>

    export type Stateful =
		View.FromType<Exclude<keyof Ui, "writeText" | "writeSpace">>
		
	/** @internal */
	type Props<T> = 
		T extends {
			(props: infer P1): any
			(props: infer P2): any
			(props: infer P3): any
			(props: infer P4): any
		} ? P1 | P2 | P3 | P4 : 
		T extends {
			(props: infer P1): any
			(props: infer P2): any
			(props: infer P3): any
		} ? P1 | P2 | P3 : 
		T extends {
			(props: infer P1): any
			(props: infer P2): any
		} ? P1 | P2 : 
		T extends {
			(props: infer P1): any
		} ? P1 :
		unknown
		

	/** @internal */
	type ResultValue<T> = 
		T extends {
			(...args: any[]): Promise<infer R1>
			(...args: any[]): Promise<infer R2>
			(...args: any[]): Promise<infer R3>
			(...args: any[]): Promise<infer R4>
		} ? (
			| (IsUnknown<R1> extends true ? never : R1)
			| (IsUnknown<R2> extends true ? never : R2)
			| (IsUnknown<R3> extends true ? never : R3)
			| (IsUnknown<R4> extends true ? never : R4)
		) : never


		
	// https://github.com/dsherret/conditional-type-checks

	/** @internal */
	type IsUnknown<T> =
		IsNever<T> extends false
		? T extends unknown
		? unknown extends T
		? IsAny<T> extends false
		? true : false : false : false : false

	/** @internal */
	type IsAny<T> = 0 extends (1 & T) ? true : false

	/** @internal */
	type IsNever<T> = [T] extends [never] ? true : false
}
