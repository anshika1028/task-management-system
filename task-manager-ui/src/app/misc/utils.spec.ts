describe('getTimeAgoString', () => {
  function getTimeAgoString(dateObj) {
    const now = new Date().getTime();
    const diffInMs = now - dateObj;
    const diffInSec = Math.round(diffInMs / 1000);
    const diffInMin = Math.round(diffInSec / 60);
    const diffInHour = Math.round(diffInMin / 60);
    const diffInDay = Math.round(diffInHour / 24);

    if (diffInDay > 0) {
      return `${diffInDay} day${diffInDay === 1 ? '' : 's'} ago`;
    } else if (diffInHour > 0) {
      return `${diffInHour} hour${diffInHour === 1 ? '' : 's'} ago`;
    } else if (diffInMin > 0) {
      return `${diffInMin} min${diffInMin === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  }

  it('should return "Just now" for a date object representing the current time', () => {
    const now = new Date();
    expect(getTimeAgoString(now)).toBe('Just now');
  });

  it('should return "1 min ago" for a date object 1 minute in the past', () => {
    const pastDate = new Date(Date.now() - 60 * 1000);
    expect(getTimeAgoString(pastDate)).toBe('1 min ago');
  });

  it('should return "5 mins ago" for a date object 5 minutes in the past', () => {
    const pastDate = new Date(Date.now() - 5 * 60 * 1000);
    expect(getTimeAgoString(pastDate)).toBe('5 mins ago');
  });

  it('should return "1 hour ago" for a date object 1 hour in the past', () => {
    const pastDate = new Date(Date.now() - 60 * 60 * 1000);
    expect(getTimeAgoString(pastDate)).toBe('1 hour ago');
  });

  it('should return "2 hours ago" for a date object 2 hours in the past', () => {
    const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(getTimeAgoString(pastDate)).toBe('2 hours ago');
  });

  it('should return "1 day ago" for a date object 1 day in the past', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(getTimeAgoString(pastDate)).toBe('1 day ago');
  });

  it('should return "3 days ago" for a date object 3 days in the past', () => {
    const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(getTimeAgoString(pastDate)).toBe('3 days ago');
  });
});
