"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class Expression {
}
class Binary extends Expression {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}
class Assign extends Expression {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitAssignExpr(this);
    }
}
class Call extends Expression {
    constructor(callee, paren, args) {
        super();
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }
    accept(visitor) {
        return visitor.visitCallExpr(this);
    }
}
class Get extends Expression {
    constructor(object, name) {
        super();
        this.object = object;
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitGetExpr(this);
    }
}
class Set extends Expression {
    constructor(object, name, value) {
        super();
        this.object = object;
        this.name = name;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitSetExpr(this);
    }
}
class Grouping extends Expression {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}
class Literal extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
class Unary extends Expression {
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
}
class Logical extends Expression {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitLogicalExpr(this);
    }
}
class Super extends Expression {
    constructor(keyword, method) {
        super();
        this.keyword = keyword;
        this.method = method;
    }
    accept(visitor) {
        return visitor.visitSuperExpr(this);
    }
}
class This extends Expression {
    constructor(keyword) {
        super();
        this.keyword = keyword;
    }
    accept(visitor) {
        return visitor.visitThisExpr(this);
    }
}
class Var extends Expression {
    constructor(name) {
        super();
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitVarExpr(this);
    }
}
