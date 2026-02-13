import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";
import {
    buildPasswordSchema,
    buildRules,
    evaluateRules,
    type PasswordConfig,
} from "@/lib/passwordSchema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PasswordRules from "@/components/PasswordRules";

interface PasswordFormProps {
    config: PasswordConfig;
}

const PasswordForm = ({ config }: PasswordFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const schema = useMemo(() => buildPasswordSchema(config), [config]);
    const rules = useMemo(() => buildRules(config), [config]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<{ password: string }>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { password: "" },
    });

    const passwordValue = watch("password");
    const ruleResults = evaluateRules(passwordValue || "", config);

    const onSubmit = () => setSubmitted(true);

    return (
        <Card className="w-full border-border/50 shadow-2xl shadow-primary/5">
        <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Password Creator
    </h1>
    </div>
    <p className="text-sm leading-relaxed text-muted-foreground">
        Create a strong, memorable password using passphrases.
    Try something like{" "}
    <span className="font-mono text-accent-foreground">
        BlueTiger-92Sun
    </span>
    </p>
    </CardHeader>

    <CardContent className="space-y-6">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    <div className="space-y-2">
    <Label htmlFor="password">Your Password</Label>
    <div className="relative">
    <Input
        id="password"
    type={showPassword ? "text" : "password"}
    placeholder="e.g. BlueTiger-92Sun"
    className="pr-10 font-mono"
    aria-invalid={!!errors.password}
    aria-describedby="password-rules"
    autoComplete="new-password"
    {...register("password")}
    />
    <button
    type="button"
    onClick={() => setShowPassword((v) => !v)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
    aria-label={showPassword ? "Hide password" : "Show password"}
        >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        </div>
        </div>

        <div id="password-rules">
    <PasswordRules rules={rules} results={ruleResults} hasInput={!!passwordValue} />
    </div>

    <Button type="submit" className="w-full" disabled={!isValid}>
    <ShieldCheck className="mr-2 h-4 w-4" />
        Confirm Password
    </Button>
    </form>

    {submitted && isValid && (
        <Alert className="border-success/30 bg-success/10">
        <ShieldCheck className="h-4 w-4 text-success" />
        <AlertDescription className="text-success">
            Strong and memorable password ✅
            </AlertDescription>
            </Alert>
    )}
    </CardContent>
    </Card>
);
};

export default PasswordForm;
