import { Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { PasswordConfig } from "@/lib/passwordSchema";

interface PasswordConfigFormProps {
    config: PasswordConfig;
    onChange: (config: PasswordConfig) => void;
}

interface RuleToggleProps {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    children?: React.ReactNode;
}

const RuleToggle = ({ id, label, description, checked, onCheckedChange, children }: RuleToggleProps) => (
    <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
            <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
                {label}
            </Label>
            <p className="text-xs text-muted-foreground">{description}</p>
            {checked && children && <div className="mt-2">{children}</div>}
        </div>
        <Switch
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-label={label}
        />
    </div>
);

const PasswordConfigForm = ({ config, onChange }: PasswordConfigFormProps) => {
    const update = <K extends keyof PasswordConfig>(key: K, value: PasswordConfig[K]) => {
        onChange({ ...config, [key]: value });
    };

    return (
        <Card className="w-full border-border/50">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Settings2 className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Password Rules</h2>
                        <p className="text-xs text-muted-foreground">Configure validation requirements</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Min Length */}
                <div className="space-y-2">
                    <Label htmlFor="minLength" className="text-sm font-medium">
                        Minimum Length
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        The minimum number of characters required
                    </p>
                    <Input
                        id="minLength"
                        type="number"
                        min={4}
                        max={128}
                        value={config.minLength}
                        onChange={(e) => update("minLength", Math.max(4, Math.min(128, Number(e.target.value) || 4)))}
                        className="w-24 font-mono"
                        aria-label="Minimum password length"
                    />
                </div>

                <Separator />

                {/* Character variety */}
                <div className="space-y-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Character Requirements
                    </p>

                    <RuleToggle
                        id="requireUppercase"
                        label="Uppercase Letters"
                        description="Require at least one A-Z character"
                        checked={config.requireUppercase}
                        onCheckedChange={(v) => update("requireUppercase", v)}
                    />

                    <RuleToggle
                        id="requireLowercase"
                        label="Lowercase Letters"
                        description="Require at least one a-z character"
                        checked={config.requireLowercase}
                        onCheckedChange={(v) => update("requireLowercase", v)}
                    />

                    <RuleToggle
                        id="requireNumber"
                        label="Numbers"
                        description="Require at least one digit 0-9"
                        checked={config.requireNumber}
                        onCheckedChange={(v) => update("requireNumber", v)}
                    />

                    <RuleToggle
                        id="requireSymbol"
                        label="Symbols"
                        description="Require at least one special character (!@#$…)"
                        checked={config.requireSymbol}
                        onCheckedChange={(v) => update("requireSymbol", v)}
                    />
                </div>

                <Separator />

                {/* Word / Passphrase */}
                <div className="space-y-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Advanced Policies
                    </p>

                    <RuleToggle
                        id="requireWords"
                        label="Passphrase Words"
                        description="Require multiple words separated by space or dash"
                        checked={config.requireWords}
                        onCheckedChange={(v) => update("requireWords", v)}
                    >
                        <div className="flex items-center gap-2">
                            <Label htmlFor="minWords" className="text-xs text-muted-foreground whitespace-nowrap">
                                Min words
                            </Label>
                            <Input
                                id="minWords"
                                type="number"
                                min={2}
                                max={10}
                                value={config.minWords}
                                onChange={(e) => update("minWords", Math.max(2, Math.min(10, Number(e.target.value) || 2)))}
                                className="w-16 h-8 text-sm font-mono"
                                aria-label="Minimum number of words"
                            />
                        </div>
                    </RuleToggle>

                    <RuleToggle
                        id="blockBlacklist"
                        label="Block Common Passwords"
                        description="Reject passwords containing well-known weak patterns"
                        checked={config.blockBlacklist}
                        onCheckedChange={(v) => update("blockBlacklist", v)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default PasswordConfigForm;