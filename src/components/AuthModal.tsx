import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

import { LogIn, UserPlus, Users, BriefcaseIcon } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userType: 'worker' | 'employer', userData: any) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showUserTypeSelect, setShowUserTypeSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForProfile, setWaitingForProfile] = useState(false);
  const { toast } = useToast();
  const { signUpWithUsername, signInWithUsername, profile: userProfile } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    userType: 'worker' as 'worker' | 'employer',
    loginUserType: '' as 'worker' | 'employer' | ''
  });

  // Handle profile updates after login
  useEffect(() => {
    if (waitingForProfile && userProfile && userProfile.user_type) {
      // User profile is now available, proceed with login
      console.log('Profile loaded, completing login:', userProfile);
      onLoginSuccess(userProfile.user_type, {
        email: userProfile.email || '',
        name: userProfile.full_name || formData.username,
        userType: userProfile.user_type
      });
      setIsLoading(false);
      setWaitingForProfile(false);
      onClose();
    }
  }, [userProfile, waitingForProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (mode === 'register') {
      if (!formData.username || !formData.password) {
        toast({ title: 'Missing Information', description: 'Please enter username and password', variant: 'destructive' });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: 'Password Mismatch', description: 'Passwords do not match', variant: 'destructive' });
        return false;
      }
      if (formData.password.length < 6) {
        toast({ title: 'Weak Password', description: 'Password must be at least 6 characters', variant: 'destructive' });
        return false;
      }
    } else {
      if (!formData.loginUserType) {
        toast({ title: 'Select User Type', description: 'Please select whether you are a worker or employer', variant: 'destructive' });
        return false;
      }
      if (!formData.username || !formData.password) {
        toast({ title: 'Missing Information', description: 'Please enter username and password', variant: 'destructive' });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'register') {
        const result = await signUpWithUsername(formData.username, formData.password, formData.userType);
        if (result.success) {
          onLoginSuccess(formData.userType, {
            email: '',
            name: formData.username,
            userType: formData.userType
          });
          onClose();
          resetForm();
        }
      } else {
        // For login, validate credentials first
        console.log('Starting login process...');
        const result = await signInWithUsername(formData.username, formData.password);
        
        if (result.success && result.data?.user) {
          console.log('Login successful, waiting for profile...');
          // Wait for profile to be fetched, always use the async flow
          setWaitingForProfile(true);
          
          // Fallback timeout in case profile doesn't load
          setTimeout(() => {
            console.log('Login timeout, checking if still waiting:', waitingForProfile);
            setWaitingForProfile(false);
            setShowUserTypeSelect(true);
            setIsLoading(false);
          }, 5000);
          return; // Don't set loading to false immediately
        } else {
          console.error('Login failed:', result);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      if (mode === 'register') {
        setIsLoading(false);
      }
    }
  };

  const handleUserTypeSelection = (selectedUserType: 'worker' | 'employer') => {
    // Complete login with selected user type
    onLoginSuccess(selectedUserType, {
      email: '',
      name: formData.username,
      userType: selectedUserType
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      userType: 'worker',
      loginUserType: ''
    });
    setMode('login');
    setShowUserTypeSelect(false);
    setWaitingForProfile(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {showUserTypeSelect ? 'Select Login Type' : (mode === 'login' ? 'Login to Ruralink' : 'Join Ruralink')}
          </DialogTitle>
        </DialogHeader>

        {showUserTypeSelect ? (
          <div className="space-y-6">
            <div className="text-center text-sm text-muted-foreground">
              Welcome back, {formData.username}! How would you like to continue?
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full h-auto p-6 flex flex-col items-center gap-3 border border-border hover:border-primary"
                variant="outline"
                onClick={() => handleUserTypeSelection('worker')}
              >
                <Users className="w-8 h-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">Continue as Worker</div>
                  <div className="text-xs text-muted-foreground">Looking for work opportunities</div>
                </div>
              </Button>
              
              <Button 
                className="w-full h-auto p-6 flex flex-col items-center gap-3 border border-border hover:border-primary"
                variant="outline"
                onClick={() => handleUserTypeSelection('employer')}
              >
                <BriefcaseIcon className="w-8 h-8 text-primary" />
                <div className="text-center">
                  <div className="font-semibold">Continue as Employer</div>
                  <div className="text-xs text-muted-foreground">Looking to hire workers</div>
                </div>
              </Button>
            </div>
            
            <Button 
              variant="link" 
              className="w-full text-sm text-muted-foreground" 
              onClick={() => setShowUserTypeSelect(false)}
            >
              Back to login
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mode Toggle */}
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
              {mode === 'login' && (
                <div className="space-y-3">
                  <Label>I am a *</Label>
                  <RadioGroup 
                    value={formData.loginUserType} 
                    onValueChange={(value) => handleInputChange('loginUserType', value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="worker" id="login-worker" />
                      <Label htmlFor="login-worker" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Worker</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Looking for work
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="employer" id="login-employer" />
                      <Label htmlFor="login-employer" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="w-4 h-4" />
                          <span>Employer</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Looking to hire
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>

              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>I am a *</Label>
                    <RadioGroup 
                      value={formData.userType} 
                      onValueChange={(value) => handleInputChange('userType', value)}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="worker" id="worker" />
                        <Label htmlFor="worker" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>Worker</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Looking for work opportunities
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="employer" id="employer" />
                        <Label htmlFor="employer" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-2">
                            <BriefcaseIcon className="w-4 h-4" />
                            <span>Employer</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Looking to hire workers
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              <Button 
                type="submit"
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  mode === 'login' ? 'Signing in...' : 'Creating account...'
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary" 
                      onClick={() => setMode('register')}
                    >
                      Register here
                    </Button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary" 
                      onClick={() => setMode('login')}
                    >
                      Login here
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}