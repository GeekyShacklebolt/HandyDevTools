import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme-context";
import { toolCategories, getToolById } from "@/lib/tools-config";
import { Search, Moon, Sun, Menu, Wrench, X } from "lucide-react";
import Tool from "./tool";

export default function MainLayout() {
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Extract tool ID from URL
  const toolId = location.startsWith('/tool/') ? location.split('/tool/')[1] : null;
  const currentTool = toolId ? getToolById(toolId) : null;

  // Filter tools based on search
  const filteredCategories = toolCategories.map(category => ({
    ...category,
    tools: category.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.tools.length > 0);

  const handleToolClick = (newToolId: string) => {
    navigate(`/tool/${newToolId}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  <Wrench className="inline mr-2 h-6 w-6" />
                  HandyDevTools
                </h1>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-10 w-10 lg:hidden"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:flex lg:w-80 lg:flex-col lg:border-r lg:border-gray-300 lg:dark:border-gray-600 lg:bg-white lg:dark:bg-gray-800">
          <div className="flex-1 overflow-y-auto p-4">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Tool Categories */}
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {category.tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          toolId === tool.id
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 overflow-y-auto">
              <div className="p-4">
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>

                {/* Tool Categories */}
                <div className="space-y-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id}>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
                        {category.name}
                      </h3>
                      <div className="space-y-1">
                        {category.tools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => handleToolClick(tool.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              toolId === tool.id
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {tool.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {currentTool ? (
            <Tool />
          ) : (
            <div className="h-full flex items-start justify-center bg-gray-50 dark:bg-gray-900 p-8 pt-16">
              <div className="text-center max-w-2xl">
                <div className="mb-8">
                  <Wrench className="mx-auto h-16 w-16 text-blue-500 dark:text-blue-400 mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Your One-Stop Utility Kit
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    Choose a tool from the sidebar to get started with your development tasks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Text & Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Convert, format, and manipulate text and data formats</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Code Tools</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Format, beautify, and convert code between languages</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Web Utilities</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">URL parsing, encoding, and web development tools</p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Quick Start</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Use the search bar in the sidebar to quickly find the tool you need, or browse through the categories to discover new utilities.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}