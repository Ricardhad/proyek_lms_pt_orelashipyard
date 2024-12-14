import React from 'react'
import { Container } from '@mui/material'
import ProfileHeader from '../components/InternProfileHeader'
import MaterialCard from '../components/MaterialCard'

function DashboardPage() {
  const materialsData = [
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
      materialNumber: 2,
      score: "90/100",
      deadline: "12:30 pm",
      tag: "Materi"
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
    <Container maxWidth="lg" className="py-6">
      <ProfileHeader />
      <div className="grid gap-4">
        {materialsData.map((material, index) => (
          <MaterialCard
            key={index}
            mentorName={material.mentorName}
            mentorImage={material.mentorImage}
            materialNumber={material.materialNumber}
            score={material.score}
            deadline={material.deadline}
            tag={material.tag}
          />
        ))}
      </div>
    </Container>
  )
}

export default DashboardPage

