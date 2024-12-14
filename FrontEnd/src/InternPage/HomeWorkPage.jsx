import React from 'react'
import HomeworkCard from '../components/HomeworkCard'
import { Typography } from '@mui/material'

function HomeworkPage() {
  const homeworkData = [
    {
      mentorName: "Mentor Name",
      mentorImage: "/placeholder.svg?height=40&width=40",
      materialNumber: 1,
      score: "90/100",
      deadline: "12:30 pm",
      tag: "Tugas"
    },
    {
      mentorName: "Mentor Name",
      mentorImage: "/placeholder.svg?height=40&width=40",
      materialNumber: 3,
      score: "90/100",
      deadline: "12:30 pm",
      tag: "Latihan"
    }
  ]

  return (
    <div className="p-6">
      <Typography variant="h4" component="h1" className="mb-6 font-bold">
        Home Work
      </Typography>
      <div className="max-w-3xl">
        {homeworkData.map((homework, index) => (
          <HomeworkCard
            key={index}
            mentorName={homework.mentorName}
            mentorImage={homework.mentorImage}
            materialNumber={homework.materialNumber}
            score={homework.score}
            deadline={homework.deadline}
            tag={homework.tag}
          />
        ))}
      </div>
    </div>
  )
}

export default HomeworkPage

