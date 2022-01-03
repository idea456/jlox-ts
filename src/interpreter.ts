import {
    Binary,
    Expression,
    Grouping,
    Literal,
    Nil,
    Unary,
    Visitor,
} from "./expr";
import { TokenType } from "./scanner";

class Interpreter implements Visitor<Object> {
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
                if (left instanceof Number && right instanceof Number) {
                    return (left as number) + (right as number);
                }
                // add support concantenation of strings
                // dynamically check if left and right are strings
                if (left instanceof String && right instanceof String) {
                    return (left as string) + (right as string);
                }
                break;
            case TokenType.MINUS:
                return (left as number) - (right as number);
            case TokenType.STAR:
                return (left as number) * (right as number);
            case TokenType.SLASH:
                return (left as number) / (right as number);
        }

        // TODO: fix issues with returning null values
        return Nil; // unreachable
    }

    evaluate(expr: Expression): Object {
        return expr.accept(this);
    }

    isTruthy(obj: Object): boolean {
        if (obj === null) {
            return false;
        }
        if (obj instanceof Boolean) {
            return obj as boolean;
        }
        // everything else is true, only nil and false are falsey
        return true;
    }
}
