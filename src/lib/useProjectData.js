import { create } from "zustand";

export const useProjectDataStore = create((set) => ({
  projectData: {},
  setProjectData: (data) => set({ projectData: data }),
}));