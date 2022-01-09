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
    Variable as ExprVariable,
    Visitor as ExprVisitor,
} from "./expr";
import { Token, TokenType } from "./scanner";
import { runtimeError } from "./jlox";
import {
    Block,
    Expr,
    Print,
    Statement,
    Var,
    Variable as StmtVariable,
    Visitor as StmtVisitor,
} from "./statement";
import Environment from "./environment";

export class Interpreter implements ExprVisitor<Object>, StmtVisitor<void> {
    private environment: Environment = new Environment();

    visitExprStatement(expr: Expr): void {
        this.evaluate(expr.expression);
    }

    visitPrintStatement(expr: Print): void {
        const value: Object = this.evaluate(expr.expression);
        // console.log(expr);
        console.log(value);
    }

    visitVariableStatement(stmt: Var): void {
        let value: Object | null = null;
        if (stmt.initializer !== null) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.lexeme, value);
    }

    visitBlockStatement(expr: Block): void {
        // create a new environment for the block
        let blockEnvironment: Environment = new Environment(this.environment);
        this.executeBlock(expr.statements, blockEnvironment);
    }

    // should have used visitIndentifierExpr, much more easier to recognize T_T
    visitVariableExpr(expr: ExprVariable): Object {
        return this.environment.get(expr.name)!;
    }

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
                if ((right as number) === 0) {
                    throw new RuntimeError(
                        expr.operator,
                        "Cannot divide numbers by 0!",
                    );
                }
                return (left as number) / (right as number);
            case TokenType.MODULUS:
                this.checkOperands(expr.operator, left, right);
                return (left as number) % (right as number);
            case TokenType.GREATER:
                if ((left as string) && (right as string)) {
                    return left > right;
                }
                this.checkOperands(expr.operator, left, right);
                return (left as number) > (right as number);
            case TokenType.GREATER_EQUAL:
                if ((left as string) && (right as string)) {
                    return left >= right;
                }
                this.checkOperands(expr.operator, left, right);
                return (left as number) >= (right as number);
            case TokenType.LESS:
                if ((left as string) && (right as string)) {
                    return left < right;
                }
                this.checkOperands(expr.operator, left, right);
                return (left as number) < (right as number);
            case TokenType.LESS_EQUAL:
                if ((left as string) && (right as string)) {
                    return left <= right;
                }
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
        const value: Object = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
        return value;
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

    // @ts-ignore
    accept<Object>(
        visitor: ExprVisitor<Object> | StmtVisitor<void>,
    ): Object | void {
        // @ts-ignore
        const value: Object = {};
        return value;
    }

    evaluate(expr: Expression): Object {
        // @ts-ignore
        return expr.accept(this);
    }

    execute(stmt: Statement): void {
        // @ts-ignore
        return stmt.accept(this);
    }

    executeBlock(statements: Array<Statement>, environment: Environment): void {
        // save the current environment to be restored later after block statement ends
        const previous: Environment = this.environment;

        try {
            // modify the new environment to the environment passed by the argument
            this.environment = environment;

            for (let i = 0; i < statements.length; i++) {
                this.execute(statements[i]);
            }
        } finally {
            // remove the current environment and restore the previous environment
            this.environment = previous;
        }
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

    interpret(statements: Array<Statement>) {
        try {
            for (let i = 0; i < statements.length; i++) {
                this.execute(statements[i]);
            }
        } catch (err: any) {
            // ISSUE: Catch clause variable type annotation must be 'any' or 'unknown' if specified
            console.log("oh no", err);
            const error: RuntimeError = <RuntimeError>err;
            runtimeError(error);
        }
    }
}
