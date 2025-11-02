import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Check, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Install Kaarya Setu Connect
          </h1>
          
          <p className="text-muted-foreground">
            Get quick access to job opportunities by installing our app on your device
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">Works Offline</h3>
              <p className="text-sm text-muted-foreground">Access jobs even without internet</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">Fast & Native Feel</h3>
              <p className="text-sm text-muted-foreground">Instant loading and smooth experience</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">Home Screen Access</h3>
              <p className="text-sm text-muted-foreground">Launch directly from your home screen</p>
            </div>
          </div>
        </div>

        {isInstalled ? (
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
              <Check className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-foreground">App Already Installed!</p>
              <p className="text-sm text-muted-foreground mt-1">
                You can access it from your home screen
              </p>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to App
            </Button>
          </div>
        ) : isInstallable ? (
          <Button onClick={handleInstallClick} className="w-full" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Install App
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">On iPhone:</strong> Tap the Share button <span className="inline-block">⎙</span> and select "Add to Home Screen"
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">On Android:</strong> Open browser menu and select "Install App" or "Add to Home Screen"
              </p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Continue in Browser
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Install;