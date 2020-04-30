import firebase from "firebase"
import firebaseConfig from "../secrets/firebaseConfig.json"
import { google } from "googleapis"
import keytar from "keytar";
import { KEYTAR_SERVICE, KEYTAR_ACCOUNT } from '../constants';
import googleApiCredentials from "../secrets/googleApiCredentials.json"

export const initFirebase = () => {
    firebase.initializeApp(firebaseConfig)
}

type GoogleAuthCredentials =
    Parameters<InstanceType<typeof google.auth.OAuth2>["setCredentials"]>[0]

export const getCurrentUser = async () => {
    try {
        let credentials = JSON.parse(await keytar.findPassword(KEYTAR_SERVICE) || "null")  as GoogleAuthCredentials | null
        if (!credentials) return null;

        let authClient = new google.auth.OAuth2(
            googleApiCredentials.client_id,
            googleApiCredentials.client_secret,
            googleApiCredentials.redirect_uris[0]
        )
        authClient.setCredentials(credentials)

        let { token: newAccessToken } = await authClient.getAccessToken()
        await firebase.auth().signInWithCredential(
            firebase.auth.GoogleAuthProvider.credential(
                credentials.id_token,
                newAccessToken
            )
        )
        
        await keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, JSON.stringify({
            ...credentials,
            access_token: newAccessToken
        }))
        

        return firebase.auth().currentUser as Omit<firebase.User, "uid"> & { uid: AuthUid }
    } catch (e) {
        return null
    }
}

export const getDocument = <P extends DocumentPath>(type: P["type"], props: P["props"]) =>
    firebase.firestore().doc(
        type === "inquiry"
            ? `/inquiries/${props.inquiryId}`
        : "" // never
    ).get().then(s => s.data()) as Promise<P["document"] | undefined>;

export const putDocument = <P extends DocumentPath>(type: P["type"], props: P["props"], document: P["document"]) =>
    firebase.firestore().doc(
        type === "inquiry"
            ? `/inquiries/${props.inquiryId}`
        : "" // never
    ).set(document)


type DocumentPath =
    | InquiryPath

type InquiryPath =
    & Brand<"InquiryPath", string>
    & { type: "inquiry", props: { inquiryId: InquiryId }, document: Inquiry }

type InquiryId =
    Brand<"InquiryId", string>

export type Inquiry = {
    author: AuthUid,
    code: InquiryCode
}

export type AuthUid =
    Brand<"AuthUid", string>

export type InquiryCode =
    Brand<"InquiryCode", string>

type Brand<N extends string, T> = T & { brand: N }

