import { gql } from "@apollo/client";

export const CREATE_STUDIO = gql`
  mutation createStudio($input: CreateStudioInput!) {
    createStudio(input: $input) {
      id
      name
      description
      studioType
      owner {
        status
        createdAt
        updatedAt
      }
      category
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_STUDIO = gql`
  query getStudio($studioId: String!) {
    getStudio(studioId: $studioId) {
      id
      name
      description
      studioType
      owner {
        status
        createdAt
        updatedAt
      }
      category
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_STUDIO = gql`
  mutation updateStudio($studioId: String!, $input: UpdateStudioInput!) {
    updateStudio(studioId: $studioId, input: $input) {
      id
      name
      description
      studioType
      owner {
        status
        createdAt
        updatedAt
      }
      category
      status
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_STUDIO = gql`
  mutation deleteStudio($studioId: String!) {
    deleteStudio(studioId: $studioId) {
      success
      message
    }
  }
`;

// TypeScript Interfaces
export interface CreateStudioInput {
  name: string;
  description: string;
  studioType: "PUBLIC" | "PRIVATE";
  category: string;
}

export interface UpdateStudioInput {
  name?: string;
  description?: string;
  studioType?: "PUBLIC" | "PRIVATE";
  category?: string;
}

export interface StudioOwner {
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Studio {
  id: string;
  name: string;
  description: string;
  studioType: "PUBLIC" | "PRIVATE";
  owner: StudioOwner;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudioResponse {
  createStudio: Studio;
}

export interface GetStudioResponse {
  getStudio: Studio;
}

export interface UpdateStudioResponse {
  updateStudio: Studio;
}

export interface DeleteStudioResponse {
  deleteStudio: {
    success: boolean;
    message: string;
  };
}
