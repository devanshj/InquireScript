import dns from "dns";

export type PromiseValue<T extends Promise<any>> = 
    T extends Promise<infer U> ? U : never;

export const hasInternet = () => 
    dns.promises.resolve("www.google.com")
    .then(() => true)
    .catch(() => false)