import Command from "@oclif/command";
import { initFirebase, getUser, getDocument, putDocument } from "../../firebase-helpers"
import { promises as fs } from "fs"
import { toInquiryCode } from '../../code-transforms';

export class InquiryDeploy extends Command {
	static description = "deploy your script"

	static args = [{
		name: "identifier",
		required: true,
		description: "identifier for inquiry"
	}, {
		name: "path-to-script",
		required: true,
		description: "path to the script to be deployed"
	}]

	async run() {
		let { args: {
			identifier,
			["path-to-script"]: path
		} } = this.parse(InquiryDeploy)

		initFirebase();
		let user = await getUser();
		if (!user) {
			this.log(`You're not logged in use "inquirescript login" to login`)
			return;
		}

		if (!/[a-z0-9\-]/.test(identifier)) {
			this.log(`identifier can only contain small case alphabets, digits and hyphens`)
			return;
		}

		
		let inquiry = await getDocument("inquiry", { inquiryId: identifier })
		if (inquiry && inquiry.author !== user.uid) {
			this.log(`The identifier ${identifier} is already taken, use something else`)
			return;
		}

		if (!(await fs.stat(path)).isFile()) {
			this.log(`path ${path} does not point to a file`)
			return;
		}

		await putDocument("inquiry", { inquiryId: identifier }, {
			author: user.uid,
			code: await toInquiryCode(await fs.readFile(path, "utf8"))
		})
		
		this.log(`deployed ${identifier}`)
		this.exit();
	}
}
