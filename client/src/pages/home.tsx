import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toolCategories, type Tool } from "@/lib/tools-config";
import { Search, Clock, Code, FileCode, Database, Type, Fingerprint, Eye, ArrowRight } from "lucide-react";
import Header from "@/components/layout/header";

const iconMap = {
  Clock,
  Code,
  FileCode,
  Database,
  Type,
  Fingerprint,
  Eye,
  Search,
  Link: Code,
  Image: Code,
  ArrowRightLeft: Code,
  Calculator: Code,
  Table: Code,
  Key: Code,
  Wand2: Code,
  Palette: Code,
  GitCompare: Code,
  QrCode: Code,
  Lock: Code,
  Shield: Code,
  Shuffle: Code,
  ArrowUpDown: Code
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);
  const [, navigate] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredCategories = toolCategories.map(category => ({
    ...category,
    tools: category.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.tools.length > 0);

  // Create flattened list of all filtered tools for keyboard navigation
  const allFilteredTools = filteredCategories.flatMap(category => category.tools);

  const handleToolClick = (tool: Tool) => {
    navigate(`/tool/${tool.id}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedToolIndex(0); // Reset selection when search changes
  };

  const getToolIndexInFlattenedList = (toolId: string) => {
    return allFilteredTools.findIndex(tool => tool.id === toolId);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
            handleToolClick(selectedTool);
            setSearchQuery('');
            setSelectedToolIndex(0);
          }
        }
      }

      // Check for ESC key
      if (event.key === 'Escape') {
        setSearchQuery('');
        setSelectedToolIndex(0);
        searchRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, allFilteredTools, selectedToolIndex]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            HandyDevTools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            40+ Essential Developer Tools - All Client-Side, Fast & Secure
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full"
              ref={searchRef}
            />
            {searchQuery && allFilteredTools.length > 0 && (
              <ArrowRight className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>

        {/* Tool Categories */}
        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <div key={category.id}>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                {category.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.tools.map((tool) => {
                  const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Code;
                  const toolIndex = getToolIndexInFlattenedList(tool.id);
                  const isSelected = searchQuery && toolIndex === selectedToolIndex;

                  return (
                    <Card
                      key={tool.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'shadow-lg ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleToolClick(tool)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {category.name}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or browse the categories above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
