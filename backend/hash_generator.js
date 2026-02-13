// hash_generator.js
// If your backend uses 'bcrypt'
import bcrypt from "bcrypt"; 

// If your backend uses 'bcryptjs' (current script)
import bcrypt from "bcryptjs"; // Change to 'bcrypt' if that's what you installed

// The script runs inside an immediately invoked async function
async function generateHash() {
  const newPassword = "MyTempAdminPass123"; // ⭐ Use your temporary password here
  const saltRounds = 10; // ⭐ Ensure this matches your backend's salt rounds (usually 10)

  try {
    console.log(`Generating hash for password: ${newPassword}`);

    // bcrypt.hash returns a Promise in an ESM environment
    const hash = await bcrypt.hash(newPassword, saltRounds);

    console.log("\n-------------------------------------------------");
    console.log("SUCCESS! PASTE THIS HASH INTO YOUR MONGODB:");
    console.log(hash);
    console.log("-------------------------------------------------");
  } catch (error) {
    console.error(
      "Error generating hash. Check if bcryptjs is installed:",
      error
    );
  }
}

generateHash();
