/**
 * Apply a unified diff patch to the original content.
 * Note: This is a simplified implementation and assumes the diffs
 * are straightforward and do not contain complex conflict resolutions.
 * @param {string} originalContent - The original content of the file.
 * @param {string} patchContent - The unified diff patch content.
 * @returns {string} - The new content with the patch applied.
 */
export function applyPatch(originalContent, patchContent) {
  const originalLines = originalContent.split("\n");
  const patchLines = patchContent.split("\n");
  let newContent = [...originalLines];
  let offset = 0;

  for (const line of patchLines) {
    if (line.startsWith("@@")) {
      // Example line: @@ -1,7 +1,7 @@
      // This regex extracts '1' from the starting position of the change in the original file
      const lineNumMatch = line.match(/\\-(\\d+),\\d+ \\+/);
      if (lineNumMatch && lineNumMatch.length > 1) {
        offset = parseInt(lineNumMatch[1], 10) - 1; // Adjust for zero-based index
      }
    } else if (line.startsWith("-")) {
      newContent.splice(offset, 1); // Remove line at current offset
    } else if (line.startsWith("+")) {
      newContent.splice(offset, 0, line.substring(1)); // Add new line at current offset
      offset++;
    } else if (line.startsWith(" ")) {
      offset++; // Unchanged line, move to next
    }
  }

  return newContent.join("\n");
}
