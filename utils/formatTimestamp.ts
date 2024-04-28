export const formatTimestamp = (seconds: number): string => {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}.${month}.${year}`;
};
