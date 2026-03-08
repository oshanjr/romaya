"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials, cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, User as UserIcon, Settings, ShoppingBag } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";

interface UserNavProps {
    user: User & { role?: string };
}

export function UserNav({ user }: UserNavProps) {
    const isAdmin = user.role === "ADMIN";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "relative h-8 w-8 rounded-full p-0 flex items-center justify-center")}>
                <Avatar className="h-9 w-9 border-2 border-transparent hover:border-romaya-red transition-all">
                    <AvatarImage src={user.image ?? ""} alt={user.name ?? "User avatar"} />
                    <AvatarFallback className="bg-romaya-red-pale text-romaya-red font-semibold">
                        {getInitials(user.name ?? user.email ?? "U")}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {isAdmin && (
                        <Link href="/admin">
                            <DropdownMenuItem className="cursor-pointer font-medium text-romaya-red">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Admin Panel</span>
                            </DropdownMenuItem>
                        </Link>
                    )}
                    <Link href="/account">
                        <DropdownMenuItem className="cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/account?tab=orders">
                        <DropdownMenuItem className="cursor-pointer">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>Orders</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/account?tab=settings">
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
