import {
  isToday,
  isYesterday,
  format,
  isThisYear,
} from "date-fns";

/**
 * Formats a message timestamp for display beneath a message bubble.
 *
 * Today       → "02:33 PM"
 * Yesterday   → "Yesterday, 11:20 AM"
 * This year   → "12 Apr, 09:15 PM"
 * Older       → "12 Apr 2024, 09:15 PM"
 */
export const formatMessageTime = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const time = format(date, "hh:mm a");

  if (isToday(date)) return time;
  if (isYesterday(date)) return `Yesterday, ${time}`;
  if (isThisYear(date)) return format(date, "dd MMM, hh:mm a");
  return format(date, "dd MMM yyyy, hh:mm a");
};

/**
 * Returns a human-readable date label for grouping messages.
 *
 * Today       → "Today"
 * Yesterday   → "Yesterday"
 * This year   → "12 April"
 * Older       → "12 April 2024"
 */
export const getDateLabel = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisYear(date)) return format(date, "dd MMMM");
  return format(date, "dd MMMM yyyy");
};

/**
 * Checks whether two dates fall on different calendar days.
 * Used to decide when to render a date separator between messages.
 */
export const isDifferentDay = (
  a: string | Date | undefined,
  b: string | Date | undefined
): boolean => {
  if (!a || !b) return true;

  const dateA = new Date(a);
  const dateB = new Date(b);

  return (
    dateA.getFullYear() !== dateB.getFullYear() ||
    dateA.getMonth() !== dateB.getMonth() ||
    dateA.getDate() !== dateB.getDate()
  );
};

/**
 * Formats user lastSeen timestamp.
 */
export const formatLastSeen = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "Offline";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Offline";

  const time = format(date, "hh:mm a");

  if (isToday(date)) {
    return `Last seen today at ${time}`;
  }
  if (isYesterday(date)) {
    return `Last seen yesterday at ${time}`;
  }
  if (isThisYear(date)) {
    return `Last seen on ${format(date, "dd MMM")} at ${time}`;
  }
  return `Last seen on ${format(date, "dd MMM yyyy")} at ${time}`;
};

/**
 * Formats the timestamp for the conversation list item.
 */
export const formatConversationTime = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  if (isToday(date)) {
    return format(date, "hh:mm a");
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }
  if (isThisYear(date)) {
    return format(date, "dd MMM");
  }
  return format(date, "dd/MM/yy");
};


