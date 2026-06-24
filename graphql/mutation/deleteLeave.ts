import { gql } from "@apollo/client";

export const DELETE_LEAVE = gql`
  mutation DeleteLeave($request: DeleteLeaveRequestInput!) {
    deleteLeave(request: $request) {
      data {
        leaveId
      }
      message
      statusCode
      success
    }
  }
`;
