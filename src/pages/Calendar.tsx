
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());

  // These would be dynamically fetched in a real application
  const appointments = [
    {
      id: "1",
      customer: "Johnson Family",
      service: "Lawn Mowing",
      date: new Date(),
      time: "3:30 PM",
      status: "confirmed"
    },
    {
      id: "2",
      customer: "Mrs. Wilson",
      service: "Garden Weeding",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "2:00 PM",
      status: "confirmed"
    },
    {
      id: "3",
      customer: "Mr. Garcia",
      service: "Hedge Trimming",
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: "10:00 AM",
      status: "pending"
    },
    {
      id: "4",
      customer: "Robinson Household",
      service: "Lawn Mowing",
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      time: "4:15 PM",
      status: "confirmed"
    }
  ];

  const filteredAppointments = selectedDate
    ? appointments.filter(job => isSameDay(job.date, selectedDate))
    : [];

  const handlePreviousMonth = () => {
    const previousMonth = new Date(month);
    previousMonth.setMonth(month.getMonth() - 1);
    setMonth(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(month.getMonth() + 1);
    setMonth(nextMonth);
  };

  const getDaysWithAppointments = () => {
    return appointments.map(appointment => appointment.date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">
            {format(month, "MMMM yyyy")}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
            className="rounded-md border"
            modifiers={{
              hasAppointment: getDaysWithAppointments(),
            }}
            modifiersStyles={{
              hasAppointment: {
                fontWeight: 'bold',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '100%'
              }
            }}
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          {selectedDate
            ? `Appointments for ${format(selectedDate, "MMMM dd, yyyy")}`
            : "Upcoming Appointments"}
        </h2>
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((job) => (
              <Card key={job.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-medium">{job.customer}</h3>
                    <p className="text-sm text-muted-foreground">{job.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{format(job.date, "MMM dd, yyyy")}, {job.time}</p>
                    <p className="text-sm capitalize text-muted-foreground">{job.status}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                No appointments scheduled for this date.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
