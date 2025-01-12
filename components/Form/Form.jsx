"use client";

/**
 * Form component for school registration and token generation
 * Handles school registration, token generation, and PDF preview
 */
import { useState, useEffect } from "react";

// Dynamic imports for PDF functionality
const isClient = typeof window !== "undefined";
let Preview1, print1;

if (isClient) {
  const { Preview, print } = require("@pdfMaker/dist/index");
  Preview1 = Preview;
  print1 = print;
}

const Form = () => {
  // State declarations
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState([]);
  const [isOtherSchool, setIsOtherSchool] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tstart, setTstart] = useState("");
  const [tend, setTend] = useState("");
  const [loading, setLoading] = useState(false);
  const [printer, setPrinter] = useState(false);
  const [deskDetails, setDeskDetails] = useState({});
  const [tokenDetails, setTokenDetails] = useState({});
  const [juniorProjects, setJuniorProjects] = useState([]); // Add this state
  const [youngProjects, setYoungProjects] = useState([]); 
  const [schoolId, setSchoolId] = useState("");
  const [schoolDetails, setSchoolDetails] = useState({});
  const [schoolName, setSchoolName] = useState("");

  /**
   * Fetches school options when component mounts
   */
  useEffect(() => {
    getInfo();
  }, []);

  /**
   * Triggers print function when printer state changes
   */
  useEffect(() => {
    if (printer) {
      handlePrint();
      setPrinter(false);
    }
  }, [printer]);

  async function handlePrint() {
    print1(`S2T-Token ${schoolId}`, "jsx-template");
  }
  function getInfo() {
    const currentTime = new Date().toISOString();
    fetch(`/api/fetchOptions?currentTime=${encodeURIComponent(currentTime)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message.length > 0) {
          setOptions(data.message);
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function handleSubmit(event) {
    alert("Form is closed.");
    return 0;
    event.preventDefault();
    setLoading(true);

    const formData = {
      name: isOtherSchool ? event.target.otherSchoolName.value : event.target.name.value,
      isOtherSchool: isOtherSchool,
      email: event.target.email.value,
      studentCount: event.target.studentCount.value,
      teacherCount: event.target.teacherCount.value,
      contact: event.target.contact.value,
      altcontact: event.target.altcontact.value,
    };

    try {
      const generateTokenResponse = await fetch("/api/generateToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (generateTokenResponse.ok) {
        const generateTokenData = await generateTokenResponse.json();
        setTokenDetails(generateTokenData.data.tokens);
        setDeskDetails(generateTokenData.data.deskDetails);
        setJuniorProjects(generateTokenData.data.sProjects || []); 
        setYoungProjects(generateTokenData.data.yProjects || []); 
        setSchoolId(generateTokenData.data.schoolId);
        setMessage(generateTokenData.data.message);
        setSchoolDetails(generateTokenData.data.schoolDetails);
        setSchoolName(generateTokenData.data.schoolName);
        event.target.reset();

        if (
          generateTokenData.data.message.includes(
            "Details created successfully"
          )
        ) {
          setStart(generateTokenData.data.tokens.start);
          setEnd(generateTokenData.data.tokens.end);
          setTstart(generateTokenData.data.tokens.tStart);
          setTend(generateTokenData.data.tokens.tEnd);
          setPrinter(true);
        }
      } else {
        const errorData = await generateTokenResponse.json();
        setMessage(errorData.message);
        console.error("Failed to generate token");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main">
      <span className="title">Reporting Form</span>
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
          onChange={(e) => setIsOtherSchool(e.target.value === "Others")}
          required={!isOtherSchool}
          disabled={isOtherSchool}
        />
        <datalist id="schools">
          {options.map((option) => (
            <option key={option.name}>{option.name}</option>
          ))}
          <option>Others</option>
        </datalist>

        {isOtherSchool && (
          <>
            <label className="label" htmlFor="otherSchoolName">
              Specify School Name<span className="required">*</span>
            </label>
            <input
              className="input"
              type="text"
              name="otherSchoolName"
              id="otherSchoolName"
              required
            />
          </>
        )}
        <label className="label" htmlFor="email">
          Email<span className="required">*</span>
        </label>
        <input
          className="input"
          type="email"
          name="email"
          id="email"
          required
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          title="Please enter a valid email address"
        />
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
        <label className="label" htmlFor="teacherCount">
          Accompanied Teacher Count<span className="required">*</span>
        </label>
        <input
          className="input"
          type="number"
          name="teacherCount"
          id="teacherCount"
          min={0}
          required
        />
        <label className="label" htmlFor="contact">
          SPOC Contact No<span className="required">*</span>
        </label>
        <input
          className="input"
          type="tel"
          name="contact"
          id="contact"
          pattern="^[6-9][0-9]{9}$"
          title="Please enter a valid 10-digit Indian phone number"
           required
        />
        <label className="label" htmlFor="altcontact">
          Alternative Contact No<span className="required">*</span>
        </label>
        <input
          className="input"
          type="tel"
          name="altcontact"
          id="altcontact"
          pattern="^[6-9][0-9]{9}$"
          title="Please enter a valid 10-digit Indian phone number"
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
            width: "100%"
          }}
        >
          <Preview1 id={"jsx-template"}>
            <div style={{
              width: "595px",
              minHeight: "842px",
              margin: "0 auto",
              border: "2px solid #000000",
              backgroundColor: "#ffffff",
              padding: "20px",
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif" // Better font readability on mobile
            }}>
              {/* Navbar */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#0b4685",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px"
              }}>
                <img src="/image/sairam_logo.svg" style={{ height: "40px", width: "auto" }} alt="Sairam Logo" />
                <img src="/image/s2t_5.0.png" style={{ height: "40px", width: "auto" }} alt="S2T Logo" />
              </div>

              {/* School ID Card Style Header */}
              <div style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                <h2 style={{ 
                  color: "#0b4685", 
                  margin: "0 0 10px 0",
                  fontSize: "24px",
                  fontWeight: "bold"
                }}>
                  School ID: {schoolId}
                </h2>
              </div>

              <div style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ 
                  color: "#0b4685", 
                  margin: "0 0 10px 0",
                  fontSize: "18px",
                  textAlign: "center"
                }}>
                  {schoolName}
                </h3>
                
                {/* School SPOC Details */}
                <div style={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "10px"
                }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#0b4685" }}>School SPOC Details:</h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "5px",
                    fontSize: "14px"
                  }}>
                    <div>Name: {schoolDetails.schoolStaff}</div>
                    <div>Contact: {schoolDetails.schoolStaffPhone}</div>
                  </div>
                </div>
            
                {/* Sairam SPOC Details */}
                <div style={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "6px"
                }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#0b4685" }}>Sairam SPOC Details:</h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "5px",
                    fontSize: "14px"
                  }}>
                    <div>Desk: {deskDetails.deskNo}</div>
                    <div>Name: {deskDetails.deskHead}</div>
                    <div>Contact: {deskDetails.deskheadPhoneNumber}</div>
                  </div>
                </div>
              </div>

              {/* Token Information */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "20px"
              }}>
                {/* Student Count Card */}
                <div style={{
                  backgroundColor: "#e3f2fd",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#0b4685" }}>Student Tokens</h3>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {start} - {end}
                  </div>
                </div>

                {/* Teacher Count Card */}
                <div style={{
                  backgroundColor: "#e8f5e9",
                  borderRadius: "8px",
                  padding: "15px",
                  textAlign: "center"
                }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#0b4685" }}>Teacher Tokens</h3>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {tstart} - {tend}
                  </div>
                </div>
              </div>

              {/* Projects Summary Card */}
              <div style={{
                backgroundColor: "#fff3e0",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "20px",
                textAlign: "center"
              }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#0b4685" }}>Projects Overview</h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  fontSize: "16px"
                }}>
                  <div>Junior Projects: <strong>{juniorProjects.length}</strong></div>
                  <div>Young Projects: <strong>{youngProjects.length}</strong></div>
                </div>
              </div>

              {/* Project Lists */}
              {juniorProjects.length > 0 && (
                <div style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px"
                }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0b4685", textAlign: "center" }}>
                    Junior Scientist Projects
                  </h3>
                  <div style={{
                    display: "grid",
                    gap: "10px"
                  }}>
                    {juniorProjects.map((project, index) => (
                      <div key={index} style={{
                        backgroundColor: "white",
                        borderRadius: "6px",
                        padding: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                      }}>
                        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{project.theme}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                          <span>ID: {project.projId}</span>
                          <span>Table: {project.tNo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {youngProjects.length > 0 && (
                <div style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  padding: "15px"
                }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0b4685", textAlign: "center" }}>
                    Young Scientist Projects
                  </h3>
                  <div style={{
                    display: "grid",
                    gap: "10px"
                  }}>
                    {youngProjects.map((project, index) => (
                      <div key={index} style={{
                        backgroundColor: "white",
                        borderRadius: "6px",
                        padding: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                      }}>
                        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{project.theme}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                          <span>ID: {project.projId}</span>
                          <span>Table: {project.tNo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Preview1>
        </div>
      )}
    </main>
  );
};

export default Form;
