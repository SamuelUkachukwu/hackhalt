// Import the createMember function from the other file
import { createMember } from './your-file-name.js';

// Call the createMember function when needed, e.g., when the profile.html page loads
document.addEventListener('DOMContentLoaded', () => {
  // Get the memberId from the URL search parameters
  const urlParams = new URLSearchParams(window.location.search);
  const memberId = urlParams.get('memberId');

  // Use the memberId as needed in your profile.js file
  console.log('Member ID:', memberId);
  // You can perform additional actions based on the memberId
});
