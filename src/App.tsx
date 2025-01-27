import InteractiveSchedule from './components/schedule/InteractiveSchedule';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-background p-8">
        <InteractiveSchedule />
      </div>
    </SettingsProvider>
  );
}

export default App;
