
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudyEvent } from "@/services/dataService";

interface EventsListProps {
  events: StudyEvent[];
  isLoading: boolean;
  selectedDate: Date;
}

const EventsList: React.FC<EventsListProps> = ({ events, isLoading, selectedDate }) => {
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

  const getEventTypeStyles = (type: string) => {
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
    <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>
          {eventsForSelectedDate.length > 0
            ? `Events for ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
            : "Upcoming Events"
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        {eventsForSelectedDate.length > 0 ? (
          <div className="space-y-3">
            {eventsForSelectedDate.map((event) => (
              <div 
                key={event.id} 
                className="p-3 rounded-md border border-border/40 bg-muted/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    getEventTypeStyles(event.type)
                  )}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEvents.length > 0 ? (
              sortedEvents.slice(0, 5).map((event) => (
                <div 
                  key={event.id} 
                  className="p-3 rounded-md border border-border/40 bg-muted/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {event.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="font-medium">{event.title}</h3>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      getEventTypeStyles(event.type)
                    )}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No upcoming events for this month
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
