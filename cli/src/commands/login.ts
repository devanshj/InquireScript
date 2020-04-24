import { Command, flags } from "@oclif/command";

export default class Login extends Command {
	static description = "User Login For InquireScript";

	static flags = {
		help: flags.help({ char: "h" }),
		name: flags.string({ char: "n", description: "name to print" }),
		force: flags.boolean({ char: "f" }),
	};

	static args = [{ name: "file" }];

	async run() {
		const { args, flags } = this.parse(Login);

		// login logic
		const fs = require("fs");
		const readline = require("readline");
		const { google } = require("googleapis");

		const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]; // This will give read and write authority

		const TOKEN_PATH = "token.json";

		// Here i was getting error in callback hence added any i dont know how to fix this
		fs.readFile(
			"./src/secrets/credentials.json",
			(err: any, content: any) => {
				if (err)
					return console.log(
						"Error loading client secret file:",
						err
					);
				authorize(JSON.parse(content), null);
			}
		);

		function authorize(credentials: any, callback: any) {
			const {
				client_secret,
				client_id,
				redirect_uris,
			} = credentials.installed;
			const oAuth2Client = new google.auth.OAuth2(
				client_id,
				client_secret,
				redirect_uris[0]
			);

			// Check if we have previously stored a token.
			fs.readFile(TOKEN_PATH, (err: any, token: any) => {
				if (err) return getNewToken(oAuth2Client, callback);
				console.log("Already Logged in");
				oAuth2Client.setCredentials(JSON.parse(token));
				// callback(oAuth2Client); //This was to print the content of dummy stylesheet
			});
		}

		function getNewToken(oAuth2Client: any, callback: any) {
			const authUrl = oAuth2Client.generateAuthUrl({
				access_type: "offline",
				scope: SCOPES,
			});
			console.log("Authorize this app by visiting this url:", authUrl);
			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});
			rl.question("Enter the code from that page here: ", (code: any) => {
				rl.close();
				oAuth2Client.getToken(code, (err: any, token: any) => {
					if (err)
						return console.error(
							"Error while trying to retrieve access token",
							err
						);
					oAuth2Client.setCredentials(token);
					// Store the token to disk for later program executions
					fs.writeFile(
						TOKEN_PATH,
						JSON.stringify(token),
						(err: any) => {
							if (err) return console.error(err);
							console.log("Token stored to", TOKEN_PATH);
						}
					);
					// callback(oAuth2Client); /*This was for printing spreadsheet*/
				});
			});
		}

		// Prints the names and majors of students in a sample Dummy spreadsheet
		// Will remove this later, have just kept it for testing

		// function listMajors(auth: any) {
		//   const sheets = google.sheets({ version: 'v4', auth });
		//   sheets.spreadsheets.values.get(
		//     {
		//       spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
		//       range: 'Class Data!A2:E',
		//     },
		//     (err: any, res: any) => {
		//       if (err) return console.log('The API returned an error: ' + err);
		//       const rows = res.data.values;
		//       if (rows.length) {
		//         console.log('Name, Major:');
		//         // Print columns A and E, which correspond to indices 0 and 4.
		//         rows.map((row: any) => {
		//           console.log(`${row[0]}, ${row[4]}`);
		//         });
		//       } else {
		//         console.log('No data found.');
		//       }
		//     }
		//   );
		// }
	}
}
