import { Users, BriefcaseIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserTypeSelectorProps {
  onSelectType: (type: 'worker' | 'employer') => void;
}

export function UserTypeSelector({ onSelectType }: UserTypeSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          How would you like to use Ruralink?
        </h2>
        <p className="text-lg text-muted-foreground">
          Choose your role to get started with finding work or hiring workers
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" 
              onClick={() => onSelectType('worker')}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">I'm Looking for Work</h3>
            <p className="text-muted-foreground">
              Find daily wage jobs in your area. Connect with employers who need your skills.
            </p>
            <Button className="w-full" size="lg">
              Find Jobs
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onSelectType('employer')}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-accent/20 transition-colors">
              <BriefcaseIcon className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">I Need to Hire Workers</h3>
            <p className="text-muted-foreground">
              Post jobs and find skilled daily wage workers in your local area.
            </p>
            <Button variant="secondary" className="w-full" size="lg">
              Post Jobs
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}