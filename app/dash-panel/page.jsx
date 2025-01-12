"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Card component for dashboard actions
 * @param {Object} props - Component properties
 * @param {string} props.heading - Card heading
 * @param {string} props.description - Card description
 * @param {string} props.link - Navigation link
 * @param {string} props.className - Additional CSS classes
 */
function Card1({ heading, description, link, className }) {
  return (
    <div className={`flex gap-4 rounded-xl shadow-sm p-6 ${className}`}>
      {/* <div className="min-w-max">{icon}</div> */}
      <div className="space-y-2">
        <h3 className="text-[22px] font-semibold">{heading}</h3>
        <p className="leading-8 text-gray-500 font-normal">{description}</p>
        <br/>
        <Link href={`${link}`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            {heading}
          </button>
        </Link>
      </div>
      
    </div>
  );
}

/**
 * Dashboard Component
 * Main admin control panel with statistics and action cards
 */
export default function Dashboard(){
    // State definitions
    const [school, setSchool] = useState(0);
    const [student, setStudent] = useState(0);
    const [teacher, setTeacher] = useState(0);

    /**
     * Fetches and updates dashboard statistics
     */
    async function detailsGetter(){
        try {
          const response = await fetch('/api/getDetails', {
            method: 'POST',
          });
  
          if (response.ok) {
            const data = await response.json();
            let totalStudentCount = 0;
            let totalTeacherCount = 0;
            
            // Simply count all entries in data.message array
            const totalSchools = data.message.length;
      
            // Loop through each school in the array
            data.message.forEach(school => {

              // Sum studentCount and teacherCount
              totalStudentCount += school.studentCount;
              totalStudentCount += school.eStudentCount;
              totalTeacherCount += school.teacherCount;
              totalTeacherCount += school.eTeacherCount;
            });
            
            // Store the totals
            setSchool(totalSchools);
            setStudent(totalStudentCount);
            setTeacher(totalTeacherCount);
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error fetching:', error);
          alert('An error occurred while fetching.');
        }
      }

    useEffect(() => {
        detailsGetter();
    }, []); // Added dependency array to prevent infinite loops

  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            {/* <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="d5589eeb-3fca-4f01-ac3e-983224745704"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#d5589eeb-3fca-4f01-ac3e-983224745704)"
                width="52"
                height="24"
              />
            </svg> */}
            <span className="relative">Sairam</span>
          </span>{' '}<br/>
          S2T 5.0
        </h2>
        <p className="text-base text-gray-700 md:text-lg">
          School Towards Technology
        </p>
      </div>
      <div className="relative w-full p-px mx-auto mb-4 overflow-hidden transition-shadow duration-300 border rounded lg:mb-8 lg:max-w-4xl group hover:shadow-xl">
        <div className="absolute bottom-0 left-0 w-full h-1 duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
        <div className="absolute bottom-0 left-0 w-1 h-full duration-300 origin-bottom transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
        <div className="absolute top-0 left-0 w-full h-1 duration-300 origin-right transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
        <div className="absolute bottom-0 right-0 w-1 h-full duration-300 origin-top transform scale-y-0 bg-deep-purple-accent-400 group-hover:scale-y-100" />
        <div className="relative flex flex-col items-center justify-center h-full py-10 duration-300 bg-blue-50 rounded-sm transition-color sm:items-stretch sm:flex-row">
          <div className="px-12 py-8 text-center">
            <h6 className="text-4xl font-bold text-deep-purple-accent-400 sm:text-5xl">
              {school}
            </h6>
            <p className="text-center md:text-base">
              Schools
            </p>
          </div>
          <div className="w-56 h-1 transition duration-300 transform bg-gray-300 rounded-full group-hover:bg-deep-purple-accent-400 group-hover:scale-110 sm:h-auto sm:w-1" />
          <div className="px-12 py-8 text-center">
            <h6 className="text-4xl font-bold text-deep-purple-accent-400 sm:text-5xl">
              {student}
            </h6>
            <p className="text-center md:text-base">
              Students
            </p>
          </div>
          <div className="w-56 h-1 transition duration-300 transform bg-gray-300 rounded-full group-hover:bg-deep-purple-accent-400 group-hover:scale-110 sm:h-auto sm:w-1" />
          <div className="px-12 py-8 text-center">
            <h6 className="text-4xl font-bold text-deep-purple-accent-400 sm:text-5xl">
              {teacher}
            </h6>
            <p className="text-center md:text-base">
              Teachers
            </p>
          </div>
          <div className="w-56 h-1 transition duration-300 transform bg-gray-300 rounded-full group-hover:bg-deep-purple-accent-400 group-hover:scale-110 sm:h-auto sm:w-1" />
          <div className="px-12 py-8 text-center">
            <h6 className="text-4xl text-green-700 font-bold text-deep-purple-accent-400 sm:text-5xl">
              {student + teacher}
            </h6>
            <p className="text-center md:text-base">
              Total
            </p>
          </div>
        </div>
      </div>
      <br/><br/>
      <p className="mx-auto mb-4 text-4xl text-gray-600 sm:text-center lg:max-w-2xl lg:mb-6 md:px-16">
        Admin Controls
      </p>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 bg-white p-3 sm:p-8">
      <Card1
        className="bg-green-50"
        heading="Generate"
        link="/gen-add"
        description="Generate additional tokens for registered schools"
        // icon={<GiAbstract020 size="2.5rem" className="text-[#D566FF]" />}
      />
      <Card1
        className="bg-purple-50"
        heading="View"
        link="/see-token"
        description="View the details of a registered school."
        // icon={<GiAbstract024 size="2.5rem" className="text-[#DDA10C]" />}
      />
      <Card1
        className="bg-red-100"
        heading="Reset"
        link="/token-clear"
        description="Reset all the details of the registered school."
        // icon={<GiAbstract024 size="2.5rem" className="text-[#DDA10C]" />}
      />
        <Card1
        className="bg-orange-100"
        heading="Print"
        link="/print-token"
        description="Print the token for registered schools"
        // icon={<GiAbstract024 size="2.5rem" className="text-[#DDA10C]" />}
      />
      </div>
      <div className={`rounded-xl m-auto shadow-sm w-3/4 bg-gray-200 p-6`}>
      <div className="flex justify-between items-center">
        <h3 className="text-[22px] font-semibold">Reporting Form</h3>
        {/* <p className="leading-8 text-gray-500 font-normal">{description}</p> */}
        <Link href='/' >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            ▶
          </button>
        </Link>
      </div>
      
    </div>
    </div>
  );
}