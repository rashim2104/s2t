/**
 * API route for retrieving all details records
 * @module api/getDetails
 */

import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Details from "@models/details";

/**
 * Handles POST requests to fetch all details
 * @param {NextRequest} req - The request object
 * @returns {Promise<NextResponse>} JSON response with all details or error
 */
export async function POST(NextRequest) {
  try {
    await connectMongoDB();
    const data = await Details.find({});
    
    if (!data.length) {
      return NextResponse.json({ message: "No records found" }, { status: 404 });
    }

    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    console.error('Error Fetching:', error);
    return NextResponse.json(
      { message: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}
