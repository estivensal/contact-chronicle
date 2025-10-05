import { loadEmploymentMilestones } from '../../lib/server-data';
import Navigation from '../components/Navigation';
import MyTimeline from '../components/MyTimeline';

export default async function TimelinePage() {
  const employmentMilestones = await loadEmploymentMilestones();

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <main>
        <MyTimeline employmentMilestones={employmentMilestones} />
      </main>
    </div>
  );
}
