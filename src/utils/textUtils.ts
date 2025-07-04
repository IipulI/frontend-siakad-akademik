import { convertFromRaw } from "draft-js";

/**
 * Extracts plain text from a Draft.js JSON string and truncates it.
 * @param content - The JSON string from the API's 'isi' field.
 * @param maxLength - The maximum length of the desired summary.
 * @returns A truncated plain-text string.
 */
export const getPlainTextSummary = (content: string, maxLength: number): string => {
    if (!content) return "";

    try {
        // Parse the JSON string into a Draft.js content object
        const contentState = convertFromRaw(JSON.parse(content));
        // Get the plain text from the content state
        const plainText = contentState.getPlainText(' '); // Use a space to join blocks

        // Truncate the text if it's too long
        if (plainText.length > maxLength) {
            return plainText.substring(0, maxLength) + "...";
        }
        return plainText;
    } catch (e) {
        // If parsing fails, it's probably already plain text.
        if (content.length > maxLength) {
            return content.substring(0, maxLength) + "...";
        }
        return content;
    }
};