import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BadgeCheck, LayoutDashboard, LogIn, LogOut, Menu, Package, ShoppingCart, UserCog, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { RouteSList } from "@/Routes";
import { useLogout, useUserState } from "@/recoil/user";


const navItems = [
    { title: 'Dashboard', route: RouteSList.home, icon: <LayoutDashboard /> },
    { title: 'Products', route: RouteSList.products, icon: <Package /> },
    { title: 'Payouts', route: RouteSList.payouts, icon: <Wallet /> },
    { title: 'Orders', route: RouteSList.orders, icon: <ShoppingCart /> },
    { title: 'Users', route: RouteSList.users, icon: <Users /> },
    { title: 'Activation', route: RouteSList.activation, icon: <BadgeCheck /> },
    { title: 'Login', route: RouteSList.login, icon: <LogIn /> },
    { title: 'Register', route: RouteSList.registerNewAdmin, icon: <UserCog /> },
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
                                if (item.title === "Login") {
                                    return null;
                                }
                            } else {
                                if (item.title === "Dashboard" || item.title === "Products" || item.title === "Payouts" || item.title === "Activation" || item.title === "Users" || item.title === "Orders" || item.title === "Register") {
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
                                    navigate("/login")
                                }
                                }
                            >
                                <div className={`flex flex-col items-center text-red-500`}>
                                    <div className="mb-2">{<LogOut size={25} strokeWidth={1.25} />}</div>
                                    <div className="text-center ">{"Logout"}</div>
                                </div>
                            </div>
                        }
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden space-x-2">
                        <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
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
                                    {navItems.map((item) => {
                                        if (user) {
                                            if (item.title === "Login") {
                                                return null;
                                            }
                                        } else {
                                            if (item.title === "Dashboard" || item.title === "Products" || item.title === "Payouts" || item.title === "Activation" || item.title === "Users" || item.title === "Orders" || item.title === "Register") {
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
                                                navigate("/login")
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