"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const error_1 = require("./error");
const expr_1 = require("./expr");
const scanner_1 = require("./scanner");
const jlox_1 = require("./jlox");
class Interpreter {
    visitLiteralExpr(expr) {
        return expr.value;
    }
    visitGroupingExpr(expr) {
        return this.evaluate(expr.expression);
    }
    visitUnaryExpr(expr) {
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case scanner_1.TokenType.MINUS:
                return -right;
            case scanner_1.TokenType.BANG:
                return !this.isTruthy(right);
        }
        return expr_1.Nil;
    }
    visitBinaryExpr(expr) {
        // post-order traversal evaluation
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case scanner_1.TokenType.PLUS:
                if (typeof left === "number" && typeof right === "number") {
                    return left + right;
                }
                // add support concantenation of strings
                // dynamically check if left and right are strings
                if (typeof left === "string" && typeof right === "string") {
                    return left + right;
                }
                throw new error_1.RuntimeError(expr.operator, "Operands must be both strings or integers!");
            case scanner_1.TokenType.MINUS:
                this.checkOperands(expr.operator, left, right);
                return left - right;
            case scanner_1.TokenType.STAR:
                this.checkOperands(expr.operator, left, right);
                return left * right;
            case scanner_1.TokenType.SLASH:
                this.checkOperands(expr.operator, left, right);
                return left / right;
            case scanner_1.TokenType.GREATER:
                this.checkOperands(expr.operator, left, right);
                return left > right;
            case scanner_1.TokenType.GREATER_EQUAL:
                this.checkOperands(expr.operator, left, right);
                return left >= right;
            case scanner_1.TokenType.LESS:
                this.checkOperands(expr.operator, left, right);
                return left < right;
            case scanner_1.TokenType.LESS_EQUAL:
                this.checkOperands(expr.operator, left, right);
                return left <= right;
            case scanner_1.TokenType.EQUAL_EQUAL:
                this.checkOperands(expr.operator, left, right);
                return this.isEqual(left, right);
            case scanner_1.TokenType.BANG_EQUAL:
                this.checkOperands(expr.operator, left, right);
                return !this.isEqual(left, right);
        }
        // TODO: fix issues with returning null values
        return expr_1.Nil; // unreachable
    }
    visitAssignExpr(expr) {
        return {};
    }
    visitCallExpr(expr) {
        return {};
    }
    visitGetExpr(expr) {
        return {};
    }
    visitLogicalExpr(expr) {
        return {};
    }
    visitSetExpr(expr) {
        return {};
    }
    visitSuperExpr(expr) {
        return {};
    }
    visitThisExpr(expr) {
        return {};
    }
    visitVarExpr(expr) {
        return {};
    }
    accept(visitor) {
        // @ts-ignore
        const value = {};
        return value;
    }
    evaluate(expr) {
        return expr.accept(this);
    }
    isEqual(left, right) {
        if (left === expr_1.Nil && right === expr_1.Nil) {
            return true;
        }
        if (left === expr_1.Nil) {
            return false;
        }
        return left == right;
    }
    isTruthy(obj) {
        if (obj === null) {
            return false;
        }
        if (typeof obj === "boolean") {
            return obj;
        }
        // everything else is true, only nil and false are falsey
        return true;
    }
    checkOperands(operator, left, right) {
        if (typeof left === "number" && typeof right === "number") {
            return;
        }
        throw new error_1.RuntimeError(operator, "Operands must be both integers!");
    }
    interpret(expr) {
        try {
            const value = this.evaluate(expr);
            console.log(value);
        }
        catch (err) {
            // ISSUE: Catch clause variable type annotation must be 'any' or 'unknown' if specified
            console.log("oh no", err);
            const error = err;
            (0, jlox_1.runtimeError)(error);
        }
    }
}
exports.Interpreter = Interpreter;
