import React from "react";

export default function StudyPlanCardTable({ courses }) {
    return (
      <div className="mb-8 mt-4">
        <div className="overflow-x-auto">
          <div
            className="text-white font-semibold py-2 px-5 pr-14 transform scale-y-[-1] w-fit bg-primary-green rounded-b-sm"
            style={{
              clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
            }}
          >
            <p className="transform scale-y-[-1]">KRS Tersimpan</p>
          </div>
  
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Nama Matkul</th>
                <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Jadwal</th>
                <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">SKS</th>
                <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Semester</th>
                <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Dosen Pengajar</th>
              </tr>
            </thead>
            <tbody className="border-b-4 border-primary-green font-semibold">
              {courses.krs.map((course, index) => (
                <tr key={index} className="text-center">
                  <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.mataKuliah.namaMataKuliah}</td>
                  <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{`${course.hari}, ${course.jamMulai} - ${course.jamSelesai}`}</td>
                  <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.sksTatapMuka + course.sksPraktikum}</td>
                  <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.mataKuliah.semester}</td>
                  <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.dosenPengajar}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className=" text-sm font-bold">
                <td className="px-4 py-2 text-left" colSpan={2}>
                  TOTAL SKS
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {courses.totalSks || 0} <div>SKS</div>
                </td>
                <td colSpan={4}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };