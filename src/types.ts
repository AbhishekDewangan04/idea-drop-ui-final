export type Idea = {
  id: string;
  _id?: string;
  title: string;
  description: string;
  summary: string;
  user?: string;
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