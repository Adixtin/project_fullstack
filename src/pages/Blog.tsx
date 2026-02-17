import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const posts = [
    {
        title: "How To Use a Password Manager",
        url: "https://www.keepersecurity.com/blog/2023/05/31/how-to-use-a-password-manager/",
        description: "Learn how to use a password manager to keep your accounts secure.",
    },
    {
        title: "How To Create a Password You Can Remember",
        url: "https://www.wikihow.com/Create-a-Password-You-Can-Remember",
        description: "Learn how to create a password you can remember.",
    },
    {
        title: "Why Multi-Factor Authentication (MFA) Is Important",
        url: "https://www.okta.com/identity-101/why-mfa-is-everywhere/",
        description: "Learn why multi-factor authentication (MFA) is important.",
    },
];

const Blog = () => (
    <main className="container mx-auto border-x border-dashed border-border/40 bg-muted/5 min-h-[calc(100-3.5rem)] py-10">
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold text-foreground">Blog</h1>
            <div className="flex flex-col gap-4">
                {posts.map((post) => (
                    <a
                        key={post.url}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                    >
                        <Card className="transition-shadow group-hover:shadow-lg group-hover:shadow-primary/10">
                            <CardHeader>
                                <CardTitle className="text-base group-hover:text-primary transition-colors">
                                    {post.title}
                                </CardTitle>
                                <CardDescription>{post.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    </main>
);

export default Blog;
