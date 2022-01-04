"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nil = exports.Var = exports.This = exports.Super = exports.Logical = exports.Unary = exports.Literal = exports.Grouping = exports.Set = exports.Get = exports.Call = exports.Assign = exports.Binary = exports.Expression = void 0;
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
exports.Expression = Expression;
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
exports.Binary = Binary;
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
exports.Assign = Assign;
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
exports.Call = Call;
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
exports.Get = Get;
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
exports.Set = Set;
class Grouping extends Expression {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}
exports.Grouping = Grouping;
class Literal extends Expression {
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
exports.Literal = Literal;
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
exports.Unary = Unary;
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
exports.Logical = Logical;
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
exports.Super = Super;
class This extends Expression {
    constructor(keyword) {
        super();
        this.keyword = keyword;
    }
    accept(visitor) {
        return visitor.visitThisExpr(this);
    }
}
exports.This = This;
class Var extends Expression {
    constructor(name) {
        super();
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitVarExpr(this);
    }
}
exports.Var = Var;
class Nil extends Object {
}
exports.Nil = Nil;
