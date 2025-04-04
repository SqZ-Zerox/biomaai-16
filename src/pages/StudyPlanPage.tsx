import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StudyPlanPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto p-4">
      <Card className="glass-card neon-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Study Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                    // Fix the custom components property
                    components={{
                      IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" {...props} />,
                      IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" {...props} />,
                      Day: ({ ...props }) => (
                        <div {...props} className={cn(props.className, "p-0")}>
                          {props.children}
                        </div>
                      )
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" placeholder="Enter topic" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Enter duration"
              />
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">Add to Plan</Button>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Today's Plan</h3>
            <p className="text-muted-foreground">No items planned for today.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanPage;
