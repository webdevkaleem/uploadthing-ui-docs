import { UTUIFileStatus, UTUIUploadFile } from "@/lib/uploadthing-ui-types";
import { create } from "zustand";

// Local Imports

// Body

interface FilesState {
  historicFiles: UTUIUploadFile[];
  setFiles: (newFiles: UTUIUploadFile[]) => void;
  updateFileStatus: (id: string, status: UTUIFileStatus, url?: string) => void;
  removeFile: (id: string) => void;
}

export const useUploadthingStore = create<FilesState>()((set) => ({
  historicFiles: [],
  setFiles: (newFiles) =>
    set((state) => {
      // Check if the file is already in the historicFiles array. If not, add it as well
      const newHistoricFiles = Array.from(newFiles).filter(
        (file) =>
          !state.historicFiles.some(
            (historicFile) => historicFile.id === file.id,
          ),
      );

      return {
        historicFiles: [...state.historicFiles, ...newHistoricFiles],
      };
    }),
  updateFileStatus: (id, status, url) =>
    set((state) => ({
      historicFiles: state.historicFiles.map((item) =>
        item.id === id ? { ...item, status, url } : item,
      ),
    })),
  removeFile: (id) =>
    set((state) => ({
      historicFiles: state.historicFiles.filter((item) => item.id !== id),
    })),
}));
