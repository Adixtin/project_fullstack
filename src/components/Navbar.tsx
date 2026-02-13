import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
    { label: "Chart", to: "/chart" },
    { label: "Form", to: "/form" },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    return (
        <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <Link to="/" className="text-lg font-semibold text-foreground">
                    PassForge
                </Link>

                {/* Desktop links */}
                <ul className="hidden gap-1 md:flex">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className={cn(
                                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.to
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Hamburger button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile menu */}
            {open && (
                <ul
                    id="mobile-menu"
                    role="menu"
                    className="flex flex-col gap-1 border-t border-border px-4 pb-4 pt-2 md:hidden"
                >
                    {navItems.map((item) => (
                        <li key={item.to} role="none">
                            <Link
                                role="menuitem"
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.to
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
