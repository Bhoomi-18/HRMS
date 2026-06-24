import { gql } from "@apollo/client";

export const GET_ALL_ATTENDANCE = gql`
  query GetAllAttendance($request: GetAllAttendanceRequestInput!) {
    getAllAttendance(request: $request) {
      data {
        attendance {
          attendanceId
          employeeId
          date
          status
          checkInTime
          checkOutTime
          notes
        }
      }
      message
      statusCode
      success
    }
  }
`;
