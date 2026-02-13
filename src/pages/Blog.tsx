import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const posts = [
    {
        title: "Why Passphrases Beat Passwords",
        url: "https://example.com/passphrases",
        description: "Learn how multi-word passwords improve security without sacrificing memorability.",
    },
    {
        title: "Top 10 Password Managers in 2026",
        url: "https://example.com/managers",
        description: "A curated comparison of the most trusted password managers available today.",
    },
    {
        title: "Two-Factor Auth: A Practical Guide",
        url: "https://example.com/2fa",
        description: "Step-by-step instructions for enabling 2FA on your most important accounts.",
    },
];

const Blog = () => (
    <main className="mx-auto max-w-2xl px-4 py-10">
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
    </main>
);

export default Blog;
