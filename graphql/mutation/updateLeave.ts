import { gql } from "@apollo/client";

export const UPDATE_LEAVE = gql`
  mutation UpdateLeave($request: UpdateLeaveRequestInput!) {
    updateLeave(request: $request) {
      data {
        leaveId
      }
      message
      statusCode
      success
    }
  }
`;
