import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

import { LogIn, UserPlus } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userType: 'worker' | 'employer', userData: any) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUpWithUsername, signInWithUsername, profile: userProfile } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

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
        const result = await signUpWithUsername(formData.username, formData.password);
        if (result.success) {
          onLoginSuccess('worker', {
            email: '',
            name: formData.username,
            userType: 'worker'
          });
          onClose();
          resetForm();
        }
      } else {
        const result = await signInWithUsername(formData.username, formData.password);
        
        if (result.success) {
          setTimeout(() => {
            if (userProfile) {
              onLoginSuccess(userProfile.user_type, {
                email: userProfile.email || '',
                name: userProfile.full_name || formData.username,
                userType: userProfile.user_type
              });
            } else {
              onLoginSuccess('worker', {
                email: '',
                name: formData.username,
                userType: 'worker'
              });
            }
            onClose();
            resetForm();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });
    setMode('login');
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
            {mode === 'login' ? 'Login to KaaryaSetu' : 'Join KaaryaSetu'}
          </DialogTitle>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}