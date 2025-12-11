import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, Plus } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { meetings, projects } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CalendarPage = () => {
  const [activeProject, setActiveProject] = useState('1');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 11)); // Dec 11, 2024

  // Get week days starting from Monday
  const getWeekDays = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(new Date(currentDate));
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getMeetingsForDay = (date: Date) => {
    return meetings.filter(m => m.date === formatDate(date));
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date(2024, 11, 11); // Mock today
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeProject={activeProject} onProjectChange={setActiveProject} />
      
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header projectName="Calendar" />
        
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">
                {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h1>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
              New Meeting
            </Button>
          </div>

          {/* Week View */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-soft">
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-3 text-center text-sm text-muted-foreground border-r border-border">
                Time
              </div>
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-3 text-center border-r border-border last:border-r-0',
                    isToday(day) && 'bg-primary/10'
                  )}
                >
                  <div className="text-xs text-muted-foreground mb-1">{dayNames[i]}</div>
                  <div className={cn(
                    'text-lg font-semibold',
                    isToday(day) ? 'text-primary' : 'text-foreground'
                  )}>
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-border last:border-b-0 min-h-[80px]">
                  <div className="p-2 text-xs text-muted-foreground text-right pr-3 border-r border-border">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {weekDays.map((day, dayIdx) => {
                    const dayMeetings = getMeetingsForDay(day).filter(m => {
                      const meetingHour = parseInt(m.time.split(':')[0]);
                      return meetingHour === hour;
                    });
                    
                    return (
                      <div
                        key={dayIdx}
                        className={cn(
                          'p-1 border-r border-border last:border-r-0 relative',
                          isToday(day) && 'bg-primary/5'
                        )}
                      >
                        {dayMeetings.map((meeting) => {
                          const project = projects.find(p => p.id === meeting.projectId);
                          return (
                            <div
                              key={meeting.id}
                              className="rounded-lg p-2 text-xs mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                              style={{ 
                                backgroundColor: `${meeting.color}20`,
                                borderLeft: `3px solid ${meeting.color}`
                              }}
                            >
                              <div className="font-medium text-foreground line-clamp-1">
                                {meeting.title}
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {meeting.time} · {meeting.duration}
                              </div>
                              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                <Users className="h-3 w-3" />
                                {meeting.attendees.length} attendees
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings Sidebar */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">This Week's Meetings</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {meetings.slice(0, 8).map((meeting) => {
                const project = projects.find(p => p.id === meeting.projectId);
                return (
                  <div
                    key={meeting.id}
                    className="bg-card rounded-lg border border-border p-4 hover:shadow-soft transition-shadow"
                  >
                    <div 
                      className="h-1 w-12 rounded-full mb-3"
                      style={{ backgroundColor: meeting.color }}
                    />
                    <h3 className="font-medium text-foreground mb-1">{meeting.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}
                      {meeting.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        {meeting.attendees.slice(0, 3).map((attendee) => (
                          <div
                            key={attendee.id}
                            className="h-6 w-6 rounded-full bg-primary/20 border border-card flex items-center justify-center text-[10px] font-medium text-primary"
                          >
                            {attendee.initials}
                          </div>
                        ))}
                      </div>
                      {meeting.attendees.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{meeting.attendees.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
