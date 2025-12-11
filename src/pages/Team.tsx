import { useState } from 'react';
import { Mail, Phone, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { users, tasks, projects } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Team = () => {
  const [activeProject, setActiveProject] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserTaskCount = (userId: string) => {
    return tasks.filter(t => t.assignee?.id === userId).length;
  };

  const getUserCompletedTasks = (userId: string) => {
    return tasks.filter(t => t.assignee?.id === userId && t.status === 'done').length;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeProject={activeProject} onProjectChange={setActiveProject} />
      
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header projectName="Team" />
        
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
              <p className="text-muted-foreground mt-1">Manage your team and view member activity</p>
            </div>
            <Button className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Team Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.map((user) => {
              const taskCount = getUserTaskCount(user.id);
              const completedCount = getUserCompletedTasks(user.id);
              
              return (
                <div
                  key={user.id}
                  className="bg-card rounded-xl border border-border p-5 shadow-soft hover:shadow-hover transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-lg font-semibold text-primary-foreground">
                        {user.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          Team Member
                        </Badge>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-md transition-all">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 mb-4 text-sm">
                    <div className="flex-1 bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-foreground">{taskCount}</div>
                      <div className="text-xs text-muted-foreground">Tasks</div>
                    </div>
                    <div className="flex-1 bg-success/10 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-success">{completedCount}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
                      <Mail className="h-4 w-4" />
                      {user.name.toLowerCase().replace(' ', '.')}@company.com
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Team;
