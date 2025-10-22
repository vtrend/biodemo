import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent, useNavigate, useRouter } from '@tanstack/react-router';

const DefaultCatchBoundary = ({ error }: ErrorComponentProps) => {
  const navigate = useNavigate();
  const router = useRouter();

  console.error(error);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* <ErrorComponent error={error} />  DO NOT SHOW IN PROD */}
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl my-4  text-center pb-4">
        <div className="flex">
          <button
            type="button"
            className="pl-4 pt-3 cursor-pointer w-fit text-sm text-gray-500 hover:text-gray-700 hover:underline"
            onClick={() => navigate({ to: '/' })}
          >
            Back to results
          </button>

          <button
            type="button"
            className="pl-4 pt-3 cursor-pointer w-fit text-sm text-gray-500 hover:text-gray-700 hover:underline"
            onClick={() => router.invalidate()}
          >
            Try Again
          </button>
        </div>
        <div className="text-sm text-gray-500">An error occurred while loading the page.</div>
      </div>
    </div>
  );
};

export default DefaultCatchBoundary;
