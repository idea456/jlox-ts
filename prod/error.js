"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeError = exports.tokenError = exports.error = void 0;
const scanner_1 = require("./scanner");
function error(line, message) {
    report(line, "", message);
}
exports.error = error;
function report(line, where, message) {
    console.log(`[Line ${line}] Error ${where}: ${message}`);
}
function tokenError(token, message) {
    if (token.type === scanner_1.TokenType.EOF) {
        report(token.line, "at end", message);
    }
    else {
        report(token.line, " at '" + token.lexeme + "'", message);
    }
}
exports.tokenError = tokenError;
class RuntimeError extends Error {
    constructor(token, message) {
        super(message);
        this.token = token;
    }
}
exports.RuntimeError = RuntimeError;
