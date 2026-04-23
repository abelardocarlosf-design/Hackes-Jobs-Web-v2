import fs from 'fs';
import path from 'path';
import { JobVacancy } from './jobs.types';

export * from './jobs.types';

const JOBS_DATA_PATH = path.join(process.cwd(), 'data/jobs');

// Ensure directory exists
if (!fs.existsSync(JOBS_DATA_PATH)) {
  fs.mkdirSync(JOBS_DATA_PATH, { recursive: true });
}

export async function getAllJobs(): Promise<JobVacancy[]> {
  if (!fs.existsSync(JOBS_DATA_PATH)) return [];
  const files = fs.readdirSync(JOBS_DATA_PATH);
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => JSON.parse(fs.readFileSync(path.join(JOBS_DATA_PATH, file), 'utf8')))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function saveJob(job: JobVacancy): Promise<void> {
  const filePath = path.join(JOBS_DATA_PATH, `${job.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(job, null, 2), 'utf8');
}

export async function deleteJob(id: string): Promise<void> {
  const filePath = path.join(JOBS_DATA_PATH, `${id}.json`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
