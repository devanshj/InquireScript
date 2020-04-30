import Command from "@oclif/command";
import { initFirebase, getDocument } from '../../firebase-helpers';
import { promises as fs, constants as fsConstants } from "fs"
import { cli } from 'cli-ux';

export class InquiryImport extends Command {
    static description = "import the script of an inquiry"

	static args = [{
		name: "identifier",
		required: true,
		description: "identifier for inquiry"
	}, {
		name: "path-to-script",
		required: false,
		description: "path to the file to be wrote"
	}]
    
    async run() {
        let { identifier, ["path-to-script"]: path } = this.parse(InquiryImport).args
		path = path || identifier + ".js"

		initFirebase();
	
        if (
            (await fs.access(path, fsConstants.F_OK).then(() => true).catch(() => false)) &&
            !(await cli.confirm(`File ${path} already exist do you want to overwrite it? (y/n)`))
        ) return;
		
		let inquiry = await getDocument("inquiry", { inquiryId: identifier })
		if (!inquiry) {
			this.log(`Inquiry ${identifier} does not exist`)
			return;
		}

        
        await fs.writeFile(path, inquiry.untranspiledCode)
		this.log(`Wrote ${identifier} inquiry to ${path}`)
		this.exit();
	}
}
