import React from 'react'
import { Card, CardContent, Typography, Chip, Avatar } from '@mui/material'
import Image from 'next/image'

function MaterialCard({ mentorName, mentorImage, materialNumber, score, deadline, tag }) {
  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0 flex">
        <div className="relative w-48 h-32 bg-gray-200">
          <Image
            src="/placeholder.svg?height=128&width=192"
            alt={`Material ${materialNumber}`}
            layout="fill"
            className="object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Avatar
                src={mentorImage}
                alt={mentorName}
                className="w-6 h-6"
              />
              <div className="flex items-center gap-2">
                <Typography variant="subtitle2">
                  {mentorName}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Materi {materialNumber}
                </Typography>
              </div>
            </div>
            <Typography variant="h6" className="font-bold">
              {score}
            </Typography>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Typography variant="caption" className="text-red-500">
              Deadline: {deadline}
            </Typography>
            <Chip
              label={tag}
              size="small"
              className="bg-gray-200 text-gray-700"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MaterialCard

