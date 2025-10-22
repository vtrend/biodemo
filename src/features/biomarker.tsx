import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import dayjs from 'dayjs';

import Chart from '@/components/Chart';
import ChartWithRanges from '@/components/ChartWithRanges';
import { ranges } from '@/data/const';
import { abbr, schema } from '@/data/schemas';
import { bioMarkersQueryOptions } from '@/utils/bioMarkers';

const BiomarkerComponent = () => {
  const biomarkersQuery = useSuspenseQuery(bioMarkersQueryOptions());
  const { selected } = useSearch({ from: '/biomarker' });
  const navigate = useNavigate();

  const parsedData = schema.safeParse(biomarkersQuery);
  if (!parsedData.success) {
    throw new Error(parsedData.error.message);
  }

  const bioData = parsedData.data;

  bioData.sort((a, b) => dayjs(a.date_testing).diff(dayjs(b.date_testing)));

  const selectedData = bioData.map((data) => {
    const selectedValue = data[abbr[selected as keyof typeof abbr]];
    const selectedUnit = data[`${abbr[selected as keyof typeof abbr]}_unit` as keyof typeof data] as string;
    return {
      value: selectedValue,
      unit: selectedUnit,
      date: data.date_testing,
    };
  });

  const selectedBiomarker = abbr[selected].replace('_', ' ');

  const rangesZones = ranges[abbr[selected]] || [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl my-4  text-center">
        <div className="flex">
          <button
            type="button"
            className="pl-4 pt-3 cursor-pointer w-fit text-sm text-gray-500 hover:text-gray-700 hover:underline"
            onClick={() => navigate({ to: '/' })}
          >
            Back to results
          </button>
        </div>
        <div className="inline-flex rounded-md shadow-sm mt-4" role="group">
          {Object.keys(abbr).map((key, index) => {
            const isSelected = selected === key;
            const isFirst = index === 0;
            const isLast = index === Object.keys(abbr).length - 1;
            const borderClasses = isFirst ? 'rounded-s-lg ' : isLast ? 'rounded-e-lg ' : 'border-t border-b';

            const selectedClasses = isSelected ? 'underline' : '';

            return (
              <button
                key={key}
                onClick={() => navigate({ to: '/biomarker', search: { selected: key } })}
                type="button"
                className={`bg-gray-800 text-white text-sm px-4 py-2 border border-gray-700 ${borderClasses} ${selectedClasses} hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white capitalize`}
              >
                {abbr[key].replace('_', ' ')}
              </button>
            );
          })}
        </div>

        <header className="px-4 py-3 border-b border-slate-200 flex flex-col ">
          <h2 className="flex flex-col justify-center font-semibold text-slate-900 capitalize">{selectedBiomarker}</h2>
          <div className="text-sm text-gray-500">
            Latest result:
            {dayjs(selectedData[selectedData.length - 1].date).format('DD/MM/YYYY')}
          </div>
        </header>

        <Chart bioData={selectedData} selectedBiomarker={selectedBiomarker} />
      </div>

      {rangesZones.length > 0 && (
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl my-4  text-center">
          <ChartWithRanges bioData={selectedData} selectedBiomarker={selectedBiomarker} rangesZones={rangesZones} />
        </div>
      )}
    </div>
  );
};

export default BiomarkerComponent;
