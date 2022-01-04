import { RuntimeError } from "./error";
import {
    Assign,
    Binary,
    Call,
    Expression,
    Get,
    Grouping,
    Literal,
    Logical,
    Nil,
    Set,
    Super,
    This,
    Unary,
    Var,
    Visitor,
} from "./expr";
import { Token, TokenType } from "./scanner";
import { runtimeError } from "./jlox";

export class Interpreter implements Visitor<Object> {
    visitLiteralExpr(expr: Literal): Object {
        return expr.value;
    }

    visitGroupingExpr(expr: Grouping): Object {
        return this.evaluate(expr.expression);
    }

    visitUnaryExpr(expr: Unary): Object {
        const right: Object = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.MINUS:
                return -(right as number);
            case TokenType.BANG:
                return !this.isTruthy(right);
        }

        return Nil;
    }

    visitBinaryExpr(expr: Binary): Object {
        // post-order traversal evaluation
        const left: Object = this.evaluate(expr.left);
        const right: Object = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.PLUS:
                if (typeof left === "number" && typeof right === "number") {
                    return (left as number) + (right as number);
                }
                // add support concantenation of strings
                // dynamically check if left and right are strings
                if (typeof left === "string" && typeof right === "string") {
                    return (left as string) + (right as string);
                }
                throw new RuntimeError(
                    expr.operator,
                    "Operands must be both strings or integers!",
                );
            case TokenType.MINUS:
                this.checkOperands(expr.operator, left, right);
                return (left as number) - (right as number);
            case TokenType.STAR:
                this.checkOperands(expr.operator, left, right);
                return (left as number) * (right as number);
            case TokenType.SLASH:
                this.checkOperands(expr.operator, left, right);
                return (left as number) / (right as number);
            case TokenType.GREATER:
                this.checkOperands(expr.operator, left, right);
                return (left as number) > (right as number);
            case TokenType.GREATER_EQUAL:
                this.checkOperands(expr.operator, left, right);
                return (left as number) >= (right as number);
            case TokenType.LESS:
                this.checkOperands(expr.operator, left, right);
                return (left as number) < (right as number);
            case TokenType.LESS_EQUAL:
                this.checkOperands(expr.operator, left, right);
                return (left as number) <= (right as number);
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
        }

        // TODO: fix issues with returning null values
        return Nil; // unreachable
    }

    visitAssignExpr(expr: Assign): Object {
        return {};
    }

    visitCallExpr(expr: Call): Object {
        return {};
    }

    visitGetExpr(expr: Get): Object {
        return {};
    }

    visitLogicalExpr(expr: Logical): Object {
        return {};
    }

    visitSetExpr(expr: Set): Object {
        return {};
    }

    visitSuperExpr(expr: Super): Object {
        return {};
    }

    visitThisExpr(expr: This): Object {
        return {};
    }

    visitVarExpr(expr: Var): Object {
        return {};
    }

    accept<Object>(visitor: Visitor<Object>): Object {
        // @ts-ignore
        const value: Object = {};
        return value;
    }

    evaluate(expr: Expression): Object {
        return expr.accept(this);
    }

    isEqual(left: Object, right: Object): boolean {
        if (left === Nil && right === Nil) {
            return true;
        }
        if (left === Nil) {
            return false;
        }
        return left == right;
    }

    isTruthy(obj: Object): boolean {
        if (obj === null) {
            return false;
        }
        if (typeof obj === "boolean") {
            return obj as boolean;
        }
        // everything else is true, only nil and false are falsey
        return true;
    }

    checkOperands(operator: Token, left: Object, right: Object) {
        if (typeof left === "number" && typeof right === "number") {
            return;
        }
        throw new RuntimeError(operator, "Operands must be both integers!");
    }

    interpret(expr: Expression) {
        try {
            const value: Object = this.evaluate(expr);
            console.log(value);
        } catch (err: any) {
            // ISSUE: Catch clause variable type annotation must be 'any' or 'unknown' if specified
            console.log("oh no", err);
            const error: RuntimeError = <RuntimeError>err;
            runtimeError(error);
        }
    }
}
