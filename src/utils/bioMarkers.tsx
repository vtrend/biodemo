import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const API_URL = 'https://mockapi-furw4tenlq-ez.a.run.app';

import dayjs from 'dayjs';
import { bioDataType } from '@/data/schemas';

export const bioMarkersQueryOptions = () =>
  queryOptions({
    queryKey: ['biomarkers'],
    queryFn: () =>
      axios
        .get<Array<bioDataType>>(`${API_URL}/data`)
        .then((r) => r.data)
        .then((data) => {
          return data.sort((a, b) => dayjs(a.date_testing).diff(dayjs(b.date_testing)));
        })
        .catch(() => {
          throw new Error('Failed to fetch biomarkers');
        }),
  });
