import { types, traverse, parse } from "@babel/core"
import { InquiryMain } from "../firebase-helpers"

export const toInquiryMain = (code: string) => new Promise<InquiryMain>((resolve, reject) => {
    try {
        let ast = parse(code, { sourceType: "module" })!;
        traverse(ast, {
            ExportDefaultDeclaration: {
                enter: path => {
                    let declaration = path.node.declaration
                    if (types.isFunctionDeclaration(declaration)) {
                        let { start, end } = declaration
                        resolve(code.substring(start!, end!) as InquiryMain)
                    } else if (types.isIdentifier(declaration)) {
                        let defaultIdentifier = declaration.name;
                        traverse(ast, {
                            Identifier: path => {
                                if (path.node.name === defaultIdentifier) {
                                    let fn = path.parent
                                    if (types.isFunctionDeclaration(fn)) {
                                        resolve(code.substring(fn.start!, fn.end!) as InquiryMain)
                                    }
                                }
                            }
                        })
                    }
                },
                exit: () => { throw ""; }
            }
        })
    } catch {
        reject("There was problem transforming your script to get the default export")
    }
})