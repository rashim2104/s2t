/**
 * API route for fetching school options
 * @module api/fetchOptions
 */

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import School from "@/models/school";

/**
 * Handles GET requests to fetch all schools
 * @returns {Promise<NextResponse>} JSON response with sorted school list
 */
export async function GET() {
  try {
    await connectMongoDB();
    
    // Fetch and sort schools alphabetically
    const schoolInfo = await School.find({});
    schoolInfo.sort((a, b) => a.name.localeCompare(b.name));
    
    if (!schoolInfo.length) {
      return NextResponse.json({ message: "No schools found" }, { status: 404 });
    }

    return NextResponse.json({ message: schoolInfo }, { status: 200 });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { message: "An error occurred while fetching schools" },
      { status: 500 }
    );
  }
}
