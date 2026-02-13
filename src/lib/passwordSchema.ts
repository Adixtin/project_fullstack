import { z } from "zod";

export interface PasswordConfig {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumber: boolean;
    requireSymbol: boolean;
    requireWords: boolean;
    minWords: number;
    blockBlacklist: boolean;
}

export const defaultPasswordConfig: PasswordConfig = {
    minLength: 14,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSymbol: false,
    requireWords: true,
    minWords: 2,
    blockBlacklist: true,
};

const BLACKLIST = [
    "password", "123456", "qwerty", "letmein", "welcome",
    "monkey", "dragon", "master", "abc123", "admin",
];

export interface PasswordRule {
    id: string;
    label: string;
    test: (val: string) => boolean;
}

export function buildRules(config: PasswordConfig): PasswordRule[] {
    const rules: PasswordRule[] = [];

    rules.push({
        id: "length",
        label: `At least ${config.minLength} characters`,
        test: (v) => v.length >= config.minLength,
    });

    if (config.requireUppercase) {
        rules.push({
            id: "uppercase",
            label: "Contains an uppercase letter",
            test: (v) => /[A-Z]/.test(v),
        });
    }
    if (config.requireLowercase) {
        rules.push({
            id: "lowercase",
            label: "Contains a lowercase letter",
            test: (v) => /[a-z]/.test(v),
        });
    }
    if (config.requireNumber) {
        rules.push({
            id: "number",
            label: "Contains a number",
            test: (v) => /[0-9]/.test(v),
        });
    }
    if (config.requireSymbol) {
        rules.push({
            id: "symbol",
            label: "Contains a symbol (!@#$…)",
            test: (v) => /[^A-Za-z0-9\s]/.test(v),
        });
    }
    if (config.requireWords) {
        rules.push({
            id: "words",
            label: `Contains at least ${config.minWords} words`,
            test: (v) => v.split(/[\s\-]+/).filter((w) => w.length >= 2).length >= config.minWords,
        });
    }
    if (config.blockBlacklist) {
        rules.push({
            id: "blacklist",
            label: "Not a common weak password",
            test: (v) => !BLACKLIST.some((weak) => v.toLowerCase().includes(weak)),
        });
    }

    return rules;
}

export function evaluateRules(
    password: string,
    config: PasswordConfig
): Record<string, boolean> {
    const rules = buildRules(config);
    const results: Record<string, boolean> = {};
    for (const rule of rules) {
        results[rule.id] = rule.test(password);
    }
    return results;
}

export function buildPasswordSchema(config: PasswordConfig) {
    let schema = z.string().min(1, "Password is required").min(config.minLength, `Must be at least ${config.minLength} characters`);

    if (config.requireUppercase) {
        schema = schema.regex(/[A-Z]/, "Must contain an uppercase letter");
    }
    if (config.requireLowercase) {
        schema = schema.regex(/[a-z]/, "Must contain a lowercase letter");
    }
    if (config.requireNumber) {
        schema = schema.regex(/[0-9]/, "Must contain a number");
    }
    if (config.requireSymbol) {
        schema = schema.regex(/[^A-Za-z0-9\s]/, "Must contain a symbol");
    }

    let refined: z.ZodEffects<typeof schema, string, string> | typeof schema = schema;

    if (config.requireWords) {
        refined = (refined as any).refine(
            (val: string) => val.split(/[\s\-]+/).filter((w: string) => w.length >= 2).length >= config.minWords,
            { message: `Must contain at least ${config.minWords} words` }
        );
    }
    if (config.blockBlacklist) {
        refined = (refined as any).refine(
            (val: string) => !BLACKLIST.some((weak) => val.toLowerCase().includes(weak)),
            { message: "Password contains a common weak pattern" }
        );
    }

    return z.object({ password: refined });
}
