import { MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time: string;
  pay: string;
  employer: string;
  urgent?: boolean;
}

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
  showApplyButton?: boolean;
}

export function JobCard({ job, onApply, showApplyButton = true }: JobCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              {job.urgent && (
                <Badge variant="destructive" className="text-xs">Urgent</Badge>
              )}
            </div>
            <Badge variant="outline" className="text-xs">{job.category}</Badge>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">
          {job.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{job.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{job.time}</span>
          </div>
          <div className="flex items-center gap-2 text-primary font-medium">
            <DollarSign className="w-4 h-4" />
            <span>{job.pay}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">by {job.employer}</span>
          {showApplyButton && (
            <Button onClick={() => onApply(job.id)} size="sm">
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}