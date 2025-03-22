export const extractIndicators = (details: any): Record<string, string> => {
  const detailsString = typeof details === "string" ? details : JSON.stringify(details); // Ensure it's a string
  // const detailsString = JSON.stringify(details); // Convert to a string for regex processing

  // Use regex to find all indicators
  const matches = detailsString.match(/\*\|([^|]+)\|\*/g);
  const result = matches
    ?.map(match => match.replace(/\*\||\|\*/g, "").split("="))
    .reduce((acc, split) => {
      const key = split[0]; // First part of the split
      const value = split[1] ?? ""; // Second part of the split or empty string if undefined
      acc[key] = value; // Add the key-value pair to the accumulator object
      return acc;
    }, {} as Record<string, string>); // Initialize as an empty object
  // console.log(result);
  // Extract and return the indicator values (removing *| and |*)
  return result ?? {};
};

export const parseDetailsWithHighlights = (details: any): React.ReactNode => {
  if (!details || typeof details !== "string") {
    return JSON.stringify(details, null, 2); // Fallback for non-string details
  }

  // Regex to find all indicators like *|KEY=VALUE|*
  const regex = /\*\|([^|]+)\|\*/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  details.replace(regex, (match, content, offset) => {
    // Add text before the indicator
    if (offset > lastIndex) {
      parts.push(details.slice(lastIndex, offset));
    }

    // Extract key and optionally default value
    const [key, value] = content.split("=");

    // Highlight the extracted value
    parts.push(
      <span key={offset} className="text-red-500 font-semibold text-xl">
        {key}
      </span>
    );

    lastIndex = offset + match.length;
    return ""; // Return nothing to continue regex processing
  });

  // Add remaining text after the last indicator
  if (lastIndex < details.length) {
    parts.push(details.slice(lastIndex));
  }

  return parts;
};
