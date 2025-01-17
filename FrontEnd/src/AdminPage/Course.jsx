'use client'

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import client from "../client"

const Course = () => {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.get("/api/admin/Course")
        setCourses(response.data.courses)
      } catch (error) {
        console.error("Error fetching courses:", error)
      }
    }
    fetchCourses()
  }, [])

  const handleAddCourse = () => {
    navigate("/addcourse")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-300 h-[400px] mb-8">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2">Materi</h1>
          <div className="mt-8">
            <h2 className="text-5xl font-light mb-4">HI, I'm</h2>
            <h3 className="text-4xl font-medium">Learning and Developer</h3>
          </div>
          <div className="absolute right-20 bottom-0 transform translate-y-1/2">
            {/* <div className="w-64 h-64 bg-gray-200 rounded-full overflow-hidden border-8 border-white">
              <div className="w-full h-full bg-gray-300" />
            </div> */}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full mr-3" />
                  <span className="text-sm text-gray-600">Mentor Name</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.namaCourse}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.Deskripsi}</p>
                <div className="flex justify-between items-center">
                  <span className="text-red-500 text-sm"></span>
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                    {course.type || "Materi"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Button */}
          <button
            onClick={handleAddCourse}
            className="bg-white rounded-lg shadow-lg h-full min-h-[300px] flex items-center justify-center text-4xl font-light text-gray-400 hover:text-gray-600 hover:scale-105 transition-all"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export default Course

