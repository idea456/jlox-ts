"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.ParseError = void 0;
const error_1 = require("./error");
const expr_1 = require("./expr");
const scanner_1 = require("./scanner");
/**
 * Stratified grammar by precedence (lowest to highest):
 * expression -> equality;
 * equality -> comparison (("==" | "!=") comparison)*;
 * comparison -> term ((">" | "<" | ">=" | "<=") term)*;
 * term ->  factor (("+" | "-") factor)* ;
 * factor -> unary (("*" | "/") unary)*;
 * unary -> ("!" / "-") unary | primary;
 * primary -> NUMBER | STRING | | "true" | "false" | "nil" | "(" expression ")" ;
 */
// sentinel class to unwind parser
class ParseError extends SyntaxError {
}
exports.ParseError = ParseError;
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    /**
     * expression -> equality;
     */
    expression() {
        return this.equality();
    }
    /**
     * equality -> comparison (("==" | "!=") comparison)*;
     */
    equality() {
        let expr = this.comparison();
        while (this.match(scanner_1.TokenType.BANG_EQUAL, scanner_1.TokenType.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    /**
     * comparison -> term ((">" | "<" | ">=" | "<=") term)*;
     */
    comparison() {
        let expr = this.term();
        while (this.match(scanner_1.TokenType.GREATER, scanner_1.TokenType.LESS, scanner_1.TokenType.GREATER_EQUAL, scanner_1.TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = new expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    /**
     * term ->  factor (("+" | "-") factor)* ;
     */
    term() {
        let expr = this.factor();
        while (this.match(scanner_1.TokenType.PLUS, scanner_1.TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    /**
     * factor -> unary (("*" | "/") unary)*;
     */
    factor() {
        let expr = this.unary();
        while (this.match(scanner_1.TokenType.STAR, scanner_1.TokenType.SLASH)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    /**
     * ("!" / "-") unary | primary;
     */
    unary() {
        let expr = this.primary();
        if (this.match(scanner_1.TokenType.BANG, scanner_1.TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.unary();
            return new expr_1.Unary(operator, right);
        }
        return expr;
    }
    /**
     * primary -> NUMBER | STRING | | "true" | "false" | "nil" | "(" expression ")" ;
     */
    primary() {
        if (this.match(scanner_1.TokenType.NUMBER, scanner_1.TokenType.STRING)) {
            return new expr_1.Literal(this.previous().literal); // previous() is called since match() has consumed our token
        }
        if (this.match(scanner_1.TokenType.TRUE)) {
            return new expr_1.Literal(true);
        }
        if (this.match(scanner_1.TokenType.FALSE)) {
            return new expr_1.Literal(false);
        }
        if (this.match(scanner_1.TokenType.NIL)) {
            return new expr_1.Literal(null);
        }
        if (this.match(scanner_1.TokenType.LEFT_PAREN)) {
            let expr = this.expression();
            this.consume(scanner_1.TokenType.RIGHT_PAREN, "Expected ')' after expression!");
            return new expr_1.Grouping(expr);
        }
        // if none of the token types match the current token, it is an invalid/unknown token
        throw (0, error_1.tokenError)(this.peek(), "Expect expression.");
    }
    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        throw this.error(this.peek(), message);
    }
    error(token, message) {
        (0, error_1.tokenError)(token, message);
        return new ParseError();
    }
    // function that implements panic-mode error recovery
    // this is called when ParseError is thrown, call synchronize() to discard tokens until a statement is reached
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            // check if the current token is a statement
            if (this.previous().type === scanner_1.TokenType.SEMICOLON)
                return;
            switch (this.peek().type) {
                case scanner_1.TokenType.CLASS:
                case scanner_1.TokenType.FUN:
                case scanner_1.TokenType.VAR:
                case scanner_1.TokenType.FOR:
                case scanner_1.TokenType.IF:
                case scanner_1.TokenType.WHILE:
                case scanner_1.TokenType.PRINT:
                case scanner_1.TokenType.RETURN:
                    return;
            }
            this.advance(); // keep discarding tokens until we found a statement
        }
    }
    // match() consumes the token ONLY IF it matches the checked type and advances the current pointer by 1
    match(...types) {
        for (let i = 0; i < types.length; i++) {
            if (this.check(types[i])) {
                this.advance(); // consume the token
                return true;
            }
        }
        return false;
    }
    check(type) {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().type === type;
    }
    peek() {
        return this.tokens[this.current];
    }
    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }
    previous() {
        if (this.current === 0) {
            return this.tokens[0];
        }
        return this.tokens[this.current - 1];
    }
    isAtEnd() {
        return this.peek().type === scanner_1.TokenType.EOF;
    }
    parse() {
        try {
            return this.expression();
        }
        catch (_a) {
            return null;
        }
    }
}
exports.Parser = Parser;
