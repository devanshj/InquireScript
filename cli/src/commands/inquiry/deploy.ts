import Command from "@oclif/command";
import { initFirebase, getCurrentUser, getDocument, putDocument } from "../../firebase-helpers"
import { promises as fs } from "fs"
import { toInquiryCode } from '../../code-transforms';
import chokidar from "chokidar"

export class InquiryDeploy extends Command {
	static description = "deploy your script"

	static args = [{
		name: "identifier",
		required: true,
		description: "identifier for inquiry"
	}, {
		name: "path-to-script",
		required: false,
		description: "path to the script to be deployed"
	}]

	async run() {
		let { identifier, ["path-to-script"]: path } = this.parse(InquiryDeploy).args
		path = path || identifier + ".js"

		initFirebase();
		let user = await getCurrentUser();
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

		const deploy = async () => {
			await putDocument("inquiry", { inquiryId: identifier }, {
				author: user!.uid,
				code: await toInquiryCode(await fs.readFile(path, "utf8"))
			})
			
			this.log("deployed")
		}

		await deploy();
		this.log("watching for changes...")

		chokidar.watch(path)
		.on("change", () => {
			this.log("change detected, deploying...")
			deploy()
		})
	}
}
