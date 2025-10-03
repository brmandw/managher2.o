// interface Project {
//   id: string;
//   business: {
//     name: string;
//     type: string;
//     products: string;
//     description?: string;
//   };
//   marketability?: {
//     nicheSuggestion?: string;
//     positioningStatement?: string;
//     targetSegments?: string[];
//   };
//   financials?: {
//     monthlyProjection?: {
//       revenue: number;
//       costs: number;
//       profit: number;
//     };
//     readinessProfile?: {
//       score: number;
//       recommendations: string[];
//     };
//   };
//   innovation?: {
//     variants?: Array<{
//       name: string;
//       description: string;
//     }>;
//   };
// }

// projectApi.js
const API_URL = "https://68d928fc90a75154f0d9af84.mockapi.io/project/projects";

/**
 * Helpers
 */
function hasLocalStorage() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function makeLocalKey(id) {
  return `project-${id}`;
}

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Serialize ProjectData to the API shape:
 * { businessName, businessType, data: JSON.stringify(fullProject) }
 */
function serializeForApi(project) {
  const businessName = project.business?.name ?? "";
  const businessType = project.business?.type ?? "";
  const payload = {
    businessName,
    businessType,
    data: JSON.stringify(project),
  };
  return payload;
}

/**
 * Deserialize API object back to ProjectData
 * API object shape assumed:
 * { id, businessName, businessType, data }
 */
function deserializeFromApi(apiObj) {
  if (!apiObj) return null;
  let parsed = {};
  try {
    parsed = apiObj.data ? JSON.parse(apiObj.data) : {};
  } catch (e) {
    // fallback: if data is not JSON, ignore
    parsed = {};
  }
  // Ensure business fields exist and reflect top-level fields if present
  parsed.id = parsed.id ?? apiObj.id ?? generateId();
  parsed.business = parsed.business ?? {};
  if (apiObj.businessName) parsed.business.name = apiObj.businessName;
  if (apiObj.businessType) parsed.business.type = apiObj.businessType;
  return parsed;
}

/**
 * Save project (POST). If online and API ok -> return server project (parsed).
 * If API fails or offline -> save to localStorage and return project (with id).
 *
 * ID strategy: MockAPI auto generates id. So when calling API we DO NOT send id.
 * For local fallback we generate an id.
 */
export async function saveProject(project) {
  // clone project to avoid side-effects
  const projectClone = JSON.parse(JSON.stringify(project));
  // If no id and we're saving locally, generate an id
  if (!projectClone.id) {
    projectClone.id = generateId();
  }

  const payload = serializeForApi(projectClone);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`API POST failed ${res.status}`);
    }

    const apiObj = await res.json();
    // parse returned object into ProjectData
    const saved = deserializeFromApi(apiObj);

    // If server didn't preserve some nested fields, prefer server result but keep local data merged
    const merged = { ...projectClone, ...saved };
    return merged;
  } catch (err) {
    // fallback: localStorage
    if (hasLocalStorage()) {
      const id = projectClone.id || generateId();
      projectClone.id = id;
      try {
        localStorage.setItem(makeLocalKey(id), JSON.stringify(projectClone));
      } catch (e) {
        console.error("localStorage set failed:", e);
      }
    }
    return projectClone;
  }
}

/**
 * Get single project by id
 * Try API first: GET /project/:id -> then parse
 * If API fails -> try localStorage
 */
export async function getProject(id) {
  if (!id) return null;

  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch from API");
    const apiObj = await res.json();
    const project = deserializeFromApi(apiObj);
    return project;
  } catch (err) {
    // fallback to localStorage
    if (hasLocalStorage()) {
      const raw = localStorage.getItem(makeLocalKey(id));
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }
}

/**
 * Get all projects
 * If API OK -> return parsed list
 * Else fallback to localStorage (all keys starting with project-)
 */
export async function getAllProjects() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch list from API");
    const arr = await res.json();
    // arr is list of API objects, parse each
    const parsed = Array.isArray(arr) ? arr.map(deserializeFromApi) : [];
    return parsed;
  } catch (err) {
    // fallback to localStorage
    const results = [];
    if (hasLocalStorage()) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("project-")) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              results.push(JSON.parse(raw));
            } catch (e) {
              // ignore broken item
            }
          }
        }
      }
    }
    return results;
  }
}

/**
 * Update project (PUT /project/:id)
 * If API success -> return parsed server project
 * If API fails -> update localStorage (if exists), return merged project
 */
export async function updateProject(projectPartial) {
  if (!projectPartial || !projectPartial.id) {
    throw new Error("updateProject requires projectPartial with id");
  }
  const id = projectPartial.id;
  // Merge existing local copy (if any) with updates to produce a full object for serialization
  let base = {};
  try {
    base = (await getProject(id)) || {};
  } catch (_) {
    base = {};
  }
  const updated = { ...base, ...projectPartial };
  // ensure nested objects are merged reasonably (basic deep merge for business)
  if (base.business || projectPartial.business) {
    updated.business = { ...(base.business || {}), ...(projectPartial.business || {}) };
  }

  const payload = serializeForApi(updated);

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("API update failed");
    const apiObj = await res.json();
    const serverProject = deserializeFromApi(apiObj);
    return { ...updated, ...serverProject };
  } catch (err) {
    // fallback: update localStorage
    if (hasLocalStorage()) {
      try {
        localStorage.setItem(makeLocalKey(id), JSON.stringify(updated));
      } catch (e) {
        console.error("localStorage set failed on update:", e);
      }
    }
    return updated;
  }
}

/**
 * Delete project
 * Try API delete, if ok -> remove localStorage too
 * If API fails -> still remove localStorage (best-effort)
 */
export async function deleteProject(id) {
  if (!id) return false;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("API delete failed");
    // delete local copy if any
    if (hasLocalStorage()) {
      localStorage.removeItem(makeLocalKey(id));
    }
    return true;
  } catch (err) {
    // fallback: remove local only
    if (hasLocalStorage()) {
      try {
        localStorage.removeItem(makeLocalKey(id));
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
}
