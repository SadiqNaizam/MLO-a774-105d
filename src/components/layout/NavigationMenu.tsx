import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, Menu, X, Utensils, LogIn, UserPlus } from 'lucide-react';

interface NavigationMenuProps {
  cartItemCount?: number;
  isLoggedIn?: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ cartItemCount = 0, isLoggedIn = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log("Rendering NavigationMenu, cart items:", cartItemCount, "isLoggedIn:", isLoggedIn);

  const navLinks = [
    { href: "/", label: "Discover" },
    { href: "/orders", label: "My Orders" }, // Example link
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-orange-600">
              <Utensils className="h-7 w-7" />
              <span>FoodFleet</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-gray-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons and Auth */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            {isLoggedIn ? (
                 <Link to="/profile"> {/* Assuming /profile route exists or will be created */}
                    <Button variant="ghost" size="icon" aria-label="User Profile">
                        <User className="h-6 w-6" />
                    </Button>
                 </Link>
            ) : (
                <div className="flex items-center space-x-2">
                    <Link to="/login">
                        <Button variant="outline" size="sm">
                            <LogIn className="mr-2 h-4 w-4" /> Login
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                           <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                        </Button>
                    </Link>
                </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
             <Link to="/cart" className="mr-2">
              <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}\
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-5 space-y-3">
                 {isLoggedIn ? (
                     <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block">
                        <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-5 w-5" /> User Profile
                        </Button>
                     </Link>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                            <Button variant="outline" className="w-full">
                                <LogIn className="mr-2 h-4 w-4" /> Login
                            </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block">
                            <Button variant="default" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                            </Button>
                        </Link>
                    </>
                )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default NavigationMenu;