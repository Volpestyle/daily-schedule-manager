import React from 'react';
import { HOUR_HEIGHT } from '.';

export const HourMarkers: React.FC = () => (
  <>
    {Array.from({ length: 24 }).map((_, i) => (
      <div key={i} className="absolute left-0 flex items-center text-sm text-gray-500" style={{ top: `${i * HOUR_HEIGHT}px` }}>
        <div className="w-12 text-right pr-2">{String(i).padStart(2, '0')}:00</div>
      </div>
    ))}
  </>
);
