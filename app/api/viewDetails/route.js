/**
 * API route for retrieving school details and associated projects
 * @module api/viewDetails
 */

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Details from "@models/details";
import School from "@models/school";
import juniorData from "@/models/juniorData.json";
import youngData from "@/models/youngData.json";

/**
 * Handles POST requests to fetch school details
 * @param {Request} req - The request object containing school name
 * @returns {Promise<NextResponse>} JSON response with school details or error
 */
export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    
    // Fetch school information
    const schoolInfo = await Details.findOne({ schoolName: body.name });
    if (!schoolInfo) {
      return NextResponse.json({ message: "School not found" }, { status: 404 });
    }

    // Fetch desk information
    const deskInfo = await School.findOne({ name: body.name });

    // Match projects from both categories
    const matchingProjectsJunior = juniorData.filter(project => 
      project.id === schoolInfo.schoolId
    );
    
    const matchingProjectsYoung = youngData.filter(project => 
      project.id === schoolInfo.schoolId
    );

    return NextResponse.json({
      message: schoolInfo,
      deskDetails: {
        deskNo: deskInfo.deskNo,
        deskHead: deskInfo.deskHead,
        deskheadPhoneNumber: deskInfo.deskheadPhoneNumber
      },
      schoolDetails: {
        schoolStaff: deskInfo.schoolStaff,
        schoolStaffPhone: deskInfo.schoolStaffPhone
      },
      sProjects: matchingProjectsJunior,
      yProjects: matchingProjectsYoung
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error Fetching:', error);
    return NextResponse.json(
      { message: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}