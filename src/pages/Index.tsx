import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { UserTypeSelector } from "@/components/UserTypeSelector";
import { JobCard } from "@/components/JobCard";
import { 
  MapPin, 
  Users, 
  BriefcaseIcon, 
  Star, 
  ArrowRight,
  Smartphone,
  Shield,
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-workers.jpg";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'worker' | 'employer'>('home');
  const [currentUser, setCurrentUser] = useState<'worker' | 'employer' | null>(null);
  const { toast } = useToast();

  // Sample jobs data
  const sampleJobs = [
    {
      id: '1',
      title: 'House Painting Job',
      category: 'Painter',
      description: 'Need experienced painter for 2-bedroom apartment interior painting. Must bring own brushes.',
      location: 'Jubilee Hills, Hyderabad',
      date: 'Today',
      time: '9:00 AM - 5:00 PM',
      pay: '₹1,500/day',
      employer: 'Rajesh Kumar',
      urgent: true
    },
    {
      id: '2',
      title: 'Office Cleaning',
      category: 'Cleaner',
      description: 'Daily office cleaning required for small IT company. Morning shift preferred.',
      location: 'HITEC City, Hyderabad',
      date: 'Tomorrow',
      time: '7:00 AM - 9:00 AM',
      pay: '₹800/day',
      employer: 'Tech Solutions Pvt Ltd'
    },
    {
      id: '3',
      title: 'Moving Helper Needed',
      category: 'Helper',
      description: 'Help with household shifting from one apartment to another. Heavy lifting required.',
      location: 'Banjara Hills, Hyderabad',
      date: 'Dec 20',
      time: '10:00 AM - 3:00 PM',
      pay: '₹1,200/day',
      employer: 'Priya Sharma'
    }
  ];

  const handleUserTypeSelect = (type: 'worker' | 'employer') => {
    setCurrentView(type);
    setCurrentUser(type);
  };

  const handleLogin = () => {
    toast({
      title: "Login Feature",
      description: "OTP-based login will be implemented in the next version!"
    });
  };

  const handleApplyJob = (jobId: string) => {
    toast({
      title: "Application Sent!",
      description: "Your application has been sent to the employer. They will contact you soon."
    });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentUser(null);
  };

  if (currentView === 'worker') {
    return (
      <div className="min-h-screen bg-background">
        <Header currentUser={currentUser} onLogin={handleLogin} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Available Jobs Near You</h1>
              <p className="text-muted-foreground">Find work opportunities in your area</p>
            </div>
            <Button variant="outline" onClick={handleBackToHome}>
              Back to Home
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sampleJobs.map((job) => (
              <JobCard 
                key={job.id}
                job={job}
                onApply={handleApplyJob}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'employer') {
    return (
      <div className="min-h-screen bg-background">
        <Header currentUser={currentUser} onLogin={handleLogin} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Employer Dashboard</h1>
              <p className="text-muted-foreground">Post jobs and find skilled workers</p>
            </div>
            <Button variant="outline" onClick={handleBackToHome}>
              Back to Home
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Post a New Job</h3>
              <p className="text-muted-foreground mb-4">
                Create a job posting to find skilled workers in your area
              </p>
              <Button className="w-full">Create Job Post</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Browse Workers</h3>
              <p className="text-muted-foreground mb-4">
                Search for available workers by skill and location
              </p>
              <Button variant="secondary" className="w-full">Browse Workers</Button>
            </Card>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Your Recent Job Posts</h3>
            <div className="grid gap-4">
              {sampleJobs.slice(0, 2).map((job) => (
                <JobCard 
                  key={job.id}
                  job={job}
                  onApply={handleApplyJob}
                  showApplyButton={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={currentUser} onLogin={handleLogin} />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Connect <span className="text-primary">Local Workers</span> with 
                  <span className="text-accent"> Daily Jobs</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  KaaryaSetu bridges the gap between skilled daily wage workers and local job opportunities. 
                  Find work or hire reliable workers in your neighborhood.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" onClick={() => handleUserTypeSelect('worker')}>
                  Find Work <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => handleUserTypeSelect('employer')}>
                  Hire Workers
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Active Workers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Jobs Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroImage} 
                alt="Daily wage workers"
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Local Jobs Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="py-16 bg-muted/30">
        <UserTypeSelector onSelectType={handleUserTypeSelect} />
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose KaaryaSetu?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed specifically for the Indian daily wage job market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile First</h3>
              <p className="text-muted-foreground">
                Simple, fast interface designed for mobile phones with regional language support
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location Based</h3>
              <p className="text-muted-foreground">
                Find jobs and workers in your exact neighborhood using GPS location
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Alerts</h3>
              <p className="text-muted-foreground">
                Get WhatsApp notifications for new jobs or worker applications immediately
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Jobs Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recent Job Opportunities</h2>
            <p className="text-lg text-muted-foreground">
              See what kind of work is available in your area
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sampleJobs.map((job) => (
              <JobCard 
                key={job.id}
                job={job}
                onApply={handleApplyJob}
              />
            ))}
          </div>

          <div className="text-center">
            <Button onClick={() => handleUserTypeSelect('worker')} size="lg">
              View All Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">KaaryaSetu</h3>
              <p className="text-primary-foreground/80">
                Connecting daily wage workers with local job opportunities across India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For Workers</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Find Jobs</li>
                <li>Create Profile</li>
                <li>Track Applications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For Employers</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Post Jobs</li>
                <li>Find Workers</li>
                <li>Manage Hiring</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Safety Guidelines</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 KaaryaSetu. Empowering local communities through work.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
