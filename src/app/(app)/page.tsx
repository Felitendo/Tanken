import { APP_SHELL } from '@/app/(app)/shell';

export default function HomePage() {
  return <main dangerouslySetInnerHTML={{ __html: APP_SHELL }} />;
}
