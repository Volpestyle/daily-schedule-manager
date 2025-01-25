import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/SettingsContext";

export const SettingsToggle = () => {
  const { use24Hour, toggleTimeFormat } = useSettings();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="time-format"
        checked={use24Hour}
        onCheckedChange={toggleTimeFormat}
      />
      <Label htmlFor="time-format">
        Use 24-hour format ({use24Hour ? "23:59" : "11:59 PM"})
      </Label>
    </div>
  );
};
export const SettingsMenu = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <SettingsToggle />
          {/* Add other settings here */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
