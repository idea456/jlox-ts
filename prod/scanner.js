"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.TokenType = void 0;
const error_1 = require("./error");
var TokenType;
(function (TokenType) {
    // single-character tokens
    TokenType[TokenType["LEFT_PAREN"] = 0] = "LEFT_PAREN";
    TokenType[TokenType["RIGHT_PAREN"] = 1] = "RIGHT_PAREN";
    TokenType[TokenType["LEFT_BRACE"] = 2] = "LEFT_BRACE";
    TokenType[TokenType["RIGHT_BRACE"] = 3] = "RIGHT_BRACE";
    TokenType[TokenType["COMMA"] = 4] = "COMMA";
    TokenType[TokenType["DOT"] = 5] = "DOT";
    TokenType[TokenType["MINUS"] = 6] = "MINUS";
    TokenType[TokenType["PLUS"] = 7] = "PLUS";
    TokenType[TokenType["SEMICOLON"] = 8] = "SEMICOLON";
    TokenType[TokenType["SLASH"] = 9] = "SLASH";
    TokenType[TokenType["STAR"] = 10] = "STAR";
    // one or two character tokens
    TokenType[TokenType["BANG"] = 11] = "BANG";
    TokenType[TokenType["BANG_EQUAL"] = 12] = "BANG_EQUAL";
    TokenType[TokenType["EQUAL"] = 13] = "EQUAL";
    TokenType[TokenType["EQUAL_EQUAL"] = 14] = "EQUAL_EQUAL";
    TokenType[TokenType["GREATER"] = 15] = "GREATER";
    TokenType[TokenType["GREATER_EQUAL"] = 16] = "GREATER_EQUAL";
    TokenType[TokenType["LESS"] = 17] = "LESS";
    TokenType[TokenType["LESS_EQUAL"] = 18] = "LESS_EQUAL";
    // literals
    TokenType[TokenType["IDENTIFIER"] = 19] = "IDENTIFIER";
    TokenType[TokenType["STRING"] = 20] = "STRING";
    TokenType[TokenType["NUMBER"] = 21] = "NUMBER";
    // keywords
    TokenType[TokenType["AND"] = 22] = "AND";
    TokenType[TokenType["CLASS"] = 23] = "CLASS";
    TokenType[TokenType["ELSE"] = 24] = "ELSE";
    TokenType[TokenType["FALSE"] = 25] = "FALSE";
    TokenType[TokenType["FUN"] = 26] = "FUN";
    TokenType[TokenType["FOR"] = 27] = "FOR";
    TokenType[TokenType["IF"] = 28] = "IF";
    TokenType[TokenType["NIL"] = 29] = "NIL";
    TokenType[TokenType["OR"] = 30] = "OR";
    TokenType[TokenType["PRINT"] = 31] = "PRINT";
    TokenType[TokenType["RETURN"] = 32] = "RETURN";
    TokenType[TokenType["SUPER"] = 33] = "SUPER";
    TokenType[TokenType["THIS"] = 34] = "THIS";
    TokenType[TokenType["TRUE"] = 35] = "TRUE";
    TokenType[TokenType["VAR"] = 36] = "VAR";
    TokenType[TokenType["WHILE"] = 37] = "WHILE";
    TokenType[TokenType["EOF"] = 38] = "EOF";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
class Token {
    constructor(type, lexeme = "", literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
}
exports.Token = Token;
class Scanner {
    constructor(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.source = source;
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    // function that consumes character
    advance() {
        return this.source.charAt(this.current++);
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            // beginning of next lexeme
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        console.log(this.tokens);
        return this.tokens;
    }
    scanToken() {
        let c = this.advance();
        switch (c) {
            case "(":
                this.addToken(TokenType.LEFT_PAREN, "(", null);
                break;
            case ")":
                this.addToken(TokenType.RIGHT_PAREN, ")", null);
                break;
            case "{":
                this.addToken(TokenType.LEFT_BRACE, "{", null);
                break;
            case "}":
                this.addToken(TokenType.RIGHT_BRACE, "}", null);
                break;
            case ",":
                this.addToken(TokenType.COMMA, ",", null);
                break;
            case ".":
                this.addToken(TokenType.DOT, ".", null);
                break;
            case "-":
                this.addToken(TokenType.MINUS, "-", null);
                break;
            case "+":
                this.addToken(TokenType.PLUS, "+", null);
                break;
            case ";":
                this.addToken(TokenType.SEMICOLON, ";", null);
                break;
            case "*":
                this.addToken(TokenType.STAR, "*", null);
                break;
            // handle cases for !=, ==, <=, >=
            case "!":
                this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG, this.match("=") ? "!=" : "!", null);
                break;
            case "=":
                this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, this.match("=") ? "==" : "=", null);
                break;
            case "<":
                this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS, this.match("=") ? "<=" : "<", null);
                break;
            case ">":
                this.addToken(this.match("=")
                    ? TokenType.GREATER_EQUAL
                    : TokenType.GREATER, this.match("=") ? ">=" : "=", null);
                break;
            // handle comments
            case "/":
                if (this.match("/")) {
                    while (this.peek() !== "\n" && !this.isAtEnd()) {
                        // consume characters until reaching the end of the comment, which is represented by a newline
                        this.advance();
                    }
                }
                else {
                    this.addToken(TokenType.SLASH, "/", null);
                }
                break;
            // ignore newlines and whitespaces
            case " ":
            case "\r":
            case "\t":
                break;
            case "\n":
                this.line++;
                break;
            // strings
            case '"':
                this.scanString();
                break;
            default:
                if (this.isNumber(c)) {
                    this.scanNumber();
                }
                else if (this.isAlpha(c)) {
                    this.scanIdentifier();
                }
                else {
                    (0, error_1.error)(this.line, "Unexpected character.");
                }
                break;
        }
    }
    addToken(type, lexeme, literal) {
        if (literal === undefined) {
            this.tokens.push(new Token(type, lexeme, null));
        }
        else {
            let text = this.source.substring(this.start, this.current);
            this.tokens.push(new Token(type, text, literal, this.line));
        }
    }
    match(c) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) !== c)
            return false;
        this.current++;
        return true;
    }
    // lookahead function by single character
    peek() {
        if (this.isAtEnd())
            return "\0";
        return this.source.charAt(this.current);
    }
    // lookahead function by two characters
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return "\0";
        return this.source.charAt(this.current + 1);
    }
    scanString() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            // lox supports multiline strings
            if (this.peek() === "\n")
                this.line++;
            this.advance();
        }
        if (this.isAtEnd() && this.peek() === "\0") {
            (0, error_1.error)(this.line, "Unterminated string.");
        }
        let str = this.source.substring(this.start + 1, this.current);
        this.tokens.push(new Token(TokenType.STRING, str, str));
        this.current++;
    }
    isNumber(c) {
        return c >= "0" && c <= "9";
    }
    scanNumber() {
        while (this.isNumber(this.peek())) {
            this.advance();
        }
        if (this.peek() === "." && this.isNumber(this.peekNext())) {
            // consume the decimal point
            this.advance();
        }
        while (this.isNumber(this.peek())) {
            this.advance();
        }
        this.addToken(TokenType.NUMBER, "", parseFloat(this.source.substring(this.start, this.current)));
    }
    isAlpha(c) {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
    }
    scanIdentifier() {
        // perform maximal munching: scan the most characters as possible
        // to avoid cases where for instance: whiled is matched as WHILE token instead of IDENTIFIER token
        while (this.isAlpha(this.peek()) || this.isNumber(this.peek())) {
            this.advance();
        }
        let text = this.source.substring(this.start, this.current);
        let type = Scanner.keywords.get(text);
        // if it is an identifier
        if (type === undefined) {
            type = TokenType.IDENTIFIER;
        }
        this.addToken(type, "", "");
    }
}
exports.default = Scanner;
_a = Scanner;
Scanner.keywords = new Map();
(() => {
    _a.keywords.set("and", TokenType.AND);
    _a.keywords.set("or", TokenType.OR);
    _a.keywords.set("class", TokenType.CLASS);
    _a.keywords.set("else", TokenType.ELSE);
    _a.keywords.set("false", TokenType.FALSE);
    _a.keywords.set("for", TokenType.FOR);
    _a.keywords.set("fun", TokenType.FUN);
    _a.keywords.set("if", TokenType.IF);
    _a.keywords.set("nil", TokenType.NIL);
    _a.keywords.set("print", TokenType.PRINT);
    _a.keywords.set("return", TokenType.RETURN);
    _a.keywords.set("super", TokenType.SUPER);
    _a.keywords.set("this", TokenType.THIS);
    _a.keywords.set("true", TokenType.TRUE);
    _a.keywords.set("var", TokenType.VAR);
    _a.keywords.set("while", TokenType.WHILE);
})();
