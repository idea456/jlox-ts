"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
function error(line, message) {
    report({ line, where: "", message });
}
exports.error = error;
function report(err) {
    console.log(`[Line ${err.line}] Error ${err.where}: ${err.message}`);
}
