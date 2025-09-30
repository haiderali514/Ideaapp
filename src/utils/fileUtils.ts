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
