function truncateText(text, maxLength =200) {
  if (text?.length <= maxLength) {
    return text;
  }

  const lastSpaceIndex = text?.lastIndexOf(' ', maxLength);
  const truncatedText = lastSpaceIndex !== -1 ? text?.substring(0, lastSpaceIndex) : text?.substring(0, maxLength);

  return truncatedText;
}
export default truncateText;