import { listAll, StorageReference, updateMetadata } from "firebase/storage";

async function updateMetadataRecursive(
  storageRef: StorageReference
): Promise<void> {
  try {
    // List items (files and prefixes/folders) at the current level
    const listResult = await listAll(storageRef);

    // Process files at the current level
    for (const itemRef of listResult.items) {
      console.log(`Updating metadata for file: ${itemRef.fullPath}`);
      try {
        const newMetadata = {
          cacheControl: "public, max-age=31536000", // Example: Cache for 1 year
        };
        await updateMetadata(itemRef, newMetadata);
        console.log(`Successfully updated metadata for ${itemRef.fullPath}`);
      } catch (updateError) {
        console.error(
          `Failed to update metadata for ${itemRef.fullPath}:`,
          updateError
        );
        // Decide if you want to continue or stop on error
      }
    }

    // Recurse into prefixes (subfolders)
    for (const prefixRef of listResult.prefixes) {
      console.log(`Exploring subfolder: ${prefixRef.fullPath}`);
      await updateMetadataRecursive(prefixRef); // Recursive call!
    }
  } catch (listError) {
    console.error(`Error listing items in ${storageRef.fullPath}:`, listError);
    // Handle the error (e.g., permissions issues)
  }
}

// Start the process from the 'images' folder
// updateMetadataRecursive(imagesRef)
//   .then(() => {
//     console.log("Metadata update process completed (or encountered errors).");
//   })
//   .catch((overallError) => {
//     console.error(
//       "An unexpected error occurred during the recursive process:",
//       overallError
//     );
//   });
export default updateMetadataRecursive;
