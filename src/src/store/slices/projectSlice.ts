import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProjectState, Project } from '../../types';
import { projectService } from '../../services/projectService';
const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 0,
    limit: 10
  }
};
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (params: any = {}, {
  rejectWithValue
}) => {
  try {
    const response = await projectService.getProjects(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch projects');
  }
});
export const fetchProjectById = createAsyncThunk('projects/fetchProjectById', async (id: string, {
  rejectWithValue
}) => {
  try {
    const response = await projectService.getProjectById(id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch project');
  }
});
export const createProject = createAsyncThunk('projects/createProject', async (data: Partial<Project>, {
  rejectWithValue
}) => {
  try {
    const response = await projectService.createProject(data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create project');
  }
});
export const updateProject = createAsyncThunk('projects/updateProject', async ({
  id,
  data
}: {
  id: string;
  data: Partial<Project>;
}, {
  rejectWithValue
}) => {
  try {
    const response = await projectService.updateProject(id, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update project');
  }
});
export const deleteProject = createAsyncThunk('projects/deleteProject', async (id: string, {
  rejectWithValue
}) => {
  try {
    await projectService.deleteProject(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete project');
  }
});
const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: state => {
      state.currentProject = null;
    },
    clearError: state => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    // Fetch Projects
    builder.addCase(fetchProjects.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = action.payload.projects;
      state.pagination = action.payload.pagination;
    }).addCase(fetchProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Project By ID
    builder.addCase(fetchProjectById.pending, state => {
      state.loading = true;
    }).addCase(fetchProjectById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProject = action.payload;
    }).addCase(fetchProjectById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Project
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.projects.unshift(action.payload);
    });

    // Update Project
    builder.addCase(updateProject.fulfilled, (state, action) => {
      const index = state.projects.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      if (state.currentProject?._id === action.payload._id) {
        state.currentProject = action.payload;
      }
    });

    // Delete Project
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.projects = state.projects.filter(p => p._id !== action.payload);
    });
  }
});
export const {
  clearCurrentProject,
  clearError
} = projectSlice.actions;
export default projectSlice.reducer;