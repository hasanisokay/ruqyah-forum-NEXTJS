function formatRelativeDate(targetDate) {
    const currentDate = new Date();
    const timeDifference = currentDate - targetDate;
  
    const seconds = Math.floor(timeDifference / 1000);
  
    if (seconds < 60) {
      return `${seconds}s`;
    }
  
    const minutes = Math.floor(seconds / 60);
  
    if (minutes < 60) {
      return `${minutes}m`;
    }
  
    const hours = Math.floor(minutes / 60);
  
    if (hours < 24) {
      return `${hours}h`;
    }
  
    const days = Math.floor(hours / 24);
  
    if (days <= 6) {
      return `${days}d`;
    }
  
    if (days <= 28) {
      const weeks = Math.floor(days / 7);
      return `${weeks}w`;
    }
  
    if (days <= 365) {
      const months = Math.floor(days / 30);
      return `${months}mo`;
    }
  
    const years = Math.floor(days / 365);
    return `${years}y`;
  }
  
export default formatRelativeDate;