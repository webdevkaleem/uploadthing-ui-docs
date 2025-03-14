import { create } from "zustand";

// Local Imports

// Body
export type FileStatus = "pending" | "uploading" | "complete" | "error";

export interface UploadFile {
  id: string;
  file: File;
  status: FileStatus;
  url?: string;
  createdAt: Date;
}

interface FilesState {
  historicFiles: UploadFile[];
  setFiles: (newFiles: UploadFile[]) => void;
  updateFileStatus: (id: string, status: FileStatus, url?: string) => void;
  removeFile: (id: string) => void;
}

export const useUploadthingStore = create<FilesState>()((set) => ({
  files: [],
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
        files: newFiles,
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
