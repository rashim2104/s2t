/**
 * API route for resetting tokens and school status
 * @module api/resetToken
 */

import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import School from "@/models/school";
import Details from "@models/details";

/**
 * Handles POST requests to reset all tokens and school status
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} JSON response indicating success or failure
 */
export async function POST(req) {
  try {
    await connectMongoDB();
    
    // Reset operations
    await Details.deleteMany({});
    await School.updateMany({}, { $set: { status: 0 } });
    
    console.log("Reset operations completed successfully");
    return NextResponse.json({ message: "Reset Successful" }, { status: 200 });
    
  } catch (error) {
    console.error('Error during reset operation:', error);
    return NextResponse.json(
      { message: "An error occurred during reset operation" },
      { status: 500 }
    );
  }
}
