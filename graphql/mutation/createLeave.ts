import { gql } from "@apollo/client";

export const CREATE_LEAVE = gql`
  mutation CreateLeave($request: CreateLeaveRequestInput!) {
    createLeave(request: $request) {
      data {
        leaveId
      }
      message
      statusCode
      success
    }
  }
`;
