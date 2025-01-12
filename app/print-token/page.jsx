"use client";
import { useState, useEffect } from "react";

/**
 * Check if code is running on client side
 * @constant {boolean}
 */
const isClient = typeof window !== 'undefined';

/**
 * Import PDF functions only on client side
 */
let Preview1, print1;
if (isClient) {
  const {Preview, print} = require('@pdfMaker/dist/index');
  Preview1 = Preview;
  print1 = print;
}

/**
 * Transforms school ID by removing prefix
 * @param {string} id - School ID
 * @returns {string} Transformed ID
 */
const transformId = (id) => {
  return id.substring(3);
};

/**
 * Generates formatted token for students
 * @param {string} id - School ID
 * @param {number} tokenNumber - Token number
 * @returns {string} Formatted token
 */
function generateFormattedToken(id, tokenNumber) {
  const formattedId = transformId(id);
  const formattedTokenNumber = String(tokenNumber).padStart(4, "0");
  return `${formattedId}${formattedTokenNumber}`;
}

/**
 * Generates formatted token for teachers
 * @param {string} id - School ID 
 * @param {number} tokenNumber - Token number
 * @returns {string} Formatted token
 */
function generateFormattedTokenTeacher(id, tokenNumber) {
  const formattedId = transformId(id);
  const formattedTokenNumber = String(tokenNumber).padStart(3, "0");
  return `${formattedId}T${formattedTokenNumber}`;
}

/**
 * Print Token Page Component
 * Allows viewing and printing of school tokens
 */
const View = () => {
  // State definitions
  const [message, setMessage] = useState(null);
  const [options, setOptions] = useState([]);
  const [start,setStart] = useState('');
  const [end,setEnd] = useState('');
  const [tstart,setTstart] = useState('');
  const [tend,setTend] = useState('');
  const [loading, setLoading] = useState(false);
  const [printer, setPrinter] = useState(false)
  const [deskDetails, setDeskDetails] = useState({
    deskNo: '',
    deskHead: '',
    deskheadPhoneNumber: ''
  });
  const [juniorProjects, setJuniorProjects] = useState([]);
  const [youngProjects, setYoungProjects] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [schoolDetails, setSchoolDetails] = useState({});

  
  useEffect(() => {
    getInfo();
  }, [])

  useEffect(() => {
    if(printer){
      handlePrint();
      setPrinter(false);
    }
  }, [printer]);

  /**
   * Prints the token preview
   */
  async function handlePrint(){
    print1(`S2T-Token ${schoolId}`, 'jsx-template');
  }

  /**
   * Fetches available school options
   */
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
          setOptions(data.message);
          console.log(data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  /**
   * Handles form submission and token generation
   * @param {Event} event - Form submission event
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const formData = {
      name: event.target.name.value,
    };

    try {
      const generateTokenResponse = await fetch("/api/viewDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (generateTokenResponse.ok) {
        const generateTokenData = await generateTokenResponse.json();

        // Check if data exists and has required properties
        if (
          generateTokenData &&
          generateTokenData.message &&
          generateTokenData.message._id
        ) {
          setStart(
            generateFormattedToken(
              generateTokenData.message.schoolId,
              generateTokenData.message.firstToken
            )
          );
          setEnd(
            generateFormattedToken(
              generateTokenData.message.schoolId,
              generateTokenData.message.lastToken
            )
          );
          setTstart(
            generateFormattedTokenTeacher(
              generateTokenData.message.schoolId,
              generateTokenData.message.tFirstToken
            )
          );
          setTend(
            generateFormattedTokenTeacher(
              generateTokenData.message.schoolId,
              generateTokenData.message.tLastToken
            )
          );
          setDeskDetails({
            deskNo: generateTokenData.deskDetails.deskNo,
            deskHead: generateTokenData.deskDetails.deskHead,
            deskheadPhoneNumber:
              generateTokenData.deskDetails.deskheadPhoneNumber,
          });
          setSchoolId(generateTokenData.message.schoolId);
          setSchoolName(generateTokenData.message.schoolName);
          setSchoolDetails(generateTokenData.schoolDetails);
          setJuniorProjects(generateTokenData.sProjects || []);
          setYoungProjects(generateTokenData.yProjects || []);
          console.log(generateTokenData);
          console.log(generateTokenData.deskDetails);
          console.log(deskDetails);
          setPrinter(true);
          setMessage(generateTokenData.message);
        } else {
          setMessage("No data found");
        }
        event.target.reset();
      } else {
        const data = await generateTokenResponse.json();
        if (data.message == "School not found") {
          setMessage(null);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main">
      <span className="title">Token</span>
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
        <button
          id="submit-btn"
          className="button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message == null ? (
        <h1>School Not Registered</h1>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
            padding: "20px",
            width: "100%",
          }}
        >
          <Preview1 id={"jsx-template"}>
            <div
              style={{
                width: "595px",
                minHeight: "842px",
                margin: "0 auto",
                border: "2px solid #000000",
                backgroundColor: "#ffffff",
                padding: "20px",
                boxSizing: "border-box",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {/* Navbar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#0b4685",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <img
                  src="/image/sairam_logo.svg"
                  style={{ height: "40px", width: "auto" }}
                  alt="Sairam Logo"
                />
                <img
                  src="/image/s2t_5.0.png"
                  style={{ height: "40px", width: "auto" }}
                  alt="S2T Logo"
                />
              </div>

              {/* School Details */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    color: "#0b4685",
                    margin: "0 0 10px 0",
                    fontSize: "18px",
                    textAlign: "center",
                  }}
                >
                  {schoolName}
                </h3>

                {/* School SPOC Details */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", color: "#0b4685" }}>
                    School SPOC Details:
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "5px",
                      fontSize: "14px",
                    }}
                  >
                    <div>Name: {schoolDetails.schoolStaff}</div>
                    <div>Contact: {schoolDetails.schoolStaffPhone}</div>
                  </div>
                </div>

                {/* Sairam SPOC Details */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", color: "#0b4685" }}>
                    Sairam SPOC Details:
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "5px",
                      fontSize: "14px",
                    }}
                  >
                    <div>Desk: {deskDetails.deskNo}</div>
                    <div>Name: {deskDetails.deskHead}</div>
                    <div>Contact: {deskDetails.deskheadPhoneNumber}</div>
                  </div>
                </div>
              </div>

              {/* Token Information */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#e3f2fd",
                    borderRadius: "8px",
                    padding: "15px",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#0b4685" }}>
                    Student Tokens
                  </h3>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {start} - {end}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#e8f5e9",
                    borderRadius: "8px",
                    padding: "15px",
                    textAlign: "center",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#0b4685" }}>
                    Teacher Tokens
                  </h3>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {tstart} - {tend}
                  </div>
                </div>
              </div>

              {/* Projects Summary */}
              {(juniorProjects.length > 0 || youngProjects.length > 0) && (
                <>
                  <div
                    style={{
                      backgroundColor: "#fff3e0",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "20px",
                      textAlign: "center",
                    }}
                  >
                    <h3 style={{ margin: "0 0 15px 0", color: "#0b4685" }}>
                      Projects Overview
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        fontSize: "16px",
                      }}
                    >
                      <div>
                        Junior Projects:{" "}
                        <strong>{juniorProjects.length}</strong>
                      </div>
                      <div>
                        Young Projects: <strong>{youngProjects.length}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "20px",
                    }}
                  >
                    {juniorProjects.length > 0 && (
                      <div style={{ marginBottom: "15px" }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#0b4685" }}>
                          Junior Scientists
                        </h4>
                        {juniorProjects.map((project, index) => (
                          <div
                            key={index}
                            style={{
                              backgroundColor: "white",
                              padding: "8px",
                              marginBottom: "5px",
                              borderRadius: "4px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "bold",
                                marginBottom: "5px",
                              }}
                            >
                              {project.theme}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                              }}
                            >
                              <span>ID: {project.projId}</span>
                              <span>Table: {project.tNo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {youngProjects.length > 0 && (
                      <div>
                        <h4 style={{ margin: "0 0 10px 0", color: "#0b4685" }}>
                          Young Scientists
                        </h4>
                        {youngProjects.map((project, index) => (
                          <div
                            key={index}
                            style={{
                              backgroundColor: "white",
                              padding: "8px",
                              marginBottom: "5px",
                              borderRadius: "4px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "bold",
                                marginBottom: "5px",
                              }}
                            >
                              {project.theme}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "14px",
                              }}
                            >
                              <span>ID: {project.projId}</span>
                              <span>Table: {project.tNo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Preview1>
        </div>
      )}
    </main>
  );
}

export default View;

