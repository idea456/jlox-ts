import { Expression } from "./expr";
import { Token } from "./scanner";

export abstract class Statement {
    abstract accept<R>(visitor: Visitor<R>): R;
}

export interface Visitor<R> extends Statement {
    visitExprStatement(expr: Expr): R;
    visitPrintStatement(expr: Print): R;
    visitUnaryStatement(expr: Unary): R;
    visitVariableStatement(expr: Variable): R;
    visitBlockStatement(expr: Block): R;
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

export class Var extends Statement {
    readonly name: Token;
    readonly initializer: Expression | null = null;

    constructor(name: Token, initializer: Expression | null = null) {
        super();
        this.name = name;
        this.initializer = initializer;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitVariableStatement(this);
    }
}

export class Unary extends Statement {
    readonly operator: Token;
    readonly right: Expression;

    constructor(operator: Token, right: Expression) {
        super();
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitUnaryStatement(this);
    }
}

export class Variable extends Statement {
    readonly name: Token;

    constructor(name: Token) {
        super();
        this.name = name;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitVariableStatement(this);
    }
}

export class Block extends Statement {
    readonly statements: Array<Statement>;

    constructor(statements: Array<Statement>) {
        super();
        this.statements = statements;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitBlockStatement(this);
    }
}
