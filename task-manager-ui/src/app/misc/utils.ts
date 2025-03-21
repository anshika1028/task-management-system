export function getTimeAgoString(dateObj?: string | Date) {
  /**
   * Calculates the time difference between a given date object and the current time,
   * and returns a string in the format "x days/hours/mins ago".
   *
   * @param {Date} dateObj - The date object to calculate from.
   * @returns {string} - A string representing the time difference.
   */

  if (!dateObj) {
    return '-';
  }

  const now = new Date().getTime();
  const diffInMs = now - new Date(dateObj).getTime();
  const diffInSec = Math.round(diffInMs / 1000);
  const diffInMin = Math.round(diffInSec / 60);
  const diffInHour = Math.round(diffInMin / 60);
  const diffInDay = Math.round(diffInHour / 24);
  const diffInMonth = Math.round(diffInDay / 30);
  const diffInYear = Math.round(diffInMonth / 12);

  if(diffInYear > 0) {
    return `${diffInYear} year${diffInYear === 1 ? '' : 's'} ago`;
  } else if (diffInMonth > 0) {
    return `${diffInMonth} month${diffInMonth === 1 ? '' : 's'} ago`;
  } else if (diffInDay > 0) {
    return `${diffInDay} day${diffInDay === 1 ? '' : 's'} ago`;
  } else if (diffInHour > 0) {
    return `${diffInHour} hour${diffInHour === 1 ? '' : 's'} ago`;
  } else if (diffInMin > 0) {
    return `${diffInMin} min${diffInMin === 1 ? '' : 's'} ago`;
  } else {
    return 'Just now';
  }
}
