import {
    setupVersioning,
} from "https://www.johannes-programming.online/versioning/version.js";
import {
    fixContent,
} from "https://www.johannes-programming.online/versioning/fixing.js";


export function main() {
    fixContent();
    setupVersioning();
}

main();
