import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { BadgeCheck, LayoutDashboard, LogIn, LogOut, Menu, ShoppingCart, UserCog, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { RouteSList } from "../Routes";
import { useLogout, useUserState } from "@/recoil/user";

interface AvatarProps {
    name: string;
    membershipStatus: boolean;
}

function AvatarDemo({ name, membershipStatus }: AvatarProps) {
    const FirstAndLastLetter = name.split(" ").map((n) => n[0]).join("");
    return (
        <div className="flex items-center">
            <Avatar>
                <AvatarFallback>{FirstAndLastLetter || "UR"}</AvatarFallback>
            </Avatar>
            <div className="ml-5">
                <div className="font-medium">{name}</div>
                <div className={`font-light ${membershipStatus ? "text-green-600" : "text-red-600"}  md:hidden`}>{membershipStatus ? "Active" : "InActive"}</div>
            </div>
        </div>
    );
}

const navItems = [
    { title: 'Dashboard', route: RouteSList.dashboard, icon: <LayoutDashboard /> },
    { title: 'My Team', route: RouteSList.myTeam, icon: <Users /> },
    { title: 'Products', route: RouteSList.products, icon: <ShoppingCart /> },
    { title: 'Payouts', route: RouteSList.payouts, icon: <Wallet /> },
    { title: 'Activation', route: RouteSList.activation, icon: <BadgeCheck /> },
    { title: 'Login', route: RouteSList.login, icon: <LogIn /> },
    { title: 'Register', route: RouteSList.register, icon: <UserCog /> },
];

const Navbar = () => {
    const location = useLocation();
    const logout = useLogout();
    const navigate = useNavigate();
    const [user,] = useUserState();
    const [isMenuOpen, setMenuOpen] = useState(false);

    // Close the menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);



    return (
        <nav className="border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold">
                            Logo
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => {
                            if (user) {
                                if (item.title === "Login" || item.title === "Register") {
                                    return null;
                                }
                            }
                            else {
                                if (item.title === "Dashboard" || item.title === "My Team" ||  item.title === "Payouts" || item.title === "Activation") { //item.title === "Products" ||
                                    return null;
                                }
                            }
                            return (
                                <Link
                                    key={item.title}
                                    to={item.route}
                                    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200
                                    ${location.pathname === item.route ? 'text-blue-500 font-semibold' : ' hover:text-blue-400'}`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="mb-2">{item.icon}</div>
                                        <div className="text-center">{item.title}</div>
                                    </div>
                                </Link>
                            )
                        })}
                        {user &&
                                    <div
                                    className={`px-3 py-2 rounded-md text-sm font-normal cursor-pointer transition-colors duration-200`}
                                    onClick={() => {
                                            logout()
                                            setMenuOpen(false);
                                            navigate("/")
                                        }
                                    }
                                    >
                                        <div className={`flex flex-col items-center text-red-500`}>
                                            <div className="mb-2">{<LogOut size={25} strokeWidth={1.25} />}</div>
                                            <div className="text-center ">{"Logout"}</div>
                                        </div>
                                    </div>
                                    }
                        <ModeToggle />
                        {user && <AvatarDemo name={user.name} membershipStatus={user.membershipStatus} />}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden space-x-2">
                        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
                            <ModeToggle />
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMenuOpen(!isMenuOpen)}
                                >
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Company name</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col space-y-4 mt-4">
                                    {user && <AvatarDemo name={user.name} membershipStatus={user.membershipStatus} />}
                                    {navItems.map((item) => {
                                        if (user) {
                                            if (item.title === "Login" || item.title === "Register") {
                                                return null;
                                            }
                                        } else {
                                            if (item.title === "Dashboard" || item.title === "My Team"  || item.title === "Payouts" || item.title === "Activation") { //|| item.title === "Products"
                                                return null;
                                            }
                                        }
                                        return (
                                            <Link
                                                key={item.title}
                                                to={item.route}
                                                className={`px-3 py-2 rounded-md text-sm font-normal cursor-pointer transition-colors duration-200
                                            ${location.pathname === item.route ? 'text-blue-500 font-semibold' : 'hover:text-blue-400'}`}
                                            >
                                                <div className={`flex items-center space-x-4`}>
                                                    <div className="mb-1 mt-1">{item.icon}</div>
                                                    <div className="text-center text-lg">{item.title}</div>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                    {user &&
                                        <div
                                            className={`px-3 py-2 rounded-md text-sm font-normal cursor-pointer transition-colors duration-200`}
                                            onClick={() => {
                                                logout()
                                                setMenuOpen(false);
                                                navigate("/")
                                            }
                                            }
                                        >
                                            <div className={`flex items-center space-x-4 text-red-500`}>
                                                <div className="mb-1 mt-1">{<LogOut size={25} strokeWidth={1.25} />}</div>
                                                <div className="text-center text-lg">{"Logout"}</div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;