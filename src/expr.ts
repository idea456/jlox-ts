// Define an abstract class for an expresssion
import { Token } from "./scanner";

// Each subclass in the Expression class represents a production under the expression
/*
    Assign : Token name , Expression value
    Binary : Expression left , Token operator, Expression right
    Call : Expression callee , Token paren , Array<Expression> arguments
    Get : Expression object, Token name
    Set : Expression object , Token name , Expression value
    Literal: Object value
    Unary: Token operator , Expression right
    Logical : Expression left , Token operator , Expression right
    Super : Token keyword , Token method
    This : Token keyword
    Var : Token name

*/
export abstract class Expression {
    abstract accept<R>(visitor: Visitor<R>): R;
}

// implement the Visitor pattern: https://refactoring.guru/design-patterns/visitor
export interface Visitor<R> extends Expression {
    visitAssignExpr(expr: Assign): R;
    visitBinaryExpr(expr: Binary): R;
    visitCallExpr(expr: Call): R;
    visitGetExpr(expr: Get): R;
    visitSetExpr(expr: Set): R;
    visitGroupingExpr(expr: Grouping): R;
    visitLiteralExpr(expr: Literal): R;
    visitUnaryExpr(expr: Unary): R;
    visitLogicalExpr(expr: Logical): R;
    visitSuperExpr(expr: Super): R;
    visitThisExpr(expr: This): R;
    visitVarExpr(expr: Var): R;
}

export class Binary extends Expression {
    readonly left: Expression;
    readonly operator: Token;
    readonly right: Expression;

    constructor(left: Expression, operator: Token, right: Expression) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitBinaryExpr(this);
    }
}

export class Assign extends Expression {
    readonly name: Token;
    readonly value: Expression;

    constructor(name: Token, value: Expression) {
        super();
        this.name = name;
        this.value = value;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitAssignExpr(this);
    }
}

export class Call extends Expression {
    readonly callee: Expression;
    readonly paren: Token;
    readonly args: Array<Expression>;

    constructor(callee: Expression, paren: Token, args: Array<Expression>) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitCallExpr(this);
    }
}

export class Get extends Expression {
    readonly object: Expression;
    readonly name: Token;

    constructor(object: Expression, name: Token) {
        super();
        this.object = object;
        this.name = name;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitGetExpr(this);
    }
}

export class Set extends Expression {
    readonly object: Expression;
    readonly name: Token;
    readonly value: Expression;

    constructor(object: Expression, name: Token, value: Expression) {
        super();
        this.object = object;
        this.name = name;
        this.value = value;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitSetExpr(this);
    }
}

export class Grouping extends Expression {
    readonly expression: Expression;

    constructor(expression: Expression) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitGroupingExpr(this);
    }
}

export class Literal extends Expression {
    readonly value: Object | null;

    constructor(value: Object | null) {
        super();
        this.value = value;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitLiteralExpr(this);
    }
}

export class Unary extends Expression {
    readonly operator: Token;
    readonly right: Expression;

    constructor(operator: Token, right: Expression) {
        super();
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitUnaryExpr(this);
    }
}

export class Logical extends Expression {
    readonly left: Expression;
    readonly operator: Token;
    readonly right: Expression;

    constructor(left: Expression, operator: Token, right: Expression) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitLogicalExpr(this);
    }
}

export class Super extends Expression {
    readonly keyword: Token;
    readonly method: Token;

    constructor(keyword: Token, method: Token) {
        super();
        this.keyword = keyword;
        this.method = method;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitSuperExpr(this);
    }
}

export class This extends Expression {
    readonly keyword: Token;

    constructor(keyword: Token) {
        super();
        this.keyword = keyword;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitThisExpr(this);
    }
}

export class Var extends Expression {
    readonly name: Token;

    constructor(name: Token) {
        super();
        this.name = name;
    }

    accept<R>(visitor: Visitor<R>) {
        return visitor.visitVarExpr(this);
    }
}
