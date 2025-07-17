import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/lib/theme-context";
import { toolCategories, getToolById } from "@/lib/tools-config";
import { Search, Moon, Sun, Menu, Wrench, X, Trash2, ChevronsLeft, ChevronsRight, ArrowRight, Github } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { clearAllToolStates, useHasToolStates } from "@/hooks/use-tool-state";
import Tool from "./tool";

export default function MainLayout() {
  const [location, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const hasToolStates = useHasToolStates();

  // Refs for search inputs
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

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

  // Create flattened list of all filtered tools for keyboard navigation
  const allFilteredTools = filteredCategories.flatMap(category => category.tools);

  const handleToolClick = (newToolId: string) => {
    navigate(`/tool/${newToolId}`);
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedToolIndex(0); // Reset selection when search changes
  };

  const getToolIndexInFlattenedList = (toolId: string) => {
    return allFilteredTools.findIndex(tool => tool.id === toolId);
  };

  // Handle CMD+K shortcut to toggle sidebar and focus search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for CMD+\ (Mac) or CTRL+\ (Windows/Linux) - toggle sidebar
      if ((event.metaKey || event.ctrlKey) && event.key === '\\') {
        event.preventDefault();
        setIsSidebarCollapsed(!isSidebarCollapsed);
      }

      // Check for CMD+K (Mac) or CTRL+K (Windows/Linux) - focus search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();

        // On desktop, expand sidebar if collapsed and focus search
        if (window.innerWidth >= 1024) {
          if (isSidebarCollapsed) {
            setIsSidebarCollapsed(false);
            // Small delay to ensure the sidebar is rendered
            setTimeout(() => {
              desktopSearchRef.current?.focus();
            }, 100);
          } else {
            desktopSearchRef.current?.focus();
          }
        } else {
          // Mobile: open mobile menu and focus mobile search
          if (!isMobileMenuOpen) {
            setIsMobileMenuOpen(true);
            // Small delay to ensure the mobile menu is rendered
            setTimeout(() => {
              mobileSearchRef.current?.focus();
            }, 100);
          } else {
            mobileSearchRef.current?.focus();
          }
        }
      }

      // Check for ESC key
      if (event.key === 'Escape') {
        // Clear search query
        setSearchQuery('');
        setSelectedToolIndex(0);

        // Remove focus from search inputs
        desktopSearchRef.current?.blur();
        mobileSearchRef.current?.blur();

        // Close mobile menu if open
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }

      // Handle keyboard navigation in search results
      if (searchQuery && allFilteredTools.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedToolIndex(prev =>
            prev < allFilteredTools.length - 1 ? prev + 1 : 0
          );
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedToolIndex(prev =>
            prev > 0 ? prev - 1 : allFilteredTools.length - 1
          );
        } else if (event.key === 'Enter') {
          event.preventDefault();
          const selectedTool = allFilteredTools[selectedToolIndex];
          if (selectedTool) {
            handleToolClick(selectedTool.id);
            setSearchQuery('');
            setSelectedToolIndex(0);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, isSidebarCollapsed, searchQuery, allFilteredTools, selectedToolIndex]);

  return (
    <TooltipProvider>
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

            <div className="flex items-center space-x-2">
              {/* Recycle Bin Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (hasToolStates) {
                          clearAllToolStates();
                          // Force re-render by incrementing trigger
                          setClearTrigger(prev => prev + 1);
                        }
                      }}
                      className={`h-10 w-10 ${!hasToolStates ? 'opacity-50' : ''}`}
                    >
                      <Trash2 className={`h-5 w-5 ${hasToolStates ? 'text-white' : 'text-gray-400'}`} />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hasToolStates ? 'Clear all tools' : 'No data to reset'}</p>
                </TooltipContent>
              </Tooltip>

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

              {/* Feedback Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://github.com/GeekyShacklebolt/handy-dev-tools/issues/new', '_blank')}
                className="h-9"
              >
                Give Feedback <Github className="h-4 w-4 ml-1" />
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
        <div className={`hidden lg:flex lg:flex-col lg:border-r lg:border-gray-300 lg:dark:border-gray-600 lg:bg-white lg:dark:bg-gray-800 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:w-16' : 'lg:w-[280px]'
        }`}>
          <div className="flex-1 overflow-y-auto p-4">
            {/* Search and Collapse Button - Inline */}
            <div className="mb-6">
              {!isSidebarCollapsed ? (
                <div className="flex items-center space-x-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search tools... ⌘ K"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 w-full"
                      ref={desktopSearchRef}
                    />
                    {searchQuery && allFilteredTools.length > 0 && (
                      <ArrowRight className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="h-9 w-9 pl-2 hover:bg-transparent"
                  >
                    {/* <ChevronsLeft className="h-4 w-4"/> */}
                    <span className="text-gray-400 hover:text-white transition-colors">⌘ \</span>
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarCollapsed(false)}
                        className="h-10 w-10"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expand sidebar [⌘\]</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Tool Categories - Only show when expanded */}
            <div className={`space-y-6 transition-all duration-300 ease-in-out ${
              isSidebarCollapsed ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-[1000px]'
            }`}>
              {filteredCategories.map((category) => (
                <div key={category.id}>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {category.tools.map((tool) => {
                      const toolIndex = getToolIndexInFlattenedList(tool.id);
                      const isSelected = searchQuery && toolIndex === selectedToolIndex;

                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleToolClick(tool.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            toolId === tool.id
                              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                              : isSelected
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {tool.name}
                        </button>
                      );
                    })}
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
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 w-full"
                      ref={mobileSearchRef}
                    />
                    {searchQuery && allFilteredTools.length > 0 && (
                      <ArrowRight className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    )}
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
                        {category.tools.map((tool) => {
                          const toolIndex = getToolIndexInFlattenedList(tool.id);
                          const isSelected = searchQuery && toolIndex === selectedToolIndex;

                          return (
                            <button
                              key={tool.id}
                              onClick={() => handleToolClick(tool.id)}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                toolId === tool.id
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                  : isSelected
                                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {tool.name}
                            </button>
                          );
                        })}
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
            <Tool key={clearTrigger} />
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
    </TooltipProvider>
  );
}
