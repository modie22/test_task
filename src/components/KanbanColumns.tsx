import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moveIssue } from '../store/issuesSlice.ts';
import './App.css';
import { RootState } from '../store/store.ts';
import { Issue } from '../types';

interface KanbanColumnsProps {
  repoPath: string;
}

const KanbanColumns: React.FC<KanbanColumnsProps> = ({ repoPath }) => {
  const dispatch = useDispatch();
  const { issues } = useSelector((state: RootState) => state.issues);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    issue: Issue,
    sourceColumn: string
  ) => {
    e.dataTransfer.setData('issue', JSON.stringify({ issue, sourceColumn }));
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumn: string
  ) => {
    const dataString = e.dataTransfer.getData('issue');
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        dispatch(
          moveIssue({
            source: data.sourceColumn,
            destination: targetColumn,
            issue: data.issue,
            repoPath,
          })
        );
      } catch (error) {
        console.error('Помилка парсингу JSON', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="kanban-columns">
      {['ToDo', 'In Progress', 'Done'].map(column => (
        <div
          key={column}
          className="kanban-column"
          onDrop={e => handleDrop(e, column)}
          onDragOver={handleDragOver}
        >
          <h2>{column}</h2>
          {issues[column]?.map(issue => (
            <div
              key={issue.id}
              className="kanban-card"
              draggable
              onDragStart={e => handleDragStart(e, issue, column)}
            >
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {issue.title}
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanColumns;
