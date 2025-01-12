"use client";
import { useState, useEffect } from "react";
// import { Preview, print } from '@pdfMaker/dist/index';
// Check if window is defined (client side)
const isClient = typeof window !== 'undefined';

// Import functions only on the client side
let Preview1, print1;
if (isClient) {
  const {Preview,print} = require('@pdfMaker/dist/index');
  Preview1 = Preview;
  print1 = print;
}

/**
 * Card component for displaying actions
 * @param {Object} props - Component properties
 * @param {string} props.heading - Card heading
 * @param {string} props.description - Card description
 * @param {string} props.link - Navigation link
 * @param {string} props.className - Additional CSS classes
 */
function Card1({ heading, description, link, className }) {
  // ...existing code...
}

/**
 * Generator Form Component
 * Handles additional token generation for registered schools
 */
const Form = () => {
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState([]);
  const [start,setStart] = useState('');
  const [end,setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [printer,setPrinter] = useState(false)

  
  useEffect(() => {
    getInfo();
  }, [])

  useEffect(() => {
    if(printer){
      handlePrint();
      setPrinter(false);
    }
  }, [printer]);

  async function handlePrint(){
    print1('S2T-Token-Additional', 'jsx-template');
  }
  function getInfo() {
    const currentTime = new Date().toISOString();
    fetch(`/api/fetchOptions?currentTime=${encodeURIComponent(currentTime)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.message && data.message.length > 0) {
          // setEvents(data.message);
          setOptions(data.message);
          console.log(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  /**
   * Handles form submission for token generation
   * @param {Event} event - Form submission event
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    const formData = {
      // Retrieve form data from the input fields
      name: event.target.name.value,
      studentCount: event.target.studentCount.value,
    };

    try {
      // Assuming the /api/generateToken API route is already set up
      const generateTokenResponse = await fetch('/api/addToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (generateTokenResponse.ok) {
        const generateTokenData = await generateTokenResponse.json();
        setMessage(generateTokenData.message);
        event.target.reset();
        if (generateTokenData.message.includes("Details created successfully")) {
          setStart(generateTokenData.start);
          setEnd(generateTokenData.end);
          setPrinter(true);
        }
      } else {
        const generateTokenData = await generateTokenResponse.json();
        setMessage(generateTokenData.message);
        console.error('Failed to generate token');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading state back to false regardless of success or failure
    }
  }


  return (
    <main className="main">
      <span className="title">Supplementary Form</span>
      <form className="form" onSubmit={handleSubmit}>
        <label className="label" htmlFor="name">
          Name of the School<span className="required">*</span>
        </label>
        <input
          className="input"
          type="text"
          name="name"
          list="schools"
          id="name"
          required
        />
        <datalist id="schools">
          {options.map((option) => (
            <option>{option.name}</option>
          ))}
        </datalist>
        <label className="label" htmlFor="studentCount">
          Student Count<span className="required">*</span>
        </label>
        <input
          className="input"
          type="number"
          name="studentCount"
          id="studentCount"
          min={0}
          required
        />

        <button
          id="submit-btn"
          className="button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message != "" && (
        <div
          className={`response-box ${
            message.includes("No School Found.") ||
            message.includes("School already registered.")
              ? "red-box"
              : "green-box"
          }`}
        >
          {message}
        </div>
      )}

      {message.includes("Details created successfully") && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
            padding: "20px",
          }}
        >
          <Preview1 id={"jsx-template"}>
            <div
              style={{
                width: "350px",
                border: "2px solid #000000",
                borderRadius: "8px",
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {/* Navbar */}
              <div
                style={{
                  display: "flex",
                  overflow: "hidden",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid #ccc",
                  backgroundColor: "#0b4685",
                  padding: "10px",
                }}
              >
                <img
                  src="/image/sairam_logo.svg"
                  style={{ height: "35px" }}
                  alt="Sairam Logo"
                />
                <img
                  src="/image/s2t_5.0.png"
                  style={{ height: "35px" }}
                  alt="S2T Logo"
                />
              </div>

              {/* Counts */}
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ color: "#666", margin: "0" }}>Student Count</p>
                  <h3
                    style={{
                      margin: "5px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {start}{" "}
                    <span style={{ color: "#666", fontSize: "14px" }}>to</span>{" "}
                    {end}
                  </h3>
                </div>
              </div>


            </div>
          </Preview1>
        </div>
      )}
    </main>
  );
}

export default Form

