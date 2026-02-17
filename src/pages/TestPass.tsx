import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Maximize2, Info, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { generateVariations } from "@/lib/passwordUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import ReCAPTCHA from "react-google-recaptcha";

const schema = z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    nicknames: z.string().optional(),
    partnerName: z.string().optional(),
    kidsNames: z.string().optional(),
    petsNames: z.string().optional(),
    birthYear: z.string().optional().refine(val => !val || /^\d{4}$/.test(val), {
        message: "Year must be 4 digits (e.g. 1990)"
    }),
    fullBirthdate: z.string().optional(),
    partnerBirthday: z.string().optional(),
    anniversary: z.string().optional(),
    graduationYear: z.string().optional().refine(val => !val || /^\d{4}$/.test(val), {
        message: "Year must be 4 digits"
    }),
    city: z.string().optional(),
    neighborhood: z.string().optional(),
    hometown: z.string().optional(),
    streetName: z.string().optional(),
    zipCode: z.string().optional().refine(val => !val || /^\d{2}-\d{3}$/.test(val), {
        message: "Polish ZIP format: XX-XXX (e.g. 01-234)"
    }),
    companyName: z.string().optional(),
    formerEmployer: z.string().optional(),
    schoolName: z.string().optional(),
    university: z.string().optional(),
    teamName: z.string().optional(),
    jobTitle: z.string().optional(),
    hobbies: z.string().optional(),
    favoriteSportsTeam: z.string().optional(),
    favoriteBand: z.string().optional(),
    favoriteGame: z.string().optional(),
    favoriteCar: z.string().optional(),
    favoriteTvShow: z.string().optional(),
    socialUsernames: z.string().optional(),
    gamertags: z.string().optional(),
    forumUsernames: z.string().optional(),
    emailPrefixes: z.string().optional(),
}).refine(data => {
    // If both are provided, check if the birthYear is present in the fullBirthdate string
    if (data.birthYear && data.fullBirthdate && data.fullBirthdate.length >= 4) {
        return data.fullBirthdate.includes(data.birthYear);
    }
    return true;
}, {
    message: "Birth year does not match the year in your full birthdate",
    path: ["fullBirthdate"]
});

type FormValues = z.infer<typeof schema>;

const generatePasswordList = (values: FormValues) => {
    const baseWords = Object.values(values)
        .filter((v): v is string => typeof v === "string" && v.length > 0)
        .flatMap(v => v.split(/[\s,._-]+/))
        .filter(v => v.length >= 3);

    const passwords = new Set<string>();

    baseWords.forEach(word => {
        // Use the overload with options
        const variations = generateVariations(word, { leet: true });
        variations.forEach(v => passwords.add(v));

        // Append numbers/symbols to basic variations
        const basicVariations = generateVariations(word);
        const suffixes = ["123", "1", "!", "2024", "2025", "2026", "24", "25", "26"];
        basicVariations.forEach(v => {
            suffixes.forEach(s => {
                passwords.add(v + s);
            });
        });

        // Add extra leet with symbol
        const leetVariation = word.toLowerCase()
            .replace(/a/g, "4")
            .replace(/e/g, "3")
            .replace(/i/g, "1")
            .replace(/o/g, "0")
            .replace(/s/g, "5")
            .replace(/t/g, "7");
        passwords.add(leetVariation + "!");
    });

    // Simple combinations
    if (baseWords.length >= 2) {
        for (let i = 0; i < Math.min(baseWords.length, 5); i++) {
            for (let j = 0; j < Math.min(baseWords.length, 5); j++) {
                if (i !== j) {
                    passwords.add(baseWords[i] + baseWords[j]);
                    passwords.add(baseWords[i].toLowerCase() + baseWords[j].toLowerCase());
                }
            }
        }
    }

    return Array.from(passwords).sort();
};

const FormPage = () => {
    const navigate = useNavigate();
    const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "", middleName: "", lastName: "", nicknames: "", partnerName: "", kidsNames: "", petsNames: "",
            birthYear: "", fullBirthdate: "", partnerBirthday: "", anniversary: "", graduationYear: "",
            city: "", neighborhood: "", hometown: "", streetName: "", zipCode: "",
            companyName: "", formerEmployer: "", schoolName: "", university: "", teamName: "", jobTitle: "",
            hobbies: "", favoriteSportsTeam: "", favoriteBand: "", favoriteGame: "", favoriteCar: "", favoriteTvShow: "",
            socialUsernames: "", gamertags: "", forumUsernames: "", emailPrefixes: ""
        },
        mode: "onChange",
    });

    const steps = [
        { title: "Identity", description: "Basic personal identifiers.", fields: ["firstName", "middleName", "lastName", "nicknames"] as const },
        { title: "Family", description: "Names of people and pets close to you.", fields: ["partnerName", "kidsNames", "petsNames"] as const },
        { title: "Dates", description: "Important years and specific dates.", fields: ["birthYear", "fullBirthdate", "partnerBirthday", "anniversary", "graduationYear"] as const },
        { title: "Address", description: "Places associated with your life.", fields: ["city", "neighborhood", "hometown", "streetName", "zipCode"] as const },
        { title: "Career", description: "Employment and education history.", fields: ["companyName", "formerEmployer", "schoolName", "university", "jobTitle", "teamName"] as const },
        { title: "Interests", description: "Personal preferences and favorites.", fields: ["hobbies", "favoriteSportsTeam", "favoriteBand", "favoriteGame", "favoriteCar", "favoriteTvShow"] as const },
        { title: "Digital", description: "Usernames and online handles.", fields: ["socialUsernames", "gamertags", "forumUsernames", "emailPrefixes"] as const }
    ];

    const progress = ((currentStep + 1) / steps.length) * 100;

    const onSubmit = (values: FormValues) => {
        const list = generatePasswordList(values);
        setGeneratedPasswords(list);
        localStorage.setItem("generated_passwords", JSON.stringify(list));
        toast.success(`Generated ${list.length} potential password variations.`);
    };

    const renderField = (name: keyof FormValues, label: string, placeholder: string, tooltip: string, type: "input" | "textarea" = "input") => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className="flex items-center gap-2">
                        <FormLabel>{label}</FormLabel>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-default" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black text-white border-green-500/50 border-2">
                                    <p>{tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <FormControl>
                        {type === "input" ? (
                            <Input placeholder={placeholder} {...field} />
                        ) : (
                            <Textarea placeholder={placeholder} {...field} />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <main className="container mx-auto border-x border-dashed border-border/40 bg-muted/5 min-h-[calc(100-3.5rem)] py-10">
            <div className="mx-auto max-w-full lg:max-w-[1600px]">
                <h1 className="mb-6 text-2xl font-bold text-foreground">PassCheck Pro Profile</h1>
                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr_300px] gap-8 items-start">
                    {/* Left Column: Results */}
                    <div className="space-y-4 lg:sticky lg:top-10 order-2 lg:order-1">
                        <Card className="border-primary/50 bg-primary/5 min-h-[400px] flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center justify-between">
                                    Predicted Wordlist
                                    {generatedPasswords.length > 0 && (
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">{generatedPasswords.length}</Badge>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                title="View Full List"
                                                onClick={() => navigate("/generated-passlist")}
                                            >
                                                <Maximize2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {generatedPasswords.length > 0
                                        ? "Derived patterns based on your info."
                                        : "Fill in the form and run the check to see predicted patterns."
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                {generatedPasswords.length > 0 ? (
                                    <ScrollArea className="h-[600px] w-full rounded-md border bg-background p-4">
                                        <div className="flex flex-col gap-2">
                                            {generatedPasswords.map((pw, i) => (
                                                <code key={i} className="text-xs bg-muted p-2 rounded block break-all hover:bg-muted/80 transition-colors" title={pw}>
                                                    {pw}
                                                </code>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                                        <div className="w-12 h-12 mb-4 border-2 border-dashed border-current rounded-full" />
                                        <p className="text-sm font-medium">No results yet</p>
                                        <p className="text-xs mt-1">Complete the form and click "Run Leak Check"</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Center Column: Form */}
                    <div className="order-1 lg:order-2 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <span>Step {currentStep + 1} of {steps.length}</span>
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{steps[currentStep].title}</span>
                            </div>
                            <Progress value={progress} className="h-2 transition-all duration-500" />
                        </div>

                        <Form {...form}>
                            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-8">
                                <Card className="@container relative overflow-hidden group shadow-lg border-primary/20">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors">
                                                    <ShieldCheck className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 bg-black text-white border-green-500/50 border-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                                <div className="grid gap-2">
                                                    <h4 className="font-semibold leading-none flex items-center gap-2 text-green-400">
                                                        <ShieldCheck className="h-4 w-4" />
                                                        Nota o prywatności
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        Twoje dane nigdy nie opuszczają Twojego urządzenia. Wszystkie identyfikatory są przetwarzane lokalnie w przeglądarce w celu generowania wzorców.
                                                    </p>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-bold">{steps[currentStep].title}</CardTitle>
                                        <CardDescription className="text-muted-foreground/80">{steps[currentStep].description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 @md:grid-cols-2 gap-6 min-h-[320px]">
                                        {currentStep === 0 && (
                                            <>
                                                {renderField("firstName", "First Name", "Jane", "First names are the most common component of simple passwords (e.g., Jane123).")}
                                                {renderField("middleName", "Middle Name", "Alexander", "Middle names add a layer of complexity but are still easily guessable.")}
                                                {renderField("lastName", "Last Name", "Doe", "Surnames are frequently used in family-based password patterns.")}
                                                {renderField("nicknames", "Nicknames", "Janey, J-Doe", "Informal names are often used to bypass basic complexity rules.")}
                                            </>
                                        )}
                                        {currentStep === 1 && (
                                            <>
                                                {renderField("partnerName", "Partner's Name", "John", "Partner names are very likely to be used in anniversary or shared accounts.")}
                                                {renderField("kidsNames", "Kids' Names", "Timmy", "Children's names are among the most frequent bases for weak passwords.")}
                                                {renderField("petsNames", "Pets' Names", "Fluffy", "The classic 'DogName123' is a major security risk.")}
                                            </>
                                        )}
                                        {currentStep === 2 && (
                                            <>
                                                {renderField("birthYear", "Birth Year", "1990", "Specific birth year suffixes")}
                                                {renderField("fullBirthdate", "Full Birthdate", "MM/DD/YYYY", "Essential for birthday variations")}
                                                {renderField("partnerBirthday", "Partner's Birthday", "MM/DD/YYYY", "Commonly used in shared patterns")}
                                                {renderField("anniversary", "Anniversary", "MM/DD/YYYY", "Year-based variations")}
                                                {renderField("graduationYear", "Graduation Year", "2012", "Key educational identifier")}
                                            </>
                                        )}
                                        {currentStep === 3 && (
                                            <>
                                                {renderField("city", "Current City", "New York", "Location names are common segments in leaked password databases.")}
                                                {renderField("neighborhood", "Neighborhood", "Brooklyn", "Specific areas add local flavor but reduce password entropy.")}
                                                {renderField("hometown", "Hometown", "Chicago", "Hometowns are frequently used in both passwords and security questions.")}
                                                {renderField("streetName", "Street Name", "Maple Ave", "Street names where you live are easily discoverable via social engineering.")}
                                                {renderField("zipCode", "ZIP Code", "10001", "Numerical ZIP codes are often appended to words to satisfy complexity rules.")}
                                            </>
                                        )}
                                        {currentStep === 4 && (
                                            <>
                                                {renderField("companyName", "Company Name", "TechCorp", "Workplace names are common targets for brute-force attacks on corporate credentials.")}
                                                {renderField("formerEmployer", "Former Employer", "OldBank", "Former work data can be used to piece together historical password patterns.")}
                                                {renderField("schoolName", "School Name", "Central High", "High school names are a classic security question answer and common password base.")}
                                                {renderField("university", "University", "State Uni", "Alumni data is often public and easily exploited by automated wordlist generators.")}
                                                {renderField("jobTitle", "Job Title", "Dev", "Roles or industry terms are frequently used as suffixes to meet complexity requirements.")}
                                                {renderField("teamName", "Team/Project", "Alpha", "Internal project names are less obvious but highly predictable within a work context.")}
                                            </>
                                        )}
                                        {currentStep === 5 && (
                                            <>
                                                {renderField("hobbies", "Hobbies", "Hiking, Chess", "Hobbies are often used as memorable seeds for password variations.")}
                                                {renderField("favoriteSportsTeam", "Sports Team", "Lakers", "Sports teams are among the most statistically common password elements.")}
                                                {renderField("favoriteBand", "Favorite Band", "The Beatles", "Musical preferences are highly predictable based on demographic data.")}
                                                {renderField("favoriteGame", "Favorite Game", "Minecraft", "Extremely common in gaming-related leaks and credential stuffing.")}
                                                {renderField("favoriteCar", "Favorite Car", "Tesla", "Brand loyalty manifests in many weak, brand-focused passwords.")}
                                                {renderField("favoriteTvShow", "TV Show", "Friends", "Pop culture references are easy for attackers to guess and automate.")}
                                            </>
                                        )}
                                        {currentStep === 6 && (
                                            <>
                                                {renderField("socialUsernames", "Social Handle", "@jane_doe", "Your public handles are the first thing an attacker will test for.")}
                                                {renderField("gamertags", "Gamertags", "SniperQueen", "Gaming IDs are often reused across multiple insecure platforms.")}
                                                {renderField("forumUsernames", "Old Forum Usernames", "vintagelover", "Historical handles from old leaks are goldmines for credential stuffing.")}
                                                {renderField("emailPrefixes", "Email Prefix", "jane.doe", "Everything before the @ symbol is a prime candidate for password segments.")}
                                                <div className="flex justify-center pt-4 col-span-full">
                                                    {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                                                        <ReCAPTCHA
                                                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                                            onChange={(token) => setCaptchaToken(token)}
                                                            theme="dark"
                                                        />
                                                    ) : (
                                                        <div className="text-destructive text-sm font-medium p-4 border border-destructive/20 rounded-md bg-destructive/10">
                                                            reCAPTCHA configuration missing. Please check your environment variables.
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                    <div className="p-6 pt-4 flex border-t bg-muted/20 items-center justify-between gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                                            disabled={currentStep === 0}
                                            className="w-32"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                                        </Button>

                                        {currentStep < steps.length - 1 ? (
                                            <Button
                                                type="button"
                                                onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                                                className="w-32"
                                            >
                                                Next <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        className="bg-primary hover:bg-primary/90 shadow-md"
                                                        disabled={!captchaToken}
                                                    >
                                                        Run Leak Check
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Analysis</DialogTitle>
                                                        <DialogDescription>
                                                            We've processed {Object.values(form.getValues()).filter(v => v).length} pieces of info across 7 steps.
                                                            This will generate {generatePasswordList(form.getValues()).length} variations. Are you ready?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="gap-2 sm:gap-0">
                                                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Edit Fields</Button>
                                                        <Button onClick={() => {
                                                            setIsDialogOpen(false);
                                                            form.handleSubmit(onSubmit)();
                                                        }}>Generate Wordlist</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </Card>
                            </form>
                        </Form>
                    </div>

                    {/* Right Column: Resources */}
                    <div className="space-y-4 lg:sticky lg:top-10 order-3">
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Security Resources</h2>
                            <div className="space-y-3">
                                <Button asChild className="w-full">
                                    <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer">
                                        Have I Been Pwned?
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <a href="https://haveibeenpwned.com/Passwords" target="_blank" rel="noopener noreferrer">
                                        Pwned Passwords
                                    </a>
                                </Button>
                                <div className="pt-4 text-xs text-muted-foreground">
                                    <p>This tool helps you identify if pieces of your personal information are currently used in common password patterns.</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default FormPage;
