import React from 'react';
import { Button } from '@/components/ui/button';
import { MoveUp, MoveDown } from 'lucide-react';

interface TimelineScrollButtonsProps {
  showTopButton: boolean;
  showBottomButton: boolean;
  onScroll: () => void;
}

export const TimelineScrollButtons: React.FC<TimelineScrollButtonsProps> = ({
  showTopButton,
  showBottomButton,
  onScroll,
}) => {
  return (
    <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
      {showTopButton && (
        <Button
          variant="outline"
          size="icon"
          className="opacity-80 hover:opacity-100 transition-opacity"
          onClick={onScroll}
          title="Scroll to first activity"
        >
          <MoveUp className="h-4 w-4" />
        </Button>
      )}
      {showBottomButton && (
        <Button
          variant="outline"
          size="icon"
          className="opacity-80 hover:opacity-100 transition-opacity"
          onClick={onScroll}
          title="Scroll to first activity"
        >
          <MoveDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
