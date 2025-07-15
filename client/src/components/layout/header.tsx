import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { Search, Moon, Sun, Menu, Wrench } from "lucide-react";

interface HeaderProps {
  onMobileMenuClick?: () => void;
  showMobileMenuButton?: boolean;
}

export default function Header({ onMobileMenuClick, showMobileMenuButton }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                <Wrench className="inline mr-2 h-6 w-6" />
                HandyDevTools - Your one-stop utility kit
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            {showMobileMenuButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileMenuClick}
                className="h-10 w-10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
