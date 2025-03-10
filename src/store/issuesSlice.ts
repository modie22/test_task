import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Issue, IssuesState } from '../types';

// Функція для отримання задач із GitHub API
export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (repoPath: string) => {
    const response = await fetch(
      `https://api.github.com/repos/${repoPath}/issues`
    );
    if (!response.ok) throw new Error('Не вдалося завантажити задачі');
    return response.json();
  }
);

// Ініціальний стан
const initialState: IssuesState = {
  issues: { ToDo: [], 'In Progress': [], Done: [] },
  status: 'idle',
  repoOwner: '',
  repoName: '',
};

// Створення slice
const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    moveIssue: (
      state,
      action: PayloadAction<{
        source: string;
        destination: string;
        issue: Issue;
        repoPath: string;
      }>
    ) => {
      const { source, destination, issue, repoPath } = action.payload;
      state.issues[source] = state.issues[source].filter(
        i => i.id !== issue.id
      );
      state.issues[destination].push(issue);
      localStorage.setItem(`${repoPath}`, JSON.stringify(state.issues));
    },
    loadStoredState: (state, action: PayloadAction<string>) => {
      const storedState = localStorage.getItem(`${action.payload}`);
      if (storedState) {
        state.issues = JSON.parse(storedState);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchIssues.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.issues = {
          ToDo: action.payload.filter((issue: Issue) => !issue.assignee),
          'In Progress': action.payload.filter(
            (issue: Issue) => issue.assignee
          ),
          Done: [],
        };
        const [owner, name] = action.meta.arg.split('/');
        state.repoOwner = owner;
        state.repoName = name;
      })
      .addCase(fetchIssues.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const { moveIssue, loadStoredState } = issuesSlice.actions;
export const { actions } = issuesSlice;
export default issuesSlice.reducer;
