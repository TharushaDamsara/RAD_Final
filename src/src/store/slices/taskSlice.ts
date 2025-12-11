import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskState, Task } from '../../types';
import { taskService } from '../../services/taskService';
const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    total: 0,
    page: 1,
    pages: 0,
    limit: 10
  }
};
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (params: any = {}, {
  rejectWithValue
}) => {
  try {
    const response = await taskService.getTasks(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
  }
});
export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (id: string, {
  rejectWithValue
}) => {
  try {
    const response = await taskService.getTaskById(id);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch task');
  }
});
export const createTask = createAsyncThunk('tasks/createTask', async (data: Partial<Task>, {
  rejectWithValue
}) => {
  try {
    const response = await taskService.createTask(data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create task');
  }
});
export const updateTask = createAsyncThunk('tasks/updateTask', async ({
  id,
  data
}: {
  id: string;
  data: Partial<Task>;
}, {
  rejectWithValue
}) => {
  try {
    const response = await taskService.updateTask(id, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update task');
  }
});
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string, {
  rejectWithValue
}) => {
  try {
    await taskService.deleteTask(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
  }
});
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearFilters: state => {
      state.filters = {};
    },
    clearCurrentTask: state => {
      state.currentTask = null;
    },
    clearError: state => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    // Fetch Tasks
    builder.addCase(fetchTasks.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload.tasks;
      state.pagination = action.payload.pagination;
    }).addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Task By ID
    builder.addCase(fetchTaskById.fulfilled, (state, action) => {
      state.currentTask = action.payload;
    });

    // Create Task
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.unshift(action.payload);
    });

    // Update Task
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });

    // Delete Task
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    });
  }
});
export const {
  setFilters,
  clearFilters,
  clearCurrentTask,
  clearError
} = taskSlice.actions;
export default taskSlice.reducer;