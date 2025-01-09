import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import { ArrowRightLeft, BadgeCheck, LayoutDashboard, LogIn, LogOut, Menu, Package, ShoppingCart, UserCog, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useLogout, useUserState } from "@/recoil/user";
import { AvatarImage } from "@radix-ui/react-avatar";
import { RouteSList } from "@/Routes";


const navItems = [
    { title: 'Dashboard', route: RouteSList.home, icon: <LayoutDashboard /> },
    { title: 'Products', route: RouteSList.products, icon: <Package /> },
    { title: 'Payouts', route: RouteSList.payouts, icon: <Wallet /> },
    { title: 'Orders', route: RouteSList.orders, icon: <ShoppingCart /> },
    { title: 'Users', route: RouteSList.users, icon: <Users /> },
    { title: 'Activation', route: RouteSList.activation, icon: <BadgeCheck /> },
    { title: 'Login', route: RouteSList.login, icon: <LogIn /> },
    { title: 'Register', route: RouteSList.registerNewAdmin, icon: <UserCog /> },
    {title: 'Fund Management', route: RouteSList.fundManagement, icon: <ArrowRightLeft className="h-5 w-5" />},

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
    
    const filteredNavItems = navItems.filter(item => {
        if (user) {
            return item.title !== 'Login';
        }
        return item.title === 'Login';
    });

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="/logoJDLifestyle.jpeg" alt="JD Lifestyle" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">JD Lifestyle</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <div className="flex items-center">
                            {filteredNavItems.map((item) => (
                                <Link
                                    key={item.title}
                                    to={item.route}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative group`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className={`mb-1 ${location.pathname === item.route ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                                            {item.icon}
                                        </div>
                                        <div className={`text-xs ${location.pathname === item.route ? 'text-primary font-semibold' : 'text-muted-foreground group-hover:text-primary'}`}>
                                            {item.title}
                                        </div>
                                    </div>
                                    {location.pathname === item.route && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                    )}
                                </Link>
                            ))}
                            {user && (
                                <Button
                                    variant="ghost"
                                    className="px-3 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                                    onClick={() => {
                                        logout();
                                        navigate("/");
                                    }}
                                >
                                    <div className="flex flex-col items-center">
                                        <LogOut className="h-5 w-5 mb-1" />
                                        <span className="text-xs">Logout</span>
                                    </div>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center space-x-2">
                        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col space-y-4 mt-4">
                                    {filteredNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            to={item.route}
                                            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors
                                                ${location.pathname === item.route 
                                                    ? 'bg-primary/10 text-primary font-medium' 
                                                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    ))}
                                    {user && (
                                        <Button
                                            variant="ghost"
                                            className="justify-start px-3 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                                            onClick={() => {
                                                logout();
                                                setMenuOpen(false);
                                                navigate("/");
                                            }}
                                        >
                                            <LogOut className="h-5 w-5 mr-3" />
                                            <span>Logout</span>
                                        </Button>
                                    )}
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

