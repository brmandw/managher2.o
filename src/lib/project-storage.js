// MOCK MODE — All project data is temporarily stored in localStorage.

import { useProjectDataStore } from "./useProjectData";

const STORAGE_KEY = 'currentProject';

/**
 * Loads the entire project data object from localStorage.
 * @returns {object | null} The project data or null if not found.
 */
export function loadProjectData() {
  if (typeof window === 'undefined') {
    return null;
  }
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Saves the entire project data object to localStorage.
 * @param {object} projectData The complete project data object.
 */
export function saveProjectData(projectData) {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectData));
}

/**
 * A utility function to update parts of the project data.
 * It loads the current data, merges the update, and saves it back.
 * @param {object | ((currentData: object) => object)} dataUpdate A partial object of the data to update or a function to produce it.
 */
export function updateProjectData(dataUpdate) {
    const currentData = loadProjectData();
    if (!currentData) {
        console.error("Cannot update project data, no existing data found.");
        return;
    }

    const update = typeof dataUpdate === 'function' ? dataUpdate(currentData) : dataUpdate;

    // A simple deep merge for nested objects
    const deepMerge = (target, source) => {
        const output = { ...target };
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }
    const isObject = (item) => {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    const newData = deepMerge(currentData, update);
    saveProjectData(newData);
    useProjectDataStore.getState().setProjectData(newData);
}
