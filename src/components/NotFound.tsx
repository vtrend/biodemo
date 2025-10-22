import { useNavigate } from '@tanstack/react-router';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl my-4  text-center pb-4">
        <div className="flex">
          <button
            type="button"
            className="pl-4 pt-3 cursor-pointer w-fit text-sm text-gray-500 hover:text-gray-700 hover:underline"
            onClick={() => navigate({ to: '/' })}
          >
            Back to results
          </button>
        </div>
        <div className="text-2xl  mt-4">Page not found</div>
        <div className="text-sm text-gray-500">The page you are looking for does not exist.</div>
      </div>
    </div>
  );
};
export default NotFound;
