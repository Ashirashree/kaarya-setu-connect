import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Smartphone, User, Briefcase } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userType: 'worker' | 'employer', userData: any) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [userType, setUserType] = useState<'worker' | 'employer'>('worker');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signInWithPhone, verifyOtp, createProfile, profile: userProfile } = useAuth();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    age: '',
    location: '',
    skills: '',
    experience: '',
    businessName: '',
    businessType: ''
  });

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const result = await signInWithPhone(phoneNumber);
    setIsLoading(false);
    
    if (result.success) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const result = await verifyOtp(phoneNumber, otp);
    setIsLoading(false);
    
    if (result.success) {
      // Check if profile exists
      setTimeout(() => {
        if (userProfile) {
          // Existing user - login directly
          onLoginSuccess(userProfile.user_type, {
            phoneNumber,
            name: userProfile.full_name || 'User',
            userType: userProfile.user_type
          });
          onClose();
        } else {
          // New user - complete profile
          setStep('profile');
        }
      }, 500);
    }
  };

  const handleCompleteProfile = async () => {
    const requiredFields = userType === 'worker' 
      ? ['name', 'location']
      : ['name', 'location'];

    const missingFields = requiredFields.filter(field => !profileForm[field as keyof typeof profileForm]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const result = await createProfile({
      full_name: profileForm.name,
      phone: phoneNumber,
      user_type: userType,
      location: profileForm.location
    });
    setIsLoading(false);
    
    if (result.success) {
      const userData = {
        phoneNumber,
        name: profileForm.name,
        userType
      };
      onLoginSuccess(userType, userData);
      onClose();
    }
  };

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setProfileForm({
      name: '',
      age: '',
      location: '',
      skills: '',
      experience: '',
      businessName: '',
      businessType: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 'phone' && 'Login to KaaryaSetu'}
            {step === 'otp' && 'Verify Your Phone'}
            {step === 'profile' && 'Complete Your Profile'}
          </DialogTitle>
        </DialogHeader>

        {step === 'phone' && (
          <div className="space-y-6">
            <Tabs value={userType} onValueChange={(value) => setUserType(value as 'worker' | 'employer')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="worker" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Worker
                </TabsTrigger>
                <TabsTrigger value="employer" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Employer
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                    <span className="text-sm">+91</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="rounded-l-none"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSendOTP} 
                className="w-full" 
                disabled={isLoading || phoneNumber.length !== 10}
              >
                {isLoading ? (
                  <>
                    <Smartphone className="w-4 h-4 mr-2 animate-pulse" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Enter the 6-digit code sent to<br />
                <span className="font-medium">+91 {phoneNumber}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-wider"
                />
              </div>

              <Button 
                onClick={handleVerifyOTP} 
                className="w-full" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setStep('phone')} 
                className="w-full"
              >
                Change Phone Number
              </Button>
            </div>
          </div>
        )}

        {step === 'profile' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Complete your profile to get started as a {userType}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {userType === 'worker' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Age"
                        value={profileForm.age}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="Years"
                        value={profileForm.experience}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, experience: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills *</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., Painting, Cleaning, Construction"
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, skills: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {userType === 'employer' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business/Organization Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter business name"
                      value={profileForm.businessName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, businessName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      placeholder="e.g., Individual, Small Business, Company"
                      value={profileForm.businessType}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, businessType: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter your city/area"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleCompleteProfile} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Profile...' : 'Complete Registration'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
