'use client'

import { Grid, Card, CardMedia, CardContent, Typography, Button, Box, Avatar } from '@mui/material'
import Layout from '@/components/layout'
import { Add as AddIcon } from '@mui/icons-material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const materials = [
  {
    id: 1,
    title: 'Materi 1',
    mentorName: 'Mentor Name',
    mentorAvatar: '/placeholder.svg',
    deadline: '12:30 pm',
    type: 'Tugas',
    thumbnail: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Materi 3',
    mentorName: 'Mentor Name',
    mentorAvatar: '/placeholder.svg',
    deadline: '12:30 pm',
    type: 'Latihan',
    thumbnail: '/placeholder.svg'
  },
]

export default function MaterialsPage() {
  const router = useRouter()

  const handleMaterialClick = (material) => {
    if (material.type === 'Tugas') {
      router.push(`/materials/check-tugas/${material.id}`)
    } else if (material.type === 'Latihan') {
      router.push(`/materials/check-latihan/${material.id}`)
    }
  }

  return (
    <Layout>
      <Typography variant="h4" sx={{ p: 3 }}>MATERIAL</Typography>
      <Grid container spacing={3} sx={{ p: 3 }}>
        {materials.map((material) => (
          <Grid item key={material.id}>
            <Card 
              sx={{ display: 'flex', height: '100%', cursor: 'pointer' }}
              onClick={() => handleMaterialClick(material)}
            >
              <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={material.thumbnail}
                alt={material.title}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar src={material.mentorAvatar} sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">{material.mentorName}</Typography>
                  </Box>
                  <Typography variant="h6">{material.title}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="error">
                      Deadline {material.deadline}
                    </Typography>
                    <Button
                      size="small"
                      sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
                    >
                      {material.type}
                    </Button>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Link href="/materials/add" style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e0e0e0',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>TAMBAH MATERI</Typography>
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Layout>
  )
}

