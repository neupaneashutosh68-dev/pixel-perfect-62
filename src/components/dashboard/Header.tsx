import { Bell, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  projectName: string;
}

export function Header({ projectName }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">{projectName}</h1>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="h-9 w-64 bg-muted/50 pl-9 text-sm border-0 focus-visible:ring-1"
          />
        </div>

        <Button className="gap-2 gradient-primary text-primary-foreground border-0 shadow-soft hover:shadow-glow transition-shadow">
          <Plus className="h-4 w-4" />
          New Task
        </Button>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
          <AvatarFallback className="bg-primary/20 text-primary font-medium">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
