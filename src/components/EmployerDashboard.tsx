import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { JobPostModal } from "@/components/JobPostModal";
import { JobCard } from "@/components/JobCard";
import { 
  Plus, 
  Eye, 
  Users, 
  Clock, 
  CheckCircle, 
  Building, 
  TrendingUp,
  AlertCircle,
  Briefcase,
  Trash2,
  Edit
} from "lucide-react";

export function EmployerDashboard() {
  const [showJobModal, setShowJobModal] = useState(false);
  const { jobs, applications, loading, deleteJob } = useJobs();
  const { profile, signOut } = useAuth();

  // Filter jobs posted by current employer
  const myJobs = jobs.filter(job => job.employer_id === profile?.user_id);
  const openJobs = myJobs.filter(job => job.status === 'open');
  const completedJobs = myJobs.filter(job => job.status === 'completed');
  
  // Filter applications for employer's jobs
  const myApplications = applications.filter(app => 
    app.jobs && app.jobs.employer_id === profile?.user_id
  );

  const recentJobs = myJobs.slice(0, 5);

  const handleDeleteJob = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      await deleteJob(jobId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={profile?.user_type || null} 
        onLogin={() => {}} 
        onLogout={signOut}
        user={profile}
      />
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome, {profile?.full_name || 'Employer'}!
              </h1>
              <p className="text-muted-foreground">
                Manage your job postings and find the best workers
              </p>
            </div>
            <Button onClick={() => setShowJobModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-xl font-bold">{myJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-xl font-bold">{openJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-xl font-bold">{myApplications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{completedJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => setShowJobModal(true)}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Post a Job</h3>
              <p className="text-sm text-muted-foreground">Create a new job posting to find workers</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              // TODO: Implement applications view
              console.log("View Applications clicked");
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">View Applications</h3>
              <p className="text-sm text-muted-foreground">Review and manage job applications</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              // TODO: Implement analytics view
              console.log("Analytics clicked");
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">Track your job posting performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Job Postings</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{openJobs.length} active</Badge>
                <Badge variant="secondary">{myJobs.length} total</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading your jobs...</p>
              </div>
            ) : recentJobs.length > 0 ? (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="relative">
                    <JobCard
                      job={job}
                      onApply={() => {}}
                      currentUser="employer"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background/80 backdrop-blur-sm"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          console.log("Edit job:", job.id);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {myJobs.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      View All Jobs ({myJobs.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No jobs posted yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by posting your first job to find qualified workers
                </p>
                <Button onClick={() => setShowJobModal(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Post Your First Job
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Completion Reminder */}
        {(!profile?.location || !profile?.full_name) && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium">Complete your business profile</p>
                  <p className="text-sm text-muted-foreground">
                    Add business details to build trust with workers
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Building className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <JobPostModal 
        isOpen={showJobModal} 
        onClose={() => setShowJobModal(false)} 
      />
    </div>
  );
}