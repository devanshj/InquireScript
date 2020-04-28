import Command from "@oclif/command";
import { google, } from "googleapis"
import googleApiCredentials from "../secrets/googleApiCredentials.json"
import {} from "googleapis/build/src/"
import { cli, ux } from "cli-ux";
import { initFirebase, getUser } from '../api';
import keytar from "keytar";
import { KEYTAR_SERVICE, KEYTAR_ACCOUNT } from '../constants';

export class Login extends Command {
    static description = "login to InquireScript via your Google Account"

    async run() {
        initFirebase();

        

        let user = await getUser();
        if (user) {
            this.log(`Hi ${user.displayName}, you're already logged in!`)
            return;
        }

        let authClient = new google.auth.OAuth2(
            googleApiCredentials.client_id,
            googleApiCredentials.client_secret,
            googleApiCredentials.redirect_uris[0]
        )

        this.log("Opening Google's login page in your browser...");
        cli.open(
            authClient.generateAuthUrl({
                access_type: "offline",
                scope: [
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile"
                ]
            })
        )

        let authCode = await cli.prompt("Authorization code")
        let { tokens: credentials } = await authClient.getToken(authCode)
        await keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, JSON.stringify(credentials))
        
        user = (await getUser())!
        this.log(`Hi ${user.displayName}, you're now logged in!`)
    }
}
