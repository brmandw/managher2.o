// useProjectStore.js
import {create} from "zustand";
import {
  getAllProjects,
  getProject as apiGetProject,
  saveProject as apiSaveProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
} from "./projectApi";

/**
 * Zustand store: useProjectStore
 *
 * Auto fetches projects once when store initialized (first import/use).
 */

export const useProjectStore = create((set, get) => {
  // initiate fetch flag to ensure auto-fetch runs once
  let initialized = false;

  // internal function to perform fetch and set state
  async function fetchProjectsInternal() {
    set({ loading: true, error: null });
    try {
      const projects = await getAllProjects();
      set({ projects: projects || [], loading: false });
    } catch (err) {
      set({ error: err, loading: false });
    }
  }

  // call auto-fetch once synchronously after store creation (but async inside)
  (async () => {
    if (!initialized) {
      initialized = true;
      await fetchProjectsInternal();
    }
  })();

  return {
    projects: [],
    loading: false,
    error: null,

    fetchProjects: async () => {
      await fetchProjectsInternal();
    },

    getProject: async (id) => {
      // try local store first
      const state = get();
      const found = (state.projects || []).find((p) => p.id === id);
      if (found) return found;

      // otherwise fetch single from API/local
      const project = await apiGetProject(id);
      if (project) {
        // add to store
        set((s) => ({ projects: [...(s.projects || []), project] }));
      }
      return project;
    },

    addProject: async (projectData) => {
      set({ loading: true, error: null });
      try {
        const saved = await apiSaveProject(projectData);
        set((s) => {
          // If mock API auto-generated id and returned project matches existing local id, ensure uniqueness
          const existing = (s.projects || []).filter((p) => p.id !== saved.id);
          return { projects: [...existing, saved], loading: false };
        });
        return saved;
      } catch (err) {
        set({ error: err, loading: false });
        throw err;
      }
    },

    updateProject: async (partialProject) => {
      if (!partialProject || !partialProject.id) {
        throw new Error("updateProject requires id");
      }
      set({ loading: true, error: null });
      try {
        const updated = await apiUpdateProject(partialProject);
        set((s) => ({
          projects: (s.projects || []).map((p) => (p.id === updated.id ? updated : p)),
          loading: false,
        }));
        return updated;
      } catch (err) {
        set({ error: err, loading: false });
        throw err;
      }
    },

    removeProject: async (id) => {
      set({ loading: true, error: null });
      try {
        const ok = await apiDeleteProject(id);
        if (ok) {
          set((s) => ({ projects: (s.projects || []).filter((p) => p.id !== id), loading: false }));
        } else {
          set({ loading: false });
        }
        return ok;
      } catch (err) {
        set({ error: err, loading: false });
        throw err;
      }
    },
  };
});
