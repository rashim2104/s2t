/**
 * API route for adding additional tokens to existing schools
 * @module api/addToken
 */

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Details from "@/models/details";

/**
 * Transforms school ID by removing prefix
 * @param {string} id - School ID
 * @returns {string} Transformed ID
 */
const transformId = (id) => id.substring(3);

/**
 * Generates formatted token
 * @param {string} id - School ID
 * @param {number} tokenNumber - Token number
 * @returns {string} Formatted token
 */
function generateFormattedToken(id, tokenNumber) {
  const formattedId = transformId(id);
  return `${formattedId}${String(tokenNumber).padStart(4, "0")}`;
}

/**
 * Handles POST requests to add additional tokens
 * @param {Request} req - The request object
 * @returns {Promise<NextResponse>} JSON response with token details
 */
export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    
    // Verify school exists
    const schoolInfo = await Details.findOne({ schoolName: body.name });
    if (!schoolInfo) {
      return NextResponse.json(
        { message: 'School not registered' },
        { status: 404 }
      );
    }

    // Calculate tokens
    const requestedCount = parseInt(body.studentCount);
    const lastAssignedTokenInfo = await Details.findOne({})
      .sort({ updatedAt: -1 })
      .limit(1);

    const startingToken = lastAssignedTokenInfo
      ? lastAssignedTokenInfo.eLastToken !== 0
        ? parseInt(lastAssignedTokenInfo.eLastToken) + 1
        : parseInt(lastAssignedTokenInfo.lastToken) + 1
      : 1;

    const lastToken = startingToken + requestedCount - 1;

    // Update school details
    await Details.updateOne(
      { _id: schoolInfo._id },
      {
        $set: {
          eStudentCount: parseInt(body.studentCount),
          eFirstToken: startingToken,
          eLastToken: lastToken,
        },
      }
    );

    // Generate tokens
    const stoken = generateFormattedToken(schoolInfo.schoolId, startingToken);
    const etoken = generateFormattedToken(schoolInfo.schoolId, lastToken);

    return NextResponse.json({
      message: 'Details created successfully',
      start: stoken,
      end: etoken
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating new details:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating new details' },
      { status: 500 }
    );
  }
}
