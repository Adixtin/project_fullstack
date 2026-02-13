import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Weak", count: 42 },
    { name: "Fair", count: 28 },
    { name: "Good", count: 18 },
    { name: "Strong", count: 12 },
];

const ChartPage = () => (
    <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Password Strength Distribution</h1>
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Strength Breakdown</CardTitle>
                <CardDescription>Sample distribution of password strength scores.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: 8,
                                    color: "hsl(var(--foreground))",
                                }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    </main>
);

export default ChartPage;
