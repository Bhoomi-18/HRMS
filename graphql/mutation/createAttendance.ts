import { gql } from "@apollo/client";

export const CREATE_ATTENDANCE = gql`
  mutation CreateAttendance($request: CreateAttendanceRequestInput!) {
    createAttendance(request: $request) {
      data {
        attendanceId
      }
      message
      statusCode
      success
    }
  }
`;
