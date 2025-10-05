// Client-safe data types and utility functions
export interface Connection {
  first_name: string;
  last_name: string;
  url: string;
  email_address: string;
  company: string;
  position: string;
  connected_on: string;
}

export interface Location {
  city: string;
  state: string;
  start_date: string;
  end_date: string;
  lat?: number;
  lng?: number;
}

export interface EmploymentMilestone {
  company: string;
  position: string;
  city: string;
  state: string;
  start_date: string;
  end_date: string;
}

export interface ConnectionStats {
  totalContacts: number;
  avgMonthly: number;
  peakMonth: string;
  peakCount: number;
  activityPercentage: number;
}

export interface MonthlyData {
  month: string;
  year: number;
  monthNumber: number;
  count: number;
}

export function getConnectionStats(connections: Connection[]): ConnectionStats {
  if (connections.length === 0) {
    return {
      totalContacts: 0,
      avgMonthly: 0,
      peakMonth: "",
      peakCount: 0,
      activityPercentage: 0,
    };
  }

  const monthlyData = getMonthlyConnectionData(connections);
  const totalContacts = connections.length;
  const avgMonthly =
    monthlyData.length > 0 ? totalContacts / monthlyData.length : 0;

  const peakMonthData = monthlyData.reduce(
    (peak, current) => (current.count > peak.count ? current : peak),
    { count: 0, month: "" }
  );

  const activeMonths = monthlyData.filter((month) => month.count > 0).length;
  const activityPercentage =
    monthlyData.length > 0
      ? Math.round((activeMonths / monthlyData.length) * 100)
      : 0;

  return {
    totalContacts,
    avgMonthly: Math.round(avgMonthly * 10) / 10,
    peakMonth: peakMonthData.month,
    peakCount: peakMonthData.count,
    activityPercentage,
  };
}

export function getMonthlyConnectionData(
  connections: Connection[]
): MonthlyData[] {
  const monthlyCounts: { [key: string]: number } = {};

  connections.forEach((connection) => {
    const date = new Date(connection.connected_on);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthlyCounts)
    .map(([month, count]) => {
      const [year, monthNum] = month.split("-");
      return {
        month,
        year: parseInt(year),
        monthNumber: parseInt(monthNum),
        count,
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthNumber - b.monthNumber;
    });
}

export function getConnectionsByLocation(
  connections: Connection[],
  locations: Location[],
  targetLocation: string
): Connection[] {
  const location = locations.find((loc) => loc.city === targetLocation);
  if (!location) return connections;

  const startDate = new Date(location.start_date);
  const endDate = location.end_date ? new Date(location.end_date) : new Date();

  return connections.filter((connection) => {
    const connectionDate = new Date(connection.connected_on);
    return connectionDate >= startDate && connectionDate <= endDate;
  });
}

export function getEmploymentMilestonesByDateRange(
  milestones: EmploymentMilestone[],
  startDate?: string,
  endDate?: string
): EmploymentMilestone[] {
  let filtered = milestones;

  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter(
      (milestone) => new Date(milestone.start_date) >= start
    );
  }

  if (endDate) {
    const end = new Date(endDate);
    filtered = filtered.filter(
      (milestone) => new Date(milestone.start_date) <= end
    );
  }

  return filtered.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
}
