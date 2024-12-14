import React from 'react'
import { Typography, Avatar, Paper, Box, Checkbox } from '@mui/material'

function InternProfileHeader() {
  // Create array of 15 checkboxes for attendance
  const attendanceBoxes = Array(15).fill(false)

  return (
    <Paper className="mb-6 bg-gray-200 p-6 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="z-10">
          <Typography variant="h3" className="text-white font-light mb-2">
            HI, I'm
          </Typography>
          <Typography variant="h4" className="text-white font-medium">
            Learning and Developer
          </Typography>
          
          <Box className="mt-6">
            <Typography variant="subtitle1" className="text-white mb-2">
              Absensi
            </Typography>
            <div className="flex gap-1">
              {attendanceBoxes.map((_, index) => (
                <Checkbox
                  key={index}
                  defaultChecked={index < 10}
                  size="small"
                  className="bg-white/10 rounded p-1"
                  sx={{
                    color: 'white',
                    '&.Mui-checked': {
                      color: 'white',
                    },
                  }}
                />
              ))}
            </div>
          </Box>
        </div>

        <div className="text-right z-10">
          <Avatar
            src="/placeholder.svg?height=120&width=120"
            alt="Esthera Jackson"
            sx={{ width: 120, height: 120 }}
            className="mb-4 ml-auto"
          />
          <Typography variant="h6" className="text-white">
            Esthera Jackson
          </Typography>
          <Typography variant="body2" className="text-white/80">
            esthera@example.com
          </Typography>
          <Typography variant="caption" className="text-white/60 block mt-4">
            SMKN 8
          </Typography>
          <div className="flex justify-end gap-8 mt-2">
            <div className="text-center">
              <Typography variant="caption" className="text-white/60 block">
                NIS
              </Typography>
              <Typography variant="body2" className="text-white">
                08/123/0938
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="caption" className="text-white/60 block">
                TTL
              </Typography>
              <Typography variant="body2" className="text-white">
                12/08/98
              </Typography>
            </div>
          </div>
        </div>

        {/* Background text */}
        <Typography
          variant="h1"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-8xl font-bold"
        >
          Intern
        </Typography>
      </div>
    </Paper>
  )
}

export default InternProfileHeader

