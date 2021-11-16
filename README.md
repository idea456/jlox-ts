# Jlox on Typescript

A jlox interpreter written in Typescript.

-   [x] Scanner
-   [x] Grammar
-   [ ] Parser
-   [ ] Static analysis
-   [ ] Intermediate representation
-   [ ] Optimization
-   [ ] Virtual machine

## Context-free grammar of Jlox

```
expression -> literal | grouping | unary | binary ;

literal -> NUMBER | STRING | "true" | "false" | "nil" ;
grouping -> "(" expression ")"
unary ->  ("!" | "-") expression;
binary -> expression operator expression;
operator -> "==" | "!=" | "<" | "<=" | ">" | ">=" | "+"  | "-"  | "*" | "/" ;
```
