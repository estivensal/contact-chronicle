import { loadLocations } from '../../lib/server-data';
import Navigation from '../components/Navigation';
import GeographicTimeline from '../components/GeographicTimeline';

export default async function GeographicPage() {
  const locations = await loadLocations();

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <main>
        <GeographicTimeline locations={locations} />
      </main>
    </div>
  );
}
