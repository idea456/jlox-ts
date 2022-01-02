import { Token, TokenType } from "./scanner";

export function error(line: number, message: string) {
    report(line, "", message);
}

function report(
    line: number | null | undefined,
    where: string,
    message: string,
) {
    console.log(`[Line ${line}] Error ${where}: ${message}`);
}

export function tokenError(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
        report(token.line, "at end", message);
    } else {
        report(token.line, " at '" + token.lexeme + "'", message);
    }
}
