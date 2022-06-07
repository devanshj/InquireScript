import Command from "@oclif/command";
import { google, } from "googleapis"
import googleApiCredentials from "../secrets/googleApiCredentials.json"
import {} from "googleapis/build/src/"
import http from "http"
import url from "url"
import { cli } from "cli-ux";
import { initFirebase, getCurrentUser } from '../firebase-helpers';
import keytar from "keytar";
import { KEYTAR_SERVICE, KEYTAR_ACCOUNT } from '../constants';

export class Login extends Command {
    static description = "login to InquireScript via your Google Account"

    async run() {
        initFirebase();


        let user = await getCurrentUser();
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
        let authCode = await new Promise<string>(resolve => {
            let server = http.createServer(async (req, res) => {
                res.end(`
                  <div style="font-size: 1.2em; font-family: sans-serif; padding: 1em;">
                    You're now logged in, please return to the command line and close this tab.
                  </div>
                `)
                server.close()
                resolve(
                    new url.URL(req.url!, "http://localhost:3000")
                    .searchParams.get("code")!
                )
            })
            .listen(3000, () =>
                cli.open(
                    authClient.generateAuthUrl({
                        access_type: "offline",
                        scope: [
                            "https://www.googleapis.com/auth/userinfo.email",
                            "https://www.googleapis.com/auth/userinfo.profile"
                        ]
                    })
                )
            )
        })
        let { tokens: credentials } = await authClient.getToken(authCode)
        await keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, JSON.stringify(credentials))
        
        user = (await getCurrentUser())!
        this.log(`Hi ${user.displayName}, you're now logged in!`)
        process.exit()
    }
}
