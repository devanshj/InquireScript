import dns from "dns";
import { cli } from 'cli-ux';

export type PromiseValue<T extends Promise<any>> = 
    T extends Promise<infer U> ? U : never;

export const hasInternet = () => 
    dns.promises.resolve("www.google.com")
    .then(() => true)
    .catch(() => false)

export const waitForAnyKey = (prompt: string) =>
    cli.prompt("", { prompt, required: false })