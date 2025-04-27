import MainLayout from "../../components/layouts/MainLayout";
import ContentCard from "../../components/final level/layout/ContentCard";
import ActionButton from "../../components/final level/ActionButton";
import React from "react";
import { BiLinkExternal } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";

export default function SupportingActivitiesReport() {
  const handleSee = () => {
    alert("Tampilkan");
  };
  const handleNewTab = () => {
    alert("tab baru");
  };

  return (
    <MainLayout titlePage="Laporan Kegiatan Pendukung">
      <ContentCard>
        <table className="text-sm xl:text-base p-5 w-full rounded-4xl border-separate border-spacing-0 border-2 border-gray-300 -mt-7">
          <tbody>
            <tr>
              <td className="p-2">Priode Akademik</td>
              <td className="p-2">
                <select
                  name=""
                  id=""
                  className="w-full p-2 border-2 rounded-sm bg-gray-50"
                >
                  <option value="2024 Genap">2024 Genap</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="p-2">Unit Kerja</td>
              <td className="p-2">
                <select
                  name=""
                  id=""
                  className="w-full p-2 border-2 rounded-sm bg-gray-50"
                >
                  <option value="2024 Genap">S1 - Teknik Informatika</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="p-2">Jenis Kegiatan</td>
              <td className="p-2">
                <select
                  name=""
                  id=""
                  className="w-full p-2 border-2 rounded-sm bg-gray-50"
                >
                  <option value="2024 Genap">
                    - - Pilih Jenis Kegiatan - -
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="p-2">Format</td>
              <td className="p-2">
                <select
                  name=""
                  id=""
                  className="w-full p-2 border-2 rounded-sm bg-gray-50"
                >
                  <option value="2024 Genap">HTML</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="p-2">KOP</td>
              <td className="p-2 flex items-center space-x-2">
                <input type="checkbox" className="border-2 w-4 h-4" />
                <label htmlFor="">Gunakan KOP</label>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex w-full gap-3 mt-3 justify-end">
          <ActionButton
            icon={<FaRegEye />}
            label="Tampilkan"
            onClick={handleSee}
            bgColor={"bg-primary-blueDark"}
            hoverColor={"hover:bg-blue-800"}
          />
          <ActionButton
            icon={<BiLinkExternal />}
            label="Lihat di Tab Baru"
            onClick={handleNewTab}
            bgColor={"bg-primary-blueSoft"}
            hoverColor={"hover:bg-blue-400"}
          />
        </div>
      </ContentCard>
    </MainLayout>
  );
}
