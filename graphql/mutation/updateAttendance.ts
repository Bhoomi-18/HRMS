import { gql } from "@apollo/client";

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($request: UpdateAttendanceRequestInput!) {
    updateAttendance(request: $request) {
      data {
        attendanceId
      }
      message
      statusCode
      success
    }
  }
`;
