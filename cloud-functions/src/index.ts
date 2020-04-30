import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

let app = admin.initializeApp()

export const insertResponse = functions.https.onCall(
    async ({ inquiryId, response }: { inquiryId: string, response: string[] }) => {        
        await app.firestore().collection(`/inquiries/${inquiryId}/responses`).add({ data: response })
        // TODO: reCaptcha
    }
)