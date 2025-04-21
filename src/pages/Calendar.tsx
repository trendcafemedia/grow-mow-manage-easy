
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

const Calendar = () => {
  // These would be dynamically fetched in a real application
  const upcomingJobs = [
    {
      id: "1",
      customer: "Johnson Family",
      service: "Lawn Mowing",
      date: "Today",
      time: "3:30 PM",
      status: "confirmed"
    },
    {
      id: "2",
      customer: "Mrs. Wilson",
      service: "Garden Weeding",
      date: "Tomorrow",
      time: "2:00 PM",
      status: "confirmed"
    },
    {
      id: "3",
      customer: "Mr. Garcia",
      service: "Hedge Trimming",
      date: "Jun 29, 2023",
      time: "10:00 AM",
      status: "pending"
    },
    {
      id: "4",
      customer: "Robinson Household",
      service: "Lawn Mowing",
      date: "Jun 30, 2023",
      time: "4:15 PM",
      status: "confirmed"
    }
  ];

  // Month view calendar would go here - using a placeholder for now
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>June 2023</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center bg-muted rounded-md p-10">
            <div className="text-center text-muted-foreground">
              <CalendarIcon className="mx-auto h-12 w-12 mb-2" />
              <p>Calendar view would appear here</p>
              <p className="text-sm">Will integrate with Google Calendar API</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Upcoming Jobs</h2>
        <div className="space-y-4">
          {upcomingJobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <h3 className="font-medium">{job.customer}</h3>
                  <p className="text-sm text-muted-foreground">{job.service}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{job.date}, {job.time}</p>
                  <p className="text-sm capitalize text-muted-foreground">{job.status}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
