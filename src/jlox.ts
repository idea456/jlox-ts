import { readFileSync } from "fs";
import { join } from "path";
import { RuntimeError } from "./error";
import { Expression } from "./expr";
import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import Scanner, { Token } from "./scanner";
import { Statement } from "./statement";

var hadError = false;
var hadRuntimeError = false;
var interpreter = new Interpreter();

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
    if (hadRuntimeError) {
        process.exit(70);
    }
}

function runPrompt() {
    let parser;
    readline.question(">>> ", (line: string) => {
        if (line === "exit") {
            process.exit(0);
        }

        let scanner = new Scanner(line);
        let tokens: Array<Token> = scanner.scanTokens();
        parser = new Parser(tokens);
        let statements: Array<Statement> = parser.parse();
        // console.log("expr : ", statements);
        interpreter.interpret(statements);
        if (hadError) {
            process.exit(65);
        }
        if (hadRuntimeError) {
            process.exit(70);
        }
        runPrompt();
    });
}

export function runtimeError(err: RuntimeError) {
    console.log(`\n[Line ${err.token.line}] `);
    hadRuntimeError = true;
}

executeCommandLine(process.argv);
