import { Command } from "@oclif/command";
import readline from "readline";
import { google } from "googleapis";
import googleApiCredentials from "../secrets/google-api-credentials.json"

export default class Login extends Command {
	static description = "Login to InquireScript with your Google account";

	async run() {
		let authClient = new google.auth.OAuth2(
			googleApiCredentials.client_id,
			googleApiCredentials.client_secret,
			googleApiCredentials.redirect_uris[0]
		)
		
		console.log(authClient.generateAuthUrl({
			access_type: "offline",
			scope: ["https://www.googleapis.com/auth/spreadsheets"],
		}))

		let code = await new Promise<string>(resolve => {
			readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			}).question("code:", resolve)
		})

		authClient.getToken(code, (err, token) => {
			if (err || !token) return;
			authClient.setCredentials(token);
		})
	}
}
