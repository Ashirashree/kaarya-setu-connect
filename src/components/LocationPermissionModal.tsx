import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, Zap } from "lucide-react";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onLocationGranted: (location: { lat: number; lng: number; address: string }) => void;
  onSkip: () => void;
}

export function LocationPermissionModal({ isOpen, onLocationGranted, onSkip }: LocationPermissionModalProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestLocation = () => {
    setIsRequesting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use a free geocoding service or fallback to coordinates
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            const address = data.locality 
              ? `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`
              : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
            onLocationGranted({
              lat: latitude,
              lng: longitude,
              address: address
            });
          } catch (error) {
            // Fallback - just use coordinates
            onLocationGranted({
              lat: latitude,
              lng: longitude,
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            });
          }
          setIsRequesting(false);
        },
        (error) => {
          console.log("Location access denied:", error);
          setIsRequesting(false);
          onSkip();
        }
      );
    } else {
      setIsRequesting(false);
      onSkip();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Allow Location Access
          </DialogTitle>
          <DialogDescription>
            Help us find the best jobs and workers near you
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Find nearby opportunities</p>
                <p className="text-xs text-muted-foreground">Get jobs within 5-10 km of your location</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Privacy protected</p>
                <p className="text-xs text-muted-foreground">Your exact location is never shared with employers</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={requestLocation} 
              disabled={isRequesting}
              className="flex-1"
            >
              {isRequesting ? "Getting Location..." : "Allow Location"}
            </Button>
            <Button variant="outline" onClick={onSkip} className="flex-1">
              Skip for Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}