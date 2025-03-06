export interface Issue {
    id: number;
    title: string;
    body: string;
    html_url: string;
    assignee: {
      login: string;
      avatar_url: string;
    } | null;
  }
  
  export interface IssuesState {
    issues: {
      ToDo: Issue[];
      "In Progress": Issue[];
      Done: Issue[];
    };
    status: "idle" | "loading" | "succeeded" | "failed";
    repoOwner: string;
    repoName: string;
  }
  