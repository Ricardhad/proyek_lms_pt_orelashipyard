import React from 'react';
import MainLayout from '../main-layout';
import {
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// const announcements = [
//   {
//     id: 1,
//     title: 'Perubahan jadwal masuk magang',
//     date: '30 Oktober 2099',
//     author: 'Admin Magang',
//     content: 'Mohon perhatian untuk semua peserta magang. Mulai minggu depan, jadwal masuk akan berubah menjadi pukul 08.00 WIB. Harap disesuaikan.',
//   },
//   {
//     id: 2,
//     title: 'Pengumpulan laporan bulanan',
//     date: '25 Oktober 2099',
//     author: 'Koordinator Magang',
//     content: 'Diingatkan kepada seluruh peserta magang untuk mengumpulkan laporan bulanan paling lambat tanggal 5 setiap bulannya.',
//   },
//   {
//     id: 3,
//     title: 'Seminar online: Teknologi AI terbaru',
//     date: '20 Oktober 2099',
//     author: 'Divisi Pelatihan',
//     content: 'Kami mengundang seluruh peserta magang untuk mengikuti seminar online tentang perkembangan terbaru dalam teknologi AI. Seminar akan diadakan pada tanggal 1 November 2099.',
//   },
// ];

export default function Announcements() {
  return (
   <MainLayout>
    {/* <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Announcements
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search announcements"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Card>
        <CardContent>
          <List>
            {announcements.map((announcement, index) => (
              <React.Fragment key={announcement.id}>
                {index > 0 && <Divider />}
                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="primary">
                        {announcement.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {announcement.author} - {announcement.date}
                        </Typography>
                        <Typography
                          component="p"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {announcement.content}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box> */}
    </MainLayout>
  );
}

