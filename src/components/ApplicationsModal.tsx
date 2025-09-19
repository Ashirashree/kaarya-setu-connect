import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  MapPin, 
  Calendar, 
  Clock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

interface Application {
  id: string;
  job_id: string;
  worker_id: string;
  applied_at: string;
  status: string;
  message?: string;
  jobs: {
    title: string;
    location: string;
    employer_id: string;
  };
}

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: Application[];
}

export function ApplicationsModal({ isOpen, onClose, applications }: ApplicationsModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredApplications = applications.filter(app => 
    selectedStatus === "all" || app.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Job Applications ({applications.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={selectedStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("all")}
            >
              All ({applications.length})
            </Button>
            <Button
              variant={selectedStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("pending")}
            >
              Pending ({applications.filter(a => a.status === 'pending').length})
            </Button>
            <Button
              variant={selectedStatus === "accepted" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("accepted")}
            >
              Accepted ({applications.filter(a => a.status === 'accepted').length})
            </Button>
            <Button
              variant={selectedStatus === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus("rejected")}
            >
              Rejected ({applications.filter(a => a.status === 'rejected').length})
            </Button>
          </div>

          <Separator />

          {/* Applications List */}
          <div className="max-h-96 overflow-y-auto space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">Worker Application</h4>
                            <p className="text-sm text-muted-foreground">
                              Applied {new Date(application.applied_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(application.status)}
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </div>
                        </Badge>
                      </div>

                      {/* Job Details */}
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{application.jobs.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{application.jobs.location}</span>
                        </div>
                      </div>

                      {/* Application Message */}
                      {application.message && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Application Message:</h5>
                          <p className="text-sm text-muted-foreground bg-muted/30 rounded p-2">
                            {application.message}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {application.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => {
                              // TODO: Implement accept application
                              console.log("Accept application:", application.id);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // TODO: Implement reject application
                              console.log("Reject application:", application.id);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No applications found</h3>
                <p className="text-muted-foreground">
                  {selectedStatus === "all" 
                    ? "No one has applied to your jobs yet." 
                    : `No ${selectedStatus} applications found.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}