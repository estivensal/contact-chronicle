import { loadConnections, loadLocations } from '../lib/server-data';
import { getConnectionStats, getMonthlyConnectionData } from '../lib/data';
import Navigation from './components/Navigation';
import ViewChronicle from './components/ViewChronicle';

export default async function Home() {
  const connections = await loadConnections();
  const locations = await loadLocations();
  const stats = getConnectionStats(connections);
  const monthlyData = getMonthlyConnectionData(connections);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <main>
        <ViewChronicle
          connections={connections}
          locations={locations}
          stats={stats}
          monthlyData={monthlyData}
        />
      </main>
    </div>
  );
}
