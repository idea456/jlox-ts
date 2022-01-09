import { RuntimeError } from "./error";
import { Token } from "./scanner";

export default class Environment {
    private readonly values: Map<String, Object | null> = new Map();

    define(name: String, value: Object | null) {
        this.values.set(name, value);
    }

    get(name: Token): Object | null {
        if (this.values.has(name.lexeme)) {
            // non-null assertion
            return this.values.get(name.lexeme)!;
        }
        // options to return null is less safe, prob stick to warning in compile time
        throw new RuntimeError(name, `Undefined variable ${name.lexeme}!`);
    }
}
