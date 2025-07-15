import { Link } from "wouter";
import { toolCategories } from "@/lib/tools-config";
import { cn } from "@/lib/utils";
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

interface SidebarProps {
  currentToolId?: string;
}

export default function Sidebar({ currentToolId }: SidebarProps) {
  return (
    <aside className="flex flex-shrink-0">
      <div className="flex flex-col w-72 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
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
    </aside>
  );
}
