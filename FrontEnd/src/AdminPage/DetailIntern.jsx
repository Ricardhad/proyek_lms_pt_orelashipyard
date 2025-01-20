import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import client from "@client"; // Koneksi backend (axios instance)

export default function DetailIntern() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook untuk navigasi kembali
  const [internDetail, setInternDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternDetail = async () => {
      try {
        const response = await client.get(`/api/admin/intern/${id}`); // Menggunakan axios instance dari client.js
        setInternDetail(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch intern details');
      } finally {
        setLoading(false);
      }
    };

    fetchInternDetail();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Menggunakan navigate untuk kembali ke halaman sebelumnya
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Interns Detail</h1>

      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <img
            src={internDetail?.user?.Profile_Picture || "https://via.placeholder.com/30"}
            alt="Intern profile"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            className="mb-4"
          />
          <h2 className="text-xl font-bold">{internDetail?.user?.namaUser}</h2>
          <p className="text-gray-500">{internDetail?.user?.email}</p>
          <p className="text-gray-600 mt-2">{internDetail?.AsalSekolah}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div>
              <p className="text-gray-500">No. WA</p>
              <p>{internDetail?.user?.noTelpon}</p>
            </div>
            <div>
              <p className="text-gray-500">NRP</p>
              <p>222117054</p>{internDetail?.user?._id}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Absensi</h3>
            <div className="flex gap-2">
              {internDetail?.absensiKelas?.length > 0 ? (
                internDetail.absensiKelas.map((record, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 border rounded flex items-center justify-center ${
                      record ? 'bg-gray-200' : 'bg-white'
                    }`}
                  >
                    {record && <Check size={16} />}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Belum ada data absensi</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {internDetail?.courseID?.length > 0 ? (
              internDetail.courseID.map((course, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={course.mentor?.Profile_Picture || "https://via.placeholder.com/30"}
                      alt="Mentor profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <p className="font-medium">{course.mentor?.namaUser}</p>
                      <p>{course.namaCourse}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-gray-200 px-2 py-1 rounded text-sm">{course.Deskripsi}</span>
                    </div>
                  </div>
                  <div className="text-right font-bold">90/100</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Belum ada data course</p>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Back */}
      <button
        onClick={handleBack}
        className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
      >
        Back
      </button>
    </div>
  );
}
