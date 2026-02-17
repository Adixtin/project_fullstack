import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Download } from "lucide-react";
import { toast } from "sonner";

const GeneratedPasslist = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("generated_passwords");
        if (saved) {
            try {
                setPasswords(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse passwords", e);
            }
        }
    }, []);

    const copyToClipboard = () => {
        const text = passwords.join("\n");
        navigator.clipboard.writeText(text);
        toast.success("Wordlist copied to clipboard!");
    };

    const downloadAsTxt = () => {
        const text = passwords.join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "passcheck_wordlist.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Download started!");
    };

    return (
        <main className="container mx-auto border-x border-dashed border-border/40 bg-muted/5 min-h-[calc(100-3.5rem)] py-10">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/test")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Generated Passcheck Wordlist</h1>
                        <p className="text-muted-foreground">Detailed view of your predicted password variations.</p>
                    </div>
                </div>

                <Card className="border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl flex items-center gap-3">
                                Total Variations
                                <Badge variant="outline" className="text-lg py-1 px-3">
                                    {passwords.length}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                These patterns are generated based on the personal information you provided.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={passwords.length === 0}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy All
                            </Button>
                            <Button variant="default" size="sm" onClick={downloadAsTxt} disabled={passwords.length === 0}>
                                <Download className="w-4 h-4 mr-2" />
                                Download .txt
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {passwords.length > 0 ? (
                            <ScrollArea className="h-[70vh] w-full rounded-xl border bg-muted/30 p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {passwords.map((pw, i) => (
                                        <div key={i} className="group relative">
                                            <code className="text-sm bg-background border p-3 rounded-lg block truncate font-mono hover:border-primary/50 transition-colors shadow-sm" title={pw}>
                                                {pw}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(pw);
                                                    toast.success("Copied!");
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                                            >
                                                <Copy className="w-3 h-3 text-muted-foreground" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 grayscale opacity-50">
                                <div className="w-20 h-20 mb-6 border-4 border-dashed border-current rounded-full flex items-center justify-center">
                                    <ArrowLeft className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-semibold">No wordlist found</h3>
                                <p className="max-w-xs mt-2 text-sm">
                                    Go back to the PassCheck Profile page and run a leak check to generate your custom wordlist.
                                </p>
                                <Button className="mt-6" onClick={() => navigate("/test")}>
                                    Return to Profile
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-8 p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-500 mb-2">Security Education Note</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        This list demonstrates how easily a custom wordlist can be generated using publicly available or socially engineered information.
                        Professional attackers use similar techniques (like the <code>cewl</code> tool we discussed) to create massive lists
                        targeted specifically at an individual's psychology and personal life. Always use strong, unique passwords that
                        don't rely on personal logic.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default GeneratedPasslist;
