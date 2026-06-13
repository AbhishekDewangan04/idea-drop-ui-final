export type Idea = {
  id: string;
  title: string;
  description: string;
  summary: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
};

export type AuthResponseType = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};