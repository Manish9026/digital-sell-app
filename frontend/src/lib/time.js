export const formatRelativeTime = (input)=> {
  const inputDate = typeof input === "string" ? new Date(input) : input;
  if (isNaN(inputDate.getTime())) return "Invalid date";

  const now = Date.now();
  const diffSeconds = Math.floor((now - inputDate.getTime()) / 1000);

  if (diffSeconds < 60) return "Just now";

  // Define units in seconds with labels
  const units = [
    { label: "y", seconds: 365 * 24 * 60 * 60 },
    { label: "mo", seconds: 30 * 24 * 60 * 60 },
    { label: "w", seconds: 7 * 24 * 60 * 60 },
    { label: "d", seconds: 24 * 60 * 60 },
    { label: "h", seconds: 60 * 60 },
    { label: "m", seconds: 60 },
  ];

  for (const unit of units) {
    const amount = Math.floor(diffSeconds / unit.seconds);
    if (amount >= 1) {
      return `${amount}${unit.label}`;
    }
  }

  return "Just now"; // fallback (shouldn't reach here)
};
