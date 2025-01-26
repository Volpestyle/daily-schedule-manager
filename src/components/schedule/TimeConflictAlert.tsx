import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { TimeConflict } from '@/types/schedule';

interface TimeConflictAlertProps {
  conflicts: TimeConflict[];
}

const TimeConflictAlert: React.FC<TimeConflictAlertProps> = ({ conflicts }) => {
  if (conflicts.length === 0) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Time conflicts detected:
        {conflicts.map((conflict, i) => (
          <div key={i} className="text-sm">
            {conflict.activity1} ({conflict.time1}) overlaps with{' '}
            {conflict.activity2} ({conflict.time2})
          </div>
        ))}
      </AlertDescription>
    </Alert>
  );
};

export default TimeConflictAlert;
