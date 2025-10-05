// Server-only data loading functions
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { Connection, Location, EmploymentMilestone } from "./data";

const CONNECTIONS_FILE = path.join(process.cwd(), "app/data/connections.csv");
const LOCATIONS_FILE = path.join(process.cwd(), "app/data/locations.csv");
const EMPLOYMENT_MILESTONES_FILE = path.join(
  process.cwd(),
  "app/data/employment_milestones.csv"
);

export async function loadConnections(): Promise<Connection[]> {
  const fileContent = fs.readFileSync(CONNECTIONS_FILE, "utf8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as Connection[];
  return records;
}

export async function loadLocations(): Promise<Location[]> {
  const fileContent = fs.readFileSync(LOCATIONS_FILE, "utf8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as any[];
  // Coerce lat/lng from CSV strings to numbers when present
  const withCoords: Location[] = records.map((r) => ({
    city: r.city,
    state: r.state,
    start_date: r.start_date,
    end_date: r.end_date,
    lat: r.lat !== undefined && r.lat !== "" ? Number(r.lat) : undefined,
    lng: r.lng !== undefined && r.lng !== "" ? Number(r.lng) : undefined,
  }));
  return withCoords;
}

export async function loadEmploymentMilestones(): Promise<
  EmploymentMilestone[]
> {
  const fileContent = fs.readFileSync(EMPLOYMENT_MILESTONES_FILE, "utf8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as EmploymentMilestone[];
  return records;
}
