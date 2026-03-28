import {
    setupVersioning,
} from "https://www.johannes-programming.online/versioning/version.js";
import {
    setupHead,
} from "https://www.johannes-programming.online/versioning/head.js";
import {
    fixContent,
} from "https://www.johannes-programming.online/versioning/fixing.js";


export function main() {
    setupHead();
    fixContent();
    setupVersioning();
}

main();
