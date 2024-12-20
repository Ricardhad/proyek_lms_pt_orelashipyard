'use client'

import { Box, Typography, Avatar, Container } from '@mui/material';
import Layout from '@/components/layout';

export default function ProfilePage() {
  return (
    <Layout>
      <Container className="py-8">
        <Typography variant="h4" className="mb-6 text-center">Mentors</Typography>
        <Box className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Text Section */}
            <div className="md:w-1/2 text-center md:text-left">
              <Typography variant="h3" className="mb-2 font-bold">
                HI, I'm
              </Typography>
              <Typography variant="h3" className="mb-2 font-bold">
                Learning and Developer
              </Typography>
            </div>
            {/* Right Avatar Section */}
            <div className="md:w-1/2 flex justify-center">
              <Avatar
                src="/placeholder.svg" // Replace with your image path
                alt="Mentor Profile"
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  border: '4px solid white',
                }}
                className="shadow-lg"
              />
            </div>
          </div>
        </Box>
      </Container>
    </Layout>
  );
}