import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIssues } from '../store/issuesSlice.ts';
import { Input, Button, Spin } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import KanbanColumns from './KanbanColumns.tsx';
import RepoInfo from './RepoInfo.tsx';
//import { RootState } from '../store/store.ts';
import { useActions } from '../hooks/useActions.js';
import {
  selectRepoName,
  selectRepoOwner,
  selectStatus,
} from '../store/selectors.ts';

const KanbanBoard: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [repoPath, setRepoPath] = useState('');

  const dispatch = useDispatch();
  const { loadStoredState } = useActions();

  const status = useSelector(selectStatus);
  const repoOwner = useSelector(selectRepoOwner);
  const repoName = useSelector(selectRepoName);

  const storedState = localStorage.getItem(repoPath);

  useEffect(() => {
    if (repoPath) {
      if (storedState) {
        loadStoredState(repoPath);
        return;
      }
      dispatch(fetchIssues(repoPath));
    }
  }, [repoPath, dispatch, storedState, loadStoredState]);

  const handleLoad = () => {
    if (repoUrl.includes('github.com/')) {
      const path = repoUrl.split('github.com/')[1];
      setRepoPath(path);
    }
  };

  return (
    <div className="kanban-container">
      <div className="repo-input">
        <Input
          placeholder="Введіть URL репозиторію"
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
        />
        <Button onClick={handleLoad} type="primary">
          Завантажити
        </Button>
      </div>
      {repoOwner && repoName && (
        <RepoInfo repoOwner={repoOwner} repoName={repoName} />
      )}
      {status === 'loading' && <Spin size="large" />}
      <KanbanColumns repoPath={repoPath} />
    </div>
  );
};

export default KanbanBoard;
