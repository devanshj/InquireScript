import Command from "@oclif/command";
import { initFirebase, getCurrentUser, getDocument, getCollectionReference } from "../../firebase-helpers"
import { promises as fs } from "fs"
import { cli } from 'cli-ux';
import { EOL } from "os";
import { waitForAnyKey } from '../../utils';

export class InquiryResponses extends Command {
	static description = "deploy your script"

	static args = [{
		name: "identifier",
		required: true,
		description: "identifier for inquiry"
	}, {
		name: "path-to-csv",
		required: false,
		description: "path to the csv file to be wrote"
	}]

	async run() {
		let { identifier, ["path-to-script"]: path } = this.parse(InquiryResponses).args
		path = path || identifier + ".csv"

		initFirebase();
		cli.action.start("checking for logged in users")
		let user = await getCurrentUser();
		if (!user) {
			cli.action.stop("None found")
			await this.config.runCommand("login")
			user = (await getCurrentUser({ noCheck: true }))!
		} else {
			cli.action.stop("Found")
		}
		
		

		if (!/[a-z0-9\-]/.test(identifier)) {
			this.log(`identifier can only contain small case alphabets, digits and hyphens`)
			return;
		}

		cli.action.start("checking for rights")
		let inquiry = await getDocument("inquiry", { inquiryId: identifier })
		if (inquiry && inquiry.author !== user.uid) {
			cli.action.stop(`You're not the author, so you can't access the responses`)
			return;
		} else {
			cli.action.stop("done")
		}
		

		cli.action.start("getting responses")
		let responsesRef = getCollectionReference("inquiry-responses", { inquiryId: identifier })
		cli.action.stop("done")

		cli.action.start("watching for new responses")
		let unsubscribe = responsesRef.onSnapshot(async s => {
			await fs.writeFile(
				path,
				s.docs
				.map(d => d.data().data.join(","))
				.join(EOL) + EOL
			)
			this.log("updated")
		})

		await waitForAnyKey("press any key to stop watching...\n");
		cli.action.stop()
		unsubscribe();
		this.exit();
	}
}
