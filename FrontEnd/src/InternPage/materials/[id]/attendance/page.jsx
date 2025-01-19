import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Checkbox,
} from '@mui/material';
import Layout from '../../../components/layout';

import client from '../../../../client';

const MaterialAttendance = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id corresponds to the modulID
  const [attendanceData, setAttendanceData] = useState([]);
  const [modulData, setModulData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await client.get(`api/anakMagang/modul/${id}/getAttendanceModule`);
        setModulData(response.data);
        setAttendanceData(response.data.absensiID?.absensiKelas || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Attendance
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ backgroundColor: '#f5f5f5' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                <TableCell>ID</TableCell>
                <TableCell>Name & Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((attendance, index) => (
                <TableRow key={index}>
                  <TableCell>{attendance.anakMagangID?._id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={attendance.anakMagangID?.userID?.Profile_Picture} />
                      <Box>
                        <Typography variant="subtitle2">{attendance.anakMagangID?.userID?.namaUser}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {attendance.anakMagangID?.userID?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{attendance.anakMagangID?.userID?.noTelpon}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={attendance.isPresent}
                      disabled
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default MaterialAttendance;
