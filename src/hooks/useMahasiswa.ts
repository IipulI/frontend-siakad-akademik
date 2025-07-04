import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";

// interface AnnouncementsProps {
//   status: string;
//   message: string;
//   data: [];
// }

export default function getAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await Api.get("/mahasiswa/pengumuman");
      return response.data.data;
    },
  });
}
