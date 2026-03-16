import { Link, useLocation } from "@tanstack/react-router";
import { ClipboardList, Menu, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/help", label: "Help Centre" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top announcement bar */}
      <div className="bg-foreground text-primary-foreground text-xs text-center py-2 tracking-widest uppercase font-body">
        Free Delivery on Orders Over Rs. 5,999 &nbsp;&bull;&nbsp; Pakistan Wide
        Shipping
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex flex-col leading-none"
              data-ocid="nav.link"
            >
              <span className="font-display text-xl font-700 tracking-tight text-foreground">
                GHAZA
              </span>
              <span className="font-display text-xs italic text-muted-foreground tracking-widest">
                Fashion
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-body text-sm tracking-wide transition-colors ${
                    isActive(link.to)
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/help"
                className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="nav.link"
              >
                Contact
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* My Orders */}
              <Link
                to="/my-orders"
                className={`relative p-2 transition-colors ${
                  isActive("/my-orders")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="My Orders"
                data-ocid="nav.link"
              >
                <ClipboardList size={20} />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-foreground hover:text-accent transition-colors"
                data-ocid="nav.link"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-foreground text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="md:hidden p-2 text-foreground"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden md:hidden border-t border-border bg-background"
            >
              <nav className="flex flex-col px-4 py-3 gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="font-body text-sm py-1 text-foreground"
                    onClick={() => setMenuOpen(false)}
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/help"
                  className="font-body text-sm py-1 text-foreground"
                  onClick={() => setMenuOpen(false)}
                  data-ocid="nav.link"
                >
                  Contact
                </Link>
                <Link
                  to="/my-orders"
                  className="font-body text-sm py-1 text-foreground"
                  onClick={() => setMenuOpen(false)}
                  data-ocid="nav.link"
                >
                  My Orders
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-primary-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="font-display text-2xl font-bold mb-2">GHAZA</div>
              <div className="font-display text-xs italic text-primary-foreground/60 mb-4 tracking-widest">
                Fashion
              </div>
              <p className="font-body text-sm text-primary-foreground/70 leading-relaxed">
                Elegant women's fashion, crafted with love. Premium quality
                clothing delivered across Pakistan.
              </p>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold uppercase tracking-widest mb-4">
                Quick Links
              </h4>
              <div className="flex flex-col gap-2">
                <Link
                  to="/"
                  className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Shop
                </Link>
                <Link
                  to="/my-orders"
                  className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  to="/help"
                  className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Help Centre
                </Link>
                <Link
                  to="/help"
                  className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  to="/admin"
                  className="font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Admin
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-body text-sm font-semibold uppercase tracking-widest mb-4">
                Contact
              </h4>
              <div className="flex flex-col gap-2 font-body text-sm text-primary-foreground/70">
                <span data-ocid="footer.item.1">&#128222; 03224402086</span>
                <span data-ocid="footer.item.2">
                  &#128231; ghazafashion2232@gmail.com
                </span>
                <span data-ocid="footer.item.3">
                  &#128241; WhatsApp: 03224402086
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center">
            <p className="font-body text-xs text-primary-foreground/50">
              &copy; {new Date().getFullYear()} Ghaza Fashion. Built with
              &#10084;&#65039; using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                className="underline hover:text-primary-foreground/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
