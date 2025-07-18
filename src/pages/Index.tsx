import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { UserTypeSelector } from "@/components/UserTypeSelector";
import { JobCard } from "@/components/JobCard";
import { LoginModal } from "@/components/LoginModal";
import { 
  MapPin, 
  Users, 
  BriefcaseIcon, 
  Star, 
  ArrowRight,
  Smartphone,
  Shield,
  Zap,
  Search,
  Phone,
  CheckCircle,
  Clock,
  MessageCircle
} from "lucide-react";
import heroImage from "@/assets/hero-workers.jpg";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'worker' | 'employer' | 'how-it-works' | 'support'>('home');
  const [currentUser, setCurrentUser] = useState<'worker' | 'employer' | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
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
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (userType: 'worker' | 'employer', userData: any) => {
    setCurrentUser(userType);
    setUserData(userData);
    setCurrentView(userType);
    setIsLoginModalOpen(false);
    toast({
      title: `Welcome, ${userData.name}!`,
      description: `You are now logged in as a ${userType}`
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

  // Get user location using Google Maps API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Using Google Maps Geocoding API (you'll need to add your API key)
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
            );
            const data = await response.json();
            
            if (data.results && data.results[0]) {
              const address = data.results[0].formatted_address;
              setUserLocation({
                lat: latitude,
                lng: longitude,
                address: address
              });
            }
          } catch (error) {
            // Fallback - just use coordinates
            setUserLocation({
              lat: latitude,
              lng: longitude,
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            });
          }
        },
        (error) => {
          console.log("Location access denied:", error);
          // For demo purposes, set a default location
          setUserLocation({
            lat: 17.4065,
            lng: 78.4772,
            address: "Hyderabad, Telangana, India"
          });
        }
      );
    }
  }, []);

  // Navigation handlers
  const handleHowItWorks = () => setCurrentView('how-it-works');
  const handleSupport = () => setCurrentView('support');

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
        <Header currentUser={currentUser} onLogin={handleLogin} onMenuClick={() => {}} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Employer Dashboard</h1>
              <p className="text-muted-foreground">Post jobs and find skilled workers</p>
              {userLocation && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {userLocation.address}
                </p>
              )}
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

  // How It Works Section
  if (currentView === 'how-it-works') {
    return (
      <div className="min-h-screen bg-background">
        <Header currentUser={currentUser} onLogin={handleLogin} onMenuClick={() => {}} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">How KaaryaSetu Works</h1>
            <Button variant="outline" onClick={handleBackToHome}>
              Back to Home
            </Button>
          </div>

          <div className="grid gap-12">
            {/* For Workers */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-primary">For Workers</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Register</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign up with your mobile number and create your skill profile
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Find Jobs</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse available jobs in your area based on your skills
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Apply</h3>
                  <p className="text-sm text-muted-foreground">
                    Apply to jobs with one click and get instant notifications
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">4. Get Contacted</h3>
                  <p className="text-sm text-muted-foreground">
                    Employers will contact you directly to discuss work details
                  </p>
                </Card>
              </div>
            </div>

            {/* For Employers */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-accent">For Employers</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BriefcaseIcon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">1. Post Job</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a job posting with work details and requirements
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">2. Location Match</h3>
                  <p className="text-sm text-muted-foreground">
                    Workers in your area will see your job posting automatically
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">3. Review Applications</h3>
                  <p className="text-sm text-muted-foreground">
                    Review worker profiles and select the best candidate
                  </p>
                </Card>
                
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">4. Rate & Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Rate workers after job completion to build trust
                  </p>
                </Card>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Location-Based Matching</h3>
                      <p className="text-muted-foreground">
                        Our system uses Google location services to match workers and employers within a 5-10 km radius, 
                        ensuring convenient commute and local connections.
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <MessageCircle className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Instant Notifications</h3>
                      <p className="text-muted-foreground">
                        Get WhatsApp and SMS alerts for new job postings, applications, and updates. 
                        Never miss an opportunity in your area.
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Safe & Verified</h3>
                      <p className="text-muted-foreground">
                        All users are verified through mobile OTP. Build trust through our rating and review system 
                        for safe transactions.
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <Clock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Quick & Easy</h3>
                      <p className="text-muted-foreground">
                        Simple interface designed for daily wage workers. Apply to jobs or post work 
                        requirements in just a few taps.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Support Section
  if (currentView === 'support') {
    return (
      <div className="min-h-screen bg-background">
        <Header currentUser={currentUser} onLogin={handleLogin} onMenuClick={() => {}} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Support & Help</h1>
            <Button variant="outline" onClick={handleBackToHome}>
              Back to Home
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Help */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">How do I find jobs near me?</h3>
                  <p className="text-muted-foreground">
                    After registering, allow location access. The app will automatically show jobs within 5-10 km of your location. 
                    You can also search by area or pin code.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Is KaaryaSetu free to use?</h3>
                  <p className="text-muted-foreground">
                    Yes! KaaryaSetu is completely free for both workers and employers. We believe in empowering 
                    local communities without any financial barriers.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">How do I get paid for completed work?</h3>
                  <p className="text-muted-foreground">
                    Payment is directly between you and the employer. We recommend discussing payment terms before starting work. 
                    Always get payment confirmation in writing.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">What if I face issues with an employer/worker?</h3>
                  <p className="text-muted-foreground">
                    Use our rating system to report issues. For serious problems, contact our support team. 
                    We maintain a blacklist of problematic users to keep the platform safe.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Can I work in multiple cities?</h3>
                  <p className="text-muted-foreground">
                    Yes! Update your location when you move to a new city. The app will show jobs in your new area. 
                    Your profile and ratings will remain with you.
                  </p>
                </Card>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Phone Support
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Call us for immediate help
                  </p>
                  <p className="font-medium">+91 9876543210</p>
                  <p className="text-sm text-muted-foreground">Mon-Sat: 9 AM - 7 PM</p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Support
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Quick help via WhatsApp
                  </p>
                  <p className="font-medium">+91 9876543210</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Safety Guidelines</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Meet in public places initially</li>
                    <li>• Verify payment terms before starting</li>
                    <li>• Keep work communication on platform</li>
                    <li>• Report suspicious behavior immediately</li>
                    <li>• Trust your instincts about safety</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Regional Language Support</h3>
                  <p className="text-muted-foreground mb-2">
                    Available in:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Hindi</li>
                    <li>• Telugu</li>
                    <li>• Tamil</li>
                    <li>• Bengali</li>
                    <li>• Marathi</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser} 
        onLogin={handleLogin} 
        onMenuClick={() => {}}
        onHowItWorks={handleHowItWorks}
        onSupport={handleSupport}
      />
      
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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Index;
