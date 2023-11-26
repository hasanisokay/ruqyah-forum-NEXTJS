export default function formatDateInAdmin(date) {
    // Array of month names
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Determine if it's AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;
  
    // Construct the formatted string
    const formattedDate = `${day}, ${month}, ${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  
    return formattedDate;
  }