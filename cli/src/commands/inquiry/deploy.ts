import Command from "@oclif/command";
import { initFirebase, getCurrentUser, getDocument, putDocument, InquiryUntranspiledCode } from "../../firebase-helpers"
import { promises as fs } from "fs"
import { toInquiryMain } from '../../code-transforms';
import chokidar from "chokidar"
import { cli } from 'cli-ux';
import { waitForAnyKey } from '../../utils';

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
			let untranspiledCode = await fs.readFile(path, "utf8") as InquiryUntranspiledCode
			await putDocument("inquiry", { inquiryId: identifier }, {
				author: user!.uid,
				main: await toInquiryMain(untranspiledCode),
				untranspiledCode
			})
		}

		cli.action.start("deploying")
		await deploy();
		cli.action.stop(`deployed to https://inquirescript.web.app/inquiry/${identifier}`)
		cli.action.start("watching for changes")

		let watcher = chokidar.watch(path)
		.on("change", async () => {
			cli.action.start("change detected, deploying")
			await deploy()
			cli.action.stop("deployed")
		})

		await waitForAnyKey("press any key to stop watching...\n");
		cli.action.stop();
		watcher.removeAllListeners();
		this.exit();
	}
}
