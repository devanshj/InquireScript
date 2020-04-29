import Command from "@oclif/command";
import { google, } from "googleapis"
import googleApiCredentials from "../secrets/googleApiCredentials.json"
import {} from "googleapis/build/src/"
import { cli } from "cli-ux";
import { initFirebase, getUser } from '../firebase-helpers';
import keytar from "keytar";
import { KEYTAR_SERVICE, KEYTAR_ACCOUNT } from '../constants';

export class Login extends Command {
    static description = "logout from InquireScript"

    async run() {
        initFirebase();

        let foundUser = await keytar.findPassword(KEYTAR_SERVICE);
        if (foundUser) {
            await keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);

            let user = await getUser();
            this.log(user ? `Hi ${user.displayName}, you're now logged out` : `You're now logged out`)
        } else {
            this.log(`There's no user to logout`);
        }
    }
}
