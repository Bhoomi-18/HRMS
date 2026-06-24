import { gql } from "@apollo/client";

export const DELETE_ATTENDANCE = gql`
  mutation DeleteAttendance($request: DeleteAttendanceRequestInput!) {
    deleteAttendance(request: $request) {
      data {
        attendanceId
      }
      message
      statusCode
      success
    }
  }
`;
