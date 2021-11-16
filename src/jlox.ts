import { readFileSync } from "fs";
import { join } from "path";
import Scanner from "./scanner";

var hadError = false;

const readline = require("node:readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

function executeCommandLine(args: string[]) {
    if (args.length > 3) {
        console.log("Usage: jlox [file]");
        process.exit(64);
    } else if (args.length === 3) {
        runFile(args[2]);
    } else {
        console.log("Jlots 1.0.0 | Jlox on Typescript");
        console.log('Type "exit" to exit the program.');
        runPrompt();
    }
}

function runFile(filePath: string) {
    // convert file to byte array
    const file = readFileSync(join(__dirname, filePath));

    const byteArray = new Uint8Array(file);
    const fileStr = new TextDecoder().decode(byteArray);
    // run(fileStr);

    if (hadError) {
        process.exit(65);
    }
}

function runPrompt() {
    readline.question(">>> ", (line: string) => {
        if (line === "exit") {
            process.exit(0);
        }
        // run(line);
        let scanner = new Scanner(line);
        scanner.scanTokens();
        runPrompt();
    });
}

// function run(source: string) {
//     const scanner = new Scanner(source);
//     const tokens = scanner.scanTokens();

//     tokens.map((token: string) => {
//         console.log(token);
//     });
// }
executeCommandLine(process.argv);
