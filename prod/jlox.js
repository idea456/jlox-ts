"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const scanner_1 = __importDefault(require("./scanner"));
var hadError = false;
const readline = require("node:readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
function executeCommandLine(args) {
    if (args.length > 3) {
        console.log("Usage: jlox [file]");
        process.exit(64);
    }
    else if (args.length === 3) {
        runFile(args[2]);
    }
    else {
        console.log("Jlots 1.0.0 | Jlox on Typescript");
        console.log('Type "exit" to exit the program.');
        runPrompt();
    }
}
function runFile(filePath) {
    // convert file to byte array
    const file = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, filePath));
    const byteArray = new Uint8Array(file);
    const fileStr = new TextDecoder().decode(byteArray);
    // run(fileStr);
    if (hadError) {
        process.exit(65);
    }
}
function runPrompt() {
    readline.question(">>> ", (line) => {
        if (line === "exit") {
            process.exit(0);
        }
        // run(line);
        let scanner = new scanner_1.default(line);
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
function error(line, message) {
    report(line, "", message);
}
function report(line, where, message) {
    console.log(`[Line ${line}] Error ${where}: ${message}`);
    hadError = true;
}
executeCommandLine(process.argv);
