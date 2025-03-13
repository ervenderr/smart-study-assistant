"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  LayoutDashboard,
  FileText,
  BookOpen,
  Clock,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Study Sessions", href: "/study-sessions", icon: Clock },
];

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 max-w-screen-2xl mx-auto">
        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle className="text-xl">
                  Smart Study Assistant
                </SheetTitle>
              </SheetHeader>

              {/* User profile in sidebar */}
              <div className="flex items-center gap-4 px-6 py-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "User avatar"}
                  />
                  <AvatarFallback>
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name || "User"}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {user.email || ""}
                  </span>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto border-t">
                <div className="flex flex-col py-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <button
                    onClick={() =>
                      signOut({
                        callbackUrl: `${window.location.origin}/login`,
                      })
                    }
                    className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign out
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo and Navigation */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold">Smart Study Assistant</span>
          </Link>
          <nav className="hidden md:flex items-center ml-10 space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Menu */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "User avatar"}
                  />
                  <AvatarFallback>
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.name && <p className="font-medium">{user.name}</p>}
                  {user.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onSelect={(event) => {
                  event.preventDefault();
                  signOut({
                    callbackUrl: `${window.location.origin}/login`,
                  });
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
