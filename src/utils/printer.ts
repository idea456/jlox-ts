// import {
//     Expression,
//     Binary,
//     Visitor,
//     Grouping,
//     Literal,
//     Unary,
//     Assign,
// } from "../expr";

// export class ASTPrinter implements Visitor<string> {
//     print(expr: Expression): string {
//         return expr.accept(this);
//     }

//     parenthesize(name: string, ...exprs: Expression[]) {
//         let ret = "(" + name;
//         for (let i = 0; i < exprs.length; i++) {
//             ret += " " + exprs[i].accept<string>(this);
//         }
//         ret += ")";
//         return ret;
//     }

//     visitBinaryExpr(expr: Binary): string {
//         return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
//     }

//     visitGroupingExpr(expr: Grouping): string {
//         return this.parenthesize("group", expr.expression);
//     }

//     visitLiteralExpr(expr: Literal): string {
//         if (expr.value === null) return "nil";
//         return expr.value.toString();
//     }

//     visitUnaryExpr(expr: Unary): string {
//         return this.parenthesize(expr.operator.lexeme, expr.right);
//     }

//     visitAssignExpr(expr: Assign): string {
//         return this.parenthesize(expr.name.lexeme, expr.value);
//     }
// }
