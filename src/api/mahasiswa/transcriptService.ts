import { Api } from "../Index";
import { ITranscriptData } from "../../types/mahasiswa.types";

export const transcriptService = {
    /**
     * Fetches the complete transcript data for the student.
     */
    getTranscript: async (): Promise<ITranscriptData> => {
        const response = await Api.get("/mahasiswa/transkip");
        return response.data.data;
    },
};