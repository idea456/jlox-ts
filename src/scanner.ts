import { error } from "./error";

export enum TokenType {
    // single-character tokens
    LEFT_PAREN,
    RIGHT_PAREN,
    LEFT_BRACE,
    RIGHT_BRACE,
    COMMA,
    DOT,
    MINUS,
    PLUS,
    SEMICOLON,
    SLASH,
    STAR,
    // one or two character tokens
    BANG,
    BANG_EQUAL,
    EQUAL,
    EQUAL_EQUAL,
    GREATER,
    GREATER_EQUAL,
    LESS,
    LESS_EQUAL,
    // literals
    IDENTIFIER,
    STRING,
    NUMBER,
    // keywords
    AND,
    CLASS,
    ELSE,
    FALSE,
    FUN,
    FOR,
    IF,
    NIL,
    OR,
    PRINT,
    RETURN,
    SUPER,
    THIS,
    TRUE,
    VAR,
    WHILE,
    EOF,
}

export class Token {
    readonly type: TokenType;
    readonly lexeme: string;
    readonly literal?: any;
    readonly line?: number | null;

    constructor(
        type: TokenType,
        lexeme: string = "",
        literal?: any,
        line?: number,
    ) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
}

export default class Scanner {
    private readonly source: string;
    private tokens: Array<Token> = [];
    private start = 0;
    private current = 0;
    private line = 1;

    static readonly keywords = new Map<string, TokenType>();

    static {
        this.keywords.set("and", TokenType.AND);
        this.keywords.set("or", TokenType.OR);
        this.keywords.set("class", TokenType.CLASS);
        this.keywords.set("else", TokenType.ELSE);
        this.keywords.set("false", TokenType.FALSE);
        this.keywords.set("for", TokenType.FOR);
        this.keywords.set("fun", TokenType.FUN);
        this.keywords.set("if", TokenType.IF);
        this.keywords.set("nil", TokenType.NIL);
        this.keywords.set("print", TokenType.PRINT);
        this.keywords.set("return", TokenType.RETURN);
        this.keywords.set("super", TokenType.SUPER);
        this.keywords.set("this", TokenType.THIS);
        this.keywords.set("true", TokenType.TRUE);
        this.keywords.set("var", TokenType.VAR);
        this.keywords.set("while", TokenType.WHILE);
    }

    constructor(source: string) {
        this.source = source;
    }

    isAtEnd(): boolean {
        return this.current >= this.source.length;
    }

    // function that consumes character
    advance(): string {
        return this.source.charAt(this.current++);
    }

    scanTokens(): Array<Token> {
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
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ")":
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case "{":
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case "}":
                this.addToken(TokenType.RIGHT_BRACE);
                break;
            case ",":
                this.addToken(TokenType.COMMA);
                break;
            case ".":
                this.addToken(TokenType.DOT);
                break;
            case "-":
                this.addToken(TokenType.MINUS);
                break;
            case "+":
                this.addToken(TokenType.PLUS);
                break;
            case ";":
                this.addToken(TokenType.SEMICOLON);
                break;
            case "*":
                this.addToken(TokenType.STAR);
                break;
            // handle cases for !=, ==, <=, >=
            case "!":
                this.addToken(
                    this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG,
                );
                break;
            case "=":
                this.addToken(
                    this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
                );
                break;
            case "<":
                this.addToken(
                    this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS,
                );
                break;
            case ">":
                this.addToken(
                    this.match("=")
                        ? TokenType.GREATER_EQUAL
                        : TokenType.GREATER,
                );
                break;
            // handle comments
            case "/":
                if (this.match("/")) {
                    while (this.peek() !== "\n" && !this.isAtEnd()) {
                        // consume characters until reaching the end of the comment, which is represented by a newline
                        this.advance();
                    }
                } else {
                    this.addToken(TokenType.SLASH);
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
                } else if (this.isAlpha(c)) {
                    this.scanIdentifier();
                } else {
                    error(this.line, "Unexpected character.");
                }
                break;
        }
    }

    addToken(type: TokenType, literal?: any) {
        if (literal === undefined) {
            this.tokens.push(new Token(type));
        } else {
            let text = this.source.substring(this.start, this.current);
            this.tokens.push(new Token(type, text, literal, this.line));
        }
    }

    match(c: string): boolean {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== c) return false;

        this.current++;
        return true;
    }

    // lookahead function by single character
    peek() {
        if (this.isAtEnd()) return "\0";
        return this.source.charAt(this.current);
    }

    // lookahead function by two characters
    peekNext() {
        if (this.current + 1 >= this.source.length) return "\0";
        return this.source.charAt(this.current + 1);
    }

    scanString() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            // lox supports multiline strings
            if (this.peek() === "\n") this.line++;
            this.advance();
        }

        if (this.isAtEnd() && this.peek() === "\0") {
            error(this.line, "Unterminated string.");
        }

        let str = this.source.substring(this.start + 1, this.current);
        this.tokens.push(new Token(TokenType.STRING, str, str));
        this.current++;
    }

    isNumber(c: string): boolean {
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

        this.addToken(
            TokenType.NUMBER,
            parseFloat(this.source.substring(this.start, this.current)),
        );
    }

    isAlpha(c: string): boolean {
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
        this.addToken(type);
    }
}
