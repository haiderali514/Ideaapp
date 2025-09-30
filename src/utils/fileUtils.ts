/**
 * Converts a File object to a base64 encoded string.
 * This is useful for embedding file data directly into API requests.
 * @param file The File object to convert.
 * @returns A Promise that resolves with the base64 encoded string (without the data: URL prefix).
 */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // The result includes the Base64 prefix (e.g., "data:image/png;base64,"),
      // which we need to remove before sending to the API.
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });

/**
 * Formats a file size in bytes into a human-readable string (KB, MB, GB).
 * @param bytes The file size in bytes.
 * @param decimals The number of decimal places to display.
 * @returns A formatted string representing the file size.
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
