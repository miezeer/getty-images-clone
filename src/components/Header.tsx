"use client";

import { useState } from "react";
import { ShoppingCart, User, Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="MIZER"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-green-accent font-medium p-0 h-auto">
                  Home
                </Button>
              </Link>
              <Link href="/editorial">
                <Button variant="ghost" className="text-muted-foreground hover:text-green-accent font-medium p-0 h-auto">
                  Editorial
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" className="text-muted-foreground hover:text-green-accent font-medium p-0 h-auto">
                  Events
                </Button>
              </Link>
              <Link href="/collections">
                <Button variant="ghost" className="text-muted-foreground hover:text-green-accent font-medium p-0 h-auto">
                  Collections
                </Button>
              </Link>
              <Link href="/photographer">
                <Button variant="ghost" className="text-muted-foreground hover:text-green-accent font-medium p-0 h-auto">
                  Sell Your Photos
                </Button>
              </Link>
              <Button variant="ghost" className="text-muted-foreground hover:text-green-accent font-medium p-0 h-auto">
                Enterprise
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-green-accent font-medium p-0 h-auto">
                Pricing
              </Button>
            </nav>
          </div>

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link href="/downloads">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-green-accent">
                <Download className="h-4 w-4" />
                <span className="hidden lg:inline">Downloads</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-green-accent">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden lg:inline">Cart</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-border text-foreground hover:bg-green-accent/10 hover:text-green-accent hover:border-green-accent">
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Sign in</span>
            </Button>
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-green-accent hover:text-green-accent/80"
              >
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-card border-b border-border shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              <Link href="/" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-green-accent font-medium">
                  Home
                </Button>
              </Link>
              <Link href="/editorial" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-green-accent font-medium">
                  Editorial
                </Button>
              </Link>
              <Link href="/events" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-green-accent font-medium">
                  Events
                </Button>
              </Link>
              <Link href="/collections" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-green-accent font-medium">
                  Collections
                </Button>
              </Link>
              <Link href="/photographer" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-green-accent font-medium">
                  Sell Your Photos
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-green-accent font-medium">
                Enterprise
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-green-accent font-medium">
                Pricing
              </Button>

              <div className="border-t border-border pt-4 mt-4 space-y-2">
                <Link href="/downloads" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-green-accent">
                    <Download className="h-4 w-4" />
                    Downloads
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-green-accent">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 border-border text-foreground hover:bg-green-accent/10 hover:text-green-accent hover:border-green-accent">
                  <User className="h-4 w-4" />
                  Sign in
                </Button>
                <Link href="/admin" onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-green-accent hover:text-green-accent/80"
                  >
                    Admin
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
