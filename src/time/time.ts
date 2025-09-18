type RelativeTimeUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';

export function timeAgo(input: Date | string) {
  const date = new Date(input);
  const formatter = new Intl.RelativeTimeFormat('en');

  const ranges: Record<RelativeTimeUnit, number> = {
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    months: 3600 * 24 * 30,
    seconds: 1,
    weeks: 3600 * 24 * 7,
    years: 3600 * 24 * 365,
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (const key of Object.keys(ranges) as RelativeTimeUnit[]) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];

      return formatter.format(Math.round(delta), key);
    }
  }

  return 'Just now';
}

export const oneWeekFromNow = () => {
  const now = new Date();

  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
};

export const oneDayFromNow = () => {
  const now = new Date();

  return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
};

export const oneMinuteFromNow = () => {
  const now = new Date();

  return new Date(now.getTime() + 1 * 60 * 1000);
};

export function friendlyDuration(minutes: number | null, locale: string, short = false) {
  const numberFormatter = new Intl.NumberFormat(locale);

  if (!minutes) {
    return null;
  }

  if (short) {
    // Short format, e.g., 70' for minutes or 2h 30' for hours and minutes
    if (minutes > 120) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (remainingMinutes > 0) {
        return {
          key: 'common:duration.hoursAndMinutesShort',
          vars: {
            hours: numberFormatter.format(hours),
            minutes: numberFormatter.format(remainingMinutes),
          },
        };
      }
      return {
        key: 'common:duration.hoursShort',
        vars: { hours: numberFormatter.format(hours) },
      };
    }

    return {
      key: 'common:duration.minutesShort',
      vars: { minutes: numberFormatter.format(minutes) },
    };
  }

  // Long format (localized with pluralization)
  if (minutes >= 525600) {
    const years = Math.floor(minutes / 525600);
    return {
      key: 'common:duration.years',
      vars: {
        count: years,
        value: numberFormatter.format(years),
      },
    };
  }

  if (minutes >= 43200) {
    const months = Math.floor(minutes / 43200);
    return {
      key: 'common:duration.months',
      vars: {
        count: months,
        value: numberFormatter.format(months),
      },
    };
  }

  if (minutes >= 10080) {
    const weeks = Math.floor(minutes / 10080);
    return {
      key: 'common:duration.weeks',
      vars: {
        count: weeks,
        value: numberFormatter.format(weeks),
      },
    };
  }

  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    return {
      key: 'common:duration.days',
      vars: {
        count: days,
        value: numberFormatter.format(days),
      },
    };
  }

  if (minutes >= 240) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes > 0) {
      return {
        key: 'common:duration.hoursAndMinutes',
        vars: {
          hours: numberFormatter.format(hours),
          minutes: numberFormatter.format(remainingMinutes),
        },
      };
    }
    return {
      key: 'common:duration.hours',
      vars: {
        count: hours,
        value: numberFormatter.format(hours),
      },
    };
  }

  return {
    key: 'common:duration.minutes',
    vars: {
      count: minutes,
      value: numberFormatter.format(minutes),
    },
  };
}

export const dateTimeInUnix = (date: number) => {
  return Math.floor(date / 1000);
};
