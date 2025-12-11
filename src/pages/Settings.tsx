import { useState } from 'react';
import { User, Bell, Shield, Palette, Moon, Sun, LogOut } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Settings = () => {
  const [activeProject, setActiveProject] = useState('1');
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeProject={activeProject} onProjectChange={setActiveProject} />
      
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header projectName="Settings" />
        
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

            <div className="flex gap-6">
              {/* Sidebar Tabs */}
              <div className="w-48 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
                
                <Separator className="my-4" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 bg-card rounded-xl border border-border p-6 shadow-soft">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Profile Settings</h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Manage your personal information and preferences
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        {user?.initials || 'U'}
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Change Avatar</Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG or GIF. Max 2MB
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input defaultValue={user?.name || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input defaultValue={user?.email || ''} type="email" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={isAdmin ? 'Admin' : 'Team Member'} disabled />
                    </div>

                    <Button className="gradient-primary text-primary-foreground">
                      Save Changes
                    </Button>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Choose how you want to be notified
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { title: 'Email Notifications', description: 'Receive email updates about your tasks' },
                        { title: 'Push Notifications', description: 'Get push notifications on your devices' },
                        { title: 'Task Reminders', description: 'Remind me about upcoming due dates' },
                        { title: 'Team Updates', description: 'Notify me when team members complete tasks' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Switch defaultChecked={i < 2} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Security Settings</h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Keep your account secure
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input type="password" />
                      </div>
                      <Button variant="outline">Update Password</Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-4">Appearance Settings</h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Customize how TaskFlow looks
                      </p>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        {isDarkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-warning" />}
                        <div>
                          <p className="font-medium text-foreground">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Use dark theme across the app</p>
                        </div>
                      </div>
                      <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
