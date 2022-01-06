import { Expression } from "./expr";

export abstract class Statement {
    abstract accept<R>(visitor: Visitor<R>): R;
}

export interface Visitor<R> extends Statement {
    visitExprStatement(expr: Expr): R;
    visitPrintStatement(expr: Print): R;
}

/**
 * expr_stmt -> expression ";"
 */
export class Expr extends Statement {
    readonly expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitExprStatement(this);
    }
}

/**
 * print_stmt -> "print" expression ";"
 */
export class Print extends Statement {
    readonly expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitPrintStatement(this);
    }
}
