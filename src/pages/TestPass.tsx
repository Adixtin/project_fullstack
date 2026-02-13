import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Enter a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

const FormPage = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", message: "" },
        mode: "onChange",
    });

    const onSubmit = (values: FormValues) => {
        toast.success(`Thanks, ${values.name}! Message received.`);
        form.reset();
    };

    return (
        <main className="mx-auto max-w-lg px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold text-foreground">Contact</h1>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Send us a message</CardTitle>
                    <CardDescription>We'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="jane@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="How can we help?" className="min-h-[100px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                                Send
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
};

export default FormPage;
