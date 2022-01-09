import { RuntimeError } from "./error";
import { Token } from "./scanner";

export default class Environment {
    private readonly values: Map<String, Object | null> = new Map();
    private readonly enclosing: Environment | null;

    // if no enclosing argument is provided, it means that it initializes a global scope environment
    constructor(enclosing: Environment | null = null) {
        this.enclosing = enclosing;
    }

    // declarations are allowed to create new variables
    define(name: String, value: Object | null) {
        // therefore this sets a new key variable to the environment
        this.values.set(name, value);
    }

    assign(name: Token, value: Object) {
        // assignments are not allowed to create new variables
        if (this.values.has(name.lexeme)) {
            // therefore this only updates the variable
            this.values.set(name.lexeme, value);
            return;
        }

        // if this environment does not have it, check its enclosing (parent) environment
        // we prioritize the block environment first before its enclosing (parent) environment
        if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
            return;
        }

        throw new RuntimeError(name, `Undefined variable ${name.lexeme}!`);
    }

    get(name: Token): Object | null {
        if (this.values.has(name.lexeme)) {
            // non-null assertion
            return this.values.get(name.lexeme)!;
        }

        // similarly with assign, check enclosing environment
        if (this.enclosing !== null) {
            return this.enclosing.get(name);
        }
        // options to return null is less safe, prob stick to warning in compile time
        throw new RuntimeError(name, `Undefined variable ${name.lexeme}!`);
    }
}
