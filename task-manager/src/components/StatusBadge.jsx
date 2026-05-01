import { Badge } from './Badge.jsx';

export function StatusBadge({ status }) {
  if (status === 'Done') return <Badge color="green">Done</Badge>;
  if (status === 'In Progress') return <Badge color="blue">In Progress</Badge>;
  return <Badge color="gray">To Do</Badge>;
}
