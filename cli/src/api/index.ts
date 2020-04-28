import firebase from "firebase"
import firebaseConfig from "../secrets/firebaseConfig.json"
import { google } from "googleapis"
import keytar from "keytar";
import { KEYTAR_SERVICE } from '../constants';

export const initFirebase = () => {
    firebase.initializeApp(firebaseConfig)
}

type GoogleAuthCredentials =
    Parameters<InstanceType<typeof google.auth.OAuth2>["setCredentials"]>[0]

export const getUser = async () => {
    try {
        let credentials = JSON.parse(await keytar.findPassword(KEYTAR_SERVICE) || "null")  as GoogleAuthCredentials | null
        if (!credentials) return null;

        return (await firebase.auth().signInWithCredential(
            firebase.auth.GoogleAuthProvider.credential(
                credentials.id_token,
                credentials.access_token
            )
        )).user
    } catch {
        return null
    }
}