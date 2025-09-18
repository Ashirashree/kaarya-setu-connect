import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";

interface HeaderProps {
  currentUser?: 'worker' | 'employer' | null;
  onLogin: () => void;
  onLogout?: () => void;
  user?: any;
  onMenuClick?: () => void;
  onHowItWorks?: () => void;
  onSupport?: () => void;
}

export function Header({ currentUser, onLogin, onLogout, user, onMenuClick, onHowItWorks, onSupport }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-primary">Ruralink</h1>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={onHowItWorks}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </button>
          <button 
            onClick={onSupport}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Support
          </button>
        </nav>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={onLogin} size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}