import { Check, X } from "lucide-react";
import type { PasswordRule } from "@/lib/passwordSchema";

interface PasswordRulesProps {
    rules: PasswordRule[];
    results: Record<string, boolean>;
    hasInput: boolean;
}

const PasswordRules = ({ rules, results, hasInput }: PasswordRulesProps) => {
    return (
        <ul className="space-y-2" role="list" aria-label="Password requirements">
            {rules.map((rule) => {
                const passed = results[rule.id] ?? false;
                const showState = hasInput;

                return (
                    <li
                        key={rule.id}
                        className={`flex items-center gap-2.5 text-sm transition-colors duration-200 ${
                            !showState
                                ? "text-muted-foreground"
                                : passed
                                    ? "text-success"
                                    : "text-destructive"
                        }`}
                    >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                !showState
                    ? "bg-muted"
                    : passed
                        ? "bg-success/20"
                        : "bg-destructive/20"
            }`}>
              {showState ? (
                  passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
              ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
              )}
            </span>
                        {rule.label}
                    </li>
                );
            })}
        </ul>
    );
};

export default PasswordRules;
