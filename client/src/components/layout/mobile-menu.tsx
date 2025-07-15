import { Link } from "wouter";
import { toolCategories } from "@/lib/tools-config";
import { cn } from "@/lib/utils";
import { X, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Clock, Code, FileCode, Database, Type, Fingerprint, Eye, Search, 
  Link as LinkIcon, Image, ArrowRightLeft, Calculator, Table, Key, 
  Wand2, Palette, GitCompare, QrCode, Lock, Shield, Shuffle, 
  ArrowUpDown, FileText
} from "lucide-react";

const iconMap = {
  Clock,
  Code,
  FileCode,
  Database,
  Type,
  Fingerprint,
  Eye,
  Search,
  Link: LinkIcon,
  Image,
  ArrowRightLeft,
  Calculator,
  Table,
  Key,
  Wand2,
  Palette,
  GitCompare,
  QrCode,
  Lock,
  Shield,
  Shuffle,
  ArrowUpDown,
  FileText
};

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  currentToolId?: string;
}

export default function MobileMenu({ open, onClose, currentToolId }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex z-40 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-dark-surface">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-1 h-10 w-10 rounded-full text-white hover:bg-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <Link href="/" onClick={onClose} className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                <Wrench className="inline mr-2 h-5 w-5" />
                DevUtils
              </h1>
            </Link>
          </div>
          
          <nav className="mt-5 px-2 space-y-1">
            {toolCategories.map((category) => (
              <div key={category.id} className="mb-4">
                <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {category.name}
                </h3>
                <div className="mt-2 space-y-1">
                  {category.tools.map((tool) => {
                    const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Code;
                    const isActive = currentToolId === tool.id;
                    
                    return (
                      <Link
                        key={tool.id}
                        href={`/tool/${tool.id}`}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        <IconComponent 
                          className={cn(
                            "mr-3 flex-shrink-0 h-4 w-4",
                            isActive 
                              ? "text-blue-500 dark:text-blue-400" 
                              : "text-gray-400"
                          )} 
                        />
                        {tool.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
