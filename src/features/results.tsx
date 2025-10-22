import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { abbr, bioDataType } from '@/data/schemas';
import { bioMarkersQueryOptions } from '@/utils/bioMarkers';

const ResultsComponent = () => {
  const biomarkersQuery = useSuspenseQuery(bioMarkersQueryOptions());
  const navigate = useNavigate();

  const dataMatrix: Map<string, Map<string, string>> = new Map();

  biomarkersQuery.data?.forEach((bio: bioDataType) => {
    const dataMap: Map<string, string> = new Map();
    Object.values(abbr).forEach((key) => {
      dataMap.set(
        key,
        `${bio[key as keyof bioDataType].toString()} ${bio[`${key}_unit` as keyof bioDataType].toString()}`,
      );
    });
    dataMatrix.set(bio.date_testing, dataMap);
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <header className="px-4 py-3 ">
        <h2 className="font-semibold text-slate-900">Results</h2>
      </header>

      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl">
        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-[13px] text-white">
                <tr>
                  <th className="px-5 py-2 pl-3 bg-slate-800 rounded-l sticky left-0">
                    <div className="font-medium text-left">Biomarker</div>
                  </th>
                  {Array.from(dataMatrix.keys()).map((key) => (
                    <th key={key} className="px-5 py-2 last:pr-3 bg-slate-800 last:rounded-r">
                      <div className="font-medium text-left">{dayjs(key).format('DD/MM/YYYY')}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {Object.keys(abbr).map((key) => {
                  return (
                    <tr
                      className={`cursor-pointer group hover:bg-slate-100`}
                      key={key}
                      onClick={() =>
                        navigate({
                          to: '/biomarker',
                          search: { selected: key },
                        })
                      }
                    >
                      <td className={`px-5 py-3 border-b border-slate-200 pl-3 sticky left-0 capitalize bg-slate-100`}>
                        <div className="text-slate-500">{abbr[key as keyof typeof abbr].replace('_', ' ')}</div>
                      </td>

                      {Array.from(dataMatrix.entries()).map(([_, value], index) => {
                        return (
                          <td key={index} className={`px-5 py-3 border-b border-slate-200 last:pr-3 `}>
                            {value.get(abbr[key as keyof typeof abbr])}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;
