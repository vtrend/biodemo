import { createFileRoute } from '@tanstack/react-router';
import ResultsComponent from '@/features/results';
import { bioMarkersQueryOptions } from '@/utils/bioMarkers';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(bioMarkersQueryOptions());
  },
  component: ResultsComponent,
});
