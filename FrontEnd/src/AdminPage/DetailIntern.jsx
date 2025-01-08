import React from 'react';
import { Check } from 'lucide-react';

export default function DetailIntern() {
  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Interns Detail</h1>

      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/placeholder.svg?height=200&width=200"
            alt="Intern profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold">Esthera Jackson</h2>
          <p className="text-gray-500">esthera@simmmple.com</p>
          <p className="text-gray-600 mt-2">SMAN 6</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div>
              <p className="text-gray-500">No. WA</p>
              <p>08123456789</p>
            </div>
            <div>
              <p className="text-gray-500">NRP</p>
              <p>123456789</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Absensi</h3>
            <div className="flex gap-2">
              {Array(15).fill(null).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 border rounded flex items-center justify-center
                    ${i < 14 ? 'bg-gray-200' : 'bg-white'}`}
                >
                  {i < 14 && <Check size={16} />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <img src="/placeholder.svg?height=40&width=40" alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-medium">Mentor Name</p>
                  <p>Materi 1</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">Tugas</span>
                </div>
              </div>
              <div className="text-right font-bold">90/100</div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <img src="/placeholder.svg?height=40&width=40" alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <p className="font-medium">Mentor Name</p>
                  <p>Materi 3</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">Project</span>
                </div>
              </div>
              <div className="text-right font-bold">90/100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

