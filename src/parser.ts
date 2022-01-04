import { error, tokenError } from "./error";
import { Binary, Expression, Grouping, Literal, Nil, Unary } from "./expr";
import { Token, TokenType } from "./scanner";

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
export class ParseError extends SyntaxError {
    // private readonly tokens: Array<Token>;
}

export class Parser {
    private readonly tokens: Array<Token>;
    private current: number = 0;

    constructor(tokens: Array<Token>) {
        this.tokens = tokens;
    }

    /**
     * expression -> equality;
     */
    private expression(): Expression {
        return this.equality();
    }

    /**
     * equality -> comparison (("==" | "!=") comparison)*;
     */
    private equality(): Expression {
        let expr: Expression = this.comparison();

        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            const operator: Token = this.previous();
            const right: Expression = this.comparison();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    /**
     * comparison -> term ((">" | "<" | ">=" | "<=") term)*;
     */
    private comparison(): Expression {
        let expr: Expression = this.term();

        while (
            this.match(
                TokenType.GREATER,
                TokenType.LESS,
                TokenType.GREATER_EQUAL,
                TokenType.LESS_EQUAL,
            )
        ) {
            const operator: Token = this.previous();
            const right: Expression = this.term();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    /**
     * term ->  factor (("+" | "-") factor)* ;
     */
    private term(): Expression {
        let expr: Expression = this.factor();

        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator: Token = this.previous();
            const right: Expression = this.factor();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    /**
     * factor -> unary (("*" | "/") unary)*;
     */
    private factor(): Expression {
        let expr: Expression = this.unary();

        while (this.match(TokenType.STAR, TokenType.SLASH)) {
            const operator: Token = this.previous();
            const right: Expression = this.unary();
            expr = new Binary(expr, operator, right);
        }

        return expr;
    }

    /**
     * ("!" / "-") unary | primary;
     */
    private unary(): Expression {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            const operator: Token = this.previous();
            const right: Expression = this.unary();
            return new Unary(operator, right);
        }
        let expr: Expression = this.primary();
        return expr;
    }

    /**
     * primary -> NUMBER | STRING | | "true" | "false" | "nil" | "(" expression ")" ;
     */
    private primary(): Expression {
        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().literal); // previous() is called since match() has consumed our token
        }
        if (this.match(TokenType.TRUE)) {
            return new Literal(true);
        }
        if (this.match(TokenType.FALSE)) {
            return new Literal(false);
        }
        if (this.match(TokenType.NIL)) {
            return new Literal(Nil);
        }
        if (this.match(TokenType.LEFT_PAREN)) {
            let expr: Expression = this.expression();
            this.consume(
                TokenType.RIGHT_PAREN,
                "Expected ')' after expression!",
            );
            return new Grouping(expr);
        }
        // if none of the token types match the current token, it is an invalid/unknown token
        throw tokenError(this.peek(), "Expect expression.");
    }

    private consume(type: TokenType, message: string): Token | ParseError {
        if (this.check(type)) {
            return this.advance();
        }
        throw this.error(this.peek(), message);
    }

    private error(token: Token, message: string): ParseError {
        tokenError(token, message);
        return new ParseError();
    }

    // function that implements panic-mode error recovery
    // this is called when ParseError is thrown, call synchronize() to discard tokens until a statement is reached
    private synchronize() {
        this.advance();

        while (!this.isAtEnd()) {
            // check if the current token is a statement
            if (this.previous().type === TokenType.SEMICOLON) return;
            switch (this.peek().type) {
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }

            this.advance(); // keep discarding tokens until we found a statement
        }
    }

    // match() consumes the token ONLY IF it matches the checked type and advances the current pointer by 1
    private match(...types: Array<TokenType>): boolean {
        for (let i = 0; i < types.length; i++) {
            if (this.check(types[i])) {
                this.advance(); // consume the token
                return true;
            }
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().type === type;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private advance(): Token {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }

    private previous(): Token {
        if (this.current === 0) {
            return this.tokens[0];
        }
        return this.tokens[this.current - 1];
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    parse(): Expression {
        try {
            return this.expression();
        } catch {
            return new Literal(Nil);
        }
    }
}
