"use client";

import Navbar from "@components/Navbar/Navbar"
import Footer from "@components/Footer/Footer"

/**
 * Password for resetting tokens - should be kept secure
 * @constant {string}
 */
const RESET_PASSWORD = "sample-reset-password";

/**
 * Token Clear Page Component
 * Provides functionality to reset all generated tokens with password protection
 * @returns {JSX.Element} The token clear page component
 */
const page = () => {
  /**
   * Handles the token reset process with password verification
   * @async
   */
  const reset = async () => {
    // Initial confirmation
    const userConfirmed = window.confirm("Are you sure you want to reset?");
    if (!userConfirmed) return;

    // Password verification
    const password = window.prompt("Please enter the reset password:");
    if (!password) {
      alert("Reset cancelled.");
      return;
    }

    if (password !== RESET_PASSWORD) {
      alert("Incorrect password!");
      return;
    }

    // Perform reset
    try {
      const response = await fetch('/api/resetToken', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error resetting:', error);
      alert('An error occurred while resetting.');
    }
  };

  return (
    <main>
      <div className="grid place-items-center h-screen p-5">
        <h1 className="title">
          You're About to reset all the tokens generated so far.
          <br/>
          <button 
            className="button" 
            style={{background: "red"}} 
            onClick={reset}
          >
            Reset
          </button>
        </h1>
      </div>
    </main>
  )
}

export default page;




