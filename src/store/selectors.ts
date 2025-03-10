import { RootState } from './store';

export const selectStatus = (state: RootState) => state.issues.status;
export const selectRepoOwner = (state: RootState) => state.issues.repoOwner;
export const selectRepoName = (state: RootState) => state.issues.repoName;
export const selectIssues = (state: RootState) => state.issues.issues;
