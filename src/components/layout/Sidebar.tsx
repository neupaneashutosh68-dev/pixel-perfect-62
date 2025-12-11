import { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Users, 
  Settings, 
  Plus,
  ChevronDown,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { projects } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SidebarProps {
  activeProject: string;
  onProjectChange: (id: string) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: FolderKanban, label: 'Projects', id: 'projects' },
  { icon: Calendar, label: 'Calendar', id: 'calendar' },
  { icon: Users, label: 'Team', id: 'team' },
];

export function Sidebar({ activeProject, onProjectChange }: SidebarProps) {
  const [activeNav, setActiveNav] = useState('projects');
  const [projectsOpen, setProjectsOpen] = useState(true);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
          <FolderKanban className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">TaskFlow</span>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="h-9 bg-muted/50 pl-9 text-sm border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeNav === item.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}

        {/* Projects Section */}
        <div className="pt-4">
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Projects
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              projectsOpen && "rotate-180"
            )} />
          </button>
          
          {projectsOpen && (
            <div className="mt-1 space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onProjectChange(project.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    activeProject === project.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <div 
                    className="h-2.5 w-2.5 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </button>
              ))}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Settings */}
      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
