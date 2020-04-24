// v6 types, only the one's we need

declare module "react-router-dom" {
	import * as React from "react";
	
	import { useParams, Routes } from "react-router";
	export { useParams, Routes }

	export const BrowserRouter: React.FunctionComponent<BrowserRouterProps>
	export type BrowserRouterProps = {
		children?: React.ReactNode,
		timeout?: number,
		window?: object
	}

	export const Route: React.FunctionComponent<RouteProps>
	export type RouteProps = {
		path: string,
		element: React.ReactNode
	}
}
