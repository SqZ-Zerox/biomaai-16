
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar, Info, CalendarDays, Trash2, MoreHorizontal, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudyEvent } from "@/services/dataService";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditEventModal from "./EditEventModal";

interface EventsListProps {
  events: StudyEvent[];
  isLoading: boolean;
  selectedDate: Date;
  onDeleteEvent?: (eventId: string) => void;
  onUpdateEvent?: (event: StudyEvent) => void;
}

const EventsList: React.FC<EventsListProps> = ({ 
  events, 
  isLoading, 
  selectedDate,
  onDeleteEvent,
  onUpdateEvent
}) => {
  const [editingEvent, setEditingEvent] = useState<StudyEvent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter events for selected date
  const eventsForSelectedDate = events.filter(event => 
    event.date.getDate() === selectedDate.getDate() &&
    event.date.getMonth() === selectedDate.getMonth() &&
    event.date.getFullYear() === selectedDate.getFullYear()
  );
  
  // Get events for the current month
  const currentMonthEvents = events.filter(event => 
    event.date.getMonth() === selectedDate.getMonth() &&
    event.date.getFullYear() === selectedDate.getFullYear()
  );
  
  // Sort events by date
  const sortedEvents = [...currentMonthEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Get upcoming events (future dates)
  const now = new Date();
  const upcomingEvents = events
    .filter(event => event.date.getTime() > now.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventTypeStyles = (type: string | undefined) => {
    switch (type) {
      case 'exam':
        return "bg-red-500/20 text-red-500";
      case 'assignment':
        return "bg-amber-500/20 text-amber-500";
      case 'class':
        return "bg-primary/20 text-primary";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getFormattedDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();
                    
    const isTomorrow = date.getDate() === tomorrow.getDate() && 
                       date.getMonth() === tomorrow.getMonth() && 
                       date.getFullYear() === tomorrow.getFullYear();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    
    return format(date, 'EEE, MMM d');
  };

  const handleEditEvent = (event: StudyEvent) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleEventUpdated = (updatedEvent: StudyEvent) => {
    if (onUpdateEvent) {
      onUpdateEvent(updatedEvent);
    }
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const EventActions = ({ event }: { event: StudyEvent }) => {
    if (!onDeleteEvent && !onUpdateEvent) return null;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onUpdateEvent && (
            <DropdownMenuItem onSelect={() => handleEditEvent(event)}>
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          )}
          {onDeleteEvent && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this event? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDeleteEvent(event.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Important Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>
            {eventsForSelectedDate.length > 0
              ? `Events for ${format(selectedDate, "MMMM d, yyyy")}`
              : "Upcoming Events"
            }
          </CardTitle>
          {eventsForSelectedDate.length > 0 && (
            <CardDescription>
              You have {eventsForSelectedDate.length} event{eventsForSelectedDate.length !== 1 ? 's' : ''} on this day
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {eventsForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {eventsForSelectedDate.map((event) => (
                <div 
                  key={event.id} 
                  className="p-3 rounded-md border border-border/40 bg-muted/10 transition hover:bg-muted/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(event.date, "h:mm a")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        getEventTypeStyles(event.type)
                      )}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      <EventActions event={event} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                <>
                  <div className="flex items-start gap-2 mb-2 text-muted-foreground">
                    <Info className="h-4 w-4 mt-0.5" />
                    <p className="text-sm">
                      Select a date on the calendar to see events for that day.
                    </p>
                  </div>
                  
                  {upcomingEvents.slice(0, 5).map((event, index, arr) => {
                    const currentDateStr = getFormattedDate(event.date);
                    const showDateDivider = index === 0 || 
                      currentDateStr !== getFormattedDate(arr[index - 1].date);
                    
                    return (
                      <React.Fragment key={event.id}>
                        {showDateDivider && (
                          <div className="flex items-center gap-2 pt-1">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <h3 className="font-medium text-sm">
                              {currentDateStr}
                            </h3>
                          </div>
                        )}
                        <div className="p-3 rounded-md border border-border/40 bg-muted/10 transition hover:bg-muted/20">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {format(event.date, "h:mm a")}
                                </p>
                              </div>
                              {event.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                getEventTypeStyles(event.type)
                              )}>
                                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              </span>
                              <EventActions event={event} />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  
                  {upcomingEvents.length > 5 && (
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      + {upcomingEvents.length - 5} more upcoming events
                    </p>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground text-sm">
                    You don't have any upcoming events. Add a new event to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <EditEventModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEventUpdated={handleEventUpdated}
        event={editingEvent}
      />
    </>
  );
};

export default EventsList;
