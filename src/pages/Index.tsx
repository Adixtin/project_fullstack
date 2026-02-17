import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { ShieldCheck, KeyRound, BookOpen } from "lucide-react";

const data = [
    { name: "2025", count: 86 },
    { name: "2024", count: 76 },
    { name: "2023", count: 49 },
    { name: "2022", count: 40 },
    { name: "2021", count: 61 },
];

const Index = () => (
    <main className="container mx-auto border-x border-dashed border-border/40 bg-muted/5 min-h-[calc(100-3.5rem)] py-10">
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold text-foreground">Password Strength Distribution</h1>

            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent braeches cause</CardTitle>
                        <CardDescription>Percentage of data breaches caused by weak password over the years</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                                    <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--card)",
                                            border: "1px solid var(--border)",
                                            borderRadius: 8,
                                            color: "var(--foreground)",
                                        }}
                                    />
                                    <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Link to="/test" className="block group">
                    <Card className="hover:border-primary transition-all duration-300 hover:shadow-md cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-base">test the credability of your own password</CardTitle>
                                <CardDescription>Check how secure your current credentials really are</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>

                <Link to="/password" className="block group">
                    <Card className="hover:border-primary transition-all duration-300 hover:shadow-md cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <KeyRound className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Create your own easy to remember strong password</CardTitle>
                                <CardDescription>Generate a secure and memorable password instantly</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>

                <Link to="/blog" className="block group">
                    <Card className="hover:border-primary transition-all duration-300 hover:shadow-md cursor-pointer">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Learn about why strong passwords are importan</CardTitle>
                                <CardDescription>Read insights on digital security and best practices</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    </main>
);

export default Index;
