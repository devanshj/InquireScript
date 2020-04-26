import { Main } from "@inquirescript/runtime-types";
import { View } from ".";

declare const exec: (views: View.Any[], main: Main) => Promise<ExecState>
export default exec;

export type ExecState =
    | { status: "SUSPENDED", views: View.Any[] }
    | { status: "COMPLETE", views: View.Any[], response: string[] | undefined }