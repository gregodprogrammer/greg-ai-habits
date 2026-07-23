import { Spinner } from '@/shared/ui/spinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size={32} />
    </div>
  );
}
