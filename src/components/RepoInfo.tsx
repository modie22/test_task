import React from "react";

interface RepoInfoProps {
  repoOwner: string;
  repoName: string;
}

const RepoInfo: React.FC<RepoInfoProps> = ({ repoOwner, repoName }) => {
  return (
    <div className="repo-info">
      <a href={`https://github.com/${repoOwner}`} target="_blank" rel="noopener noreferrer">
        Профіль власника: {repoOwner}
      </a>
      <br />
      <a href={`https://github.com/${repoOwner}/${repoName}`} target="_blank" rel="noopener noreferrer">
        Репозиторій: {repoName}
      </a>
    </div>
  );
};

export default RepoInfo;