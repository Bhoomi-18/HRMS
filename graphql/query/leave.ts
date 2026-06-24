import { gql } from "@apollo/client";

export const GET_ALL_LEAVE = gql`
  query GetAllLeave($request: GetAllLeaveRequestInput!) {
    getAllLeave(request: $request) {
      data {
        leave {
          leaveId
          employeeId
          leaveType
          startDate
          endDate
          reason
          status
        }
      }
      message
      statusCode
      success
    }
  }
`;
