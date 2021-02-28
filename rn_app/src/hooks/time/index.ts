import {useMemo} from 'react';

type TimeDiffProps = {
  timestamp: string;
};

export const useTimeDiff = ({timestamp}: TimeDiffProps) => {
  return useMemo(() => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diff = now.getTime() - createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
  }, [timestamp]);
};
