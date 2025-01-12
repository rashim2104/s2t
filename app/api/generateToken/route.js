/**
 * API route for generating tokens for schools
 * @module api/generateToken
 */

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Details from "@/models/details";
import School from "@models/school";
import juniorData from "@/models/juniorData.json";
import youngData from "@/models/youngData.json";

/**
 * Transforms school ID by removing prefix
 * @param {string} id - School ID
 * @returns {string} Transformed ID
 */
const transformId = (id) => id.substring(3);

/**
 * Generates formatted token for students
 * @param {string} id - School ID
 * @param {number} tokenNumber - Token number
 * @returns {string} Formatted token
 */
function generateFormattedToken(id, tokenNumber) {
  const formattedId = transformId(id);
  return `${formattedId}${String(tokenNumber).padStart(4, "0")}`;
}

/**
 * Generates formatted token for teachers
 * @param {string} id - School ID
 * @param {number} tokenNumber - Token number
 * @returns {string} Formatted teacher token
 */
function generateFormattedTokenTeacher(id, tokenNumber) {
  const formattedId = transformId(id);
  return `${formattedId}T${String(tokenNumber).padStart(3, "0")}`;
}

/**
 * Generates token for other schools
 * @param {number} tokenNumber - Token number
 * @returns {string} Formatted token for other schools
 */
function generateOtherSchoolToken(tokenNumber) {
  return `SAIS2T5OT${String(tokenNumber).padStart(2, "0")}`;
}

export async function POST(req) {
  // Ensure database connection
  await connectMongoDB();

  try {
    let body = await req.json();
    console.log("body: ", body);
    let schoolInfo;
    
    if (body.isOtherSchool) {
      schoolInfo = {
        id: "SAIS2T5OT",
        name: body.name,
        deskNo: "Special Desk",
        deskHead: "Special Desk Coordinator",
        deskheadPhoneNumber: "1234567890", 
        schoolStaff: "Other School Staff",      
        schoolStaffPhone: "1234567890"
      };
    } else {
      schoolInfo = await School.findOne({ name: body.name }).select({
        id: 1,
        name: 1,
        status: 1,
        deskNo: 1,
        deskHead: 1,
        deskheadPhoneNumber: 1,
        schoolStaff: 1,
        schoolStaffPhone: 1
      });
      
      if (!schoolInfo || schoolInfo.status === 1) {
        return NextResponse.json(
          {
            message: !schoolInfo
              ? "No School Found."
              : "School already registered.",
          },
          { status: 500 }
        );
      }
    }

    console.log("Complete School Info:", schoolInfo);

    // Calculate the requested count
    const requestedStudentCount = parseInt(body.studentCount);
    let requestedTeacherCount = parseInt(body.teacherCount);
    // console.log("req",requestedCount);

    if (requestedStudentCount === 0) {
      return NextResponse.json(
        { message: "Please enter valid student and teacher count." },
        { status: 500 }
      );
    }
    if (requestedTeacherCount === 0) {
      requestedTeacherCount = 1;
    }

    // Find the last assigned token
    const lastAssignedTokenInfo = await Details.findOne({})
      .sort({ updatedAt: -1 })
      .limit(1);

    const lastAssignedTokenInfoTeacher = await Details.findOne({})
      .sort({ createdAt: -1 })
      .limit(1);

    // Retrieve the lastToken value or set it to 2 if no document is found
    const startingStudentToken = lastAssignedTokenInfo
      ? lastAssignedTokenInfo.eLastToken !== 0
        ? parseInt(lastAssignedTokenInfo.eLastToken) + 1
        : parseInt(lastAssignedTokenInfo.lastToken) + 1
      : 1;

    const startingTeacherToken = lastAssignedTokenInfo
      ? lastAssignedTokenInfoTeacher.etLastToken !== 0
        ? parseInt(lastAssignedTokenInfoTeacher.etLastToken) + 1
        : parseInt(lastAssignedTokenInfoTeacher.tLastToken) + 1
      : 1;
    // Calculate the last token
    const lastStudentToken = startingStudentToken + requestedStudentCount - 1;
    const lastTeacherToken = startingTeacherToken + requestedTeacherCount - 1;

    // Store the first and last tokens in the database
    const newDetails = new Details({
      schoolName: body.name,
      email: body.email,
      studentCount: body.studentCount,
      teacherCount: body.teacherCount,
      contact: body.contact,
      altContact: body.altcontact,
      firstToken: startingStudentToken,
      lastToken: lastStudentToken,
      tFirstToken: startingTeacherToken,
      tLastToken: lastTeacherToken,
      eStudentCount: 0,
      eTeacherCount: 0,
      eFirstToken: 0,
      etFirstToken: 0,
      etLastToken: 0,
      eLastToken: 0,
      schoolId: schoolInfo.id,
    });

    // Save the new Details entry to the database
    await newDetails.save();

    const statusUpdate = await School.updateOne(
      { _id: schoolInfo._id },
      { $set: { status: 1 } }
    );

    let stoken, etoken, sttoken, ettoken;
    if (body.isOtherSchool) {
      stoken = generateOtherSchoolToken(startingStudentToken);
      etoken = generateOtherSchoolToken(lastStudentToken);
      sttoken = `${generateOtherSchoolToken(startingTeacherToken)}T`;
      ettoken = `${generateOtherSchoolToken(lastTeacherToken)}T`;
    } else {
      stoken = generateFormattedToken(schoolInfo.id, startingStudentToken);
      etoken = generateFormattedToken(schoolInfo.id, lastStudentToken);
      sttoken = generateFormattedTokenTeacher(schoolInfo.id, startingTeacherToken);
      ettoken = generateFormattedTokenTeacher(schoolInfo.id, lastTeacherToken);
    }
    let deskNo = schoolInfo.deskNo;
    let deskHead = schoolInfo.deskHead;
    let deskheadPhoneNumber = schoolInfo.deskheadPhoneNumber;
    let schoolStaff = schoolInfo.schoolStaff;  // Add this
    let schoolStaffPhone = schoolInfo.schoolStaffPhone;  // Add this

    // Find matching projects from juniorData and youngData
    let matchingProjectsJunior = [];
    let matchingProjectsYoung = [];  // Add this
    
    if (!body.isOtherSchool) {
      
      matchingProjectsJunior = juniorData.filter(project => 
        project.id === schoolInfo.id
      );
      
      matchingProjectsYoung = youngData.filter(project =>   // Add this
        project.id === schoolInfo.id
      );
    
    }

    return NextResponse.json({
      status: 201,
      data: {
        message: "Details created successfully",
        schoolId: schoolInfo.id,
        schoolName: schoolInfo.name,
        schoolDetails: {
          schoolStaff: schoolInfo.schoolStaff,        
          schoolStaffPhone: schoolInfo.schoolStaffPhone 
        },
        tokens: {
          start: stoken,
          end: etoken,
          tStart: sttoken,
          tEnd: ettoken,
        },
        deskDetails: {
          deskNo,
          deskHead,
          deskheadPhoneNumber,
        },
        sProjects: matchingProjectsJunior,
        yProjects: matchingProjectsYoung
      },
    });
  } catch (error) {
    console.error("Error creating new details:", error);
    return NextResponse.json(
      { message: "An error occurred while creating new details." },
      { status: 500 }
    );
  }
}
