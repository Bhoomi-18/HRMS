import { gql } from "@apollo/client";

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($request: DeleteEmployeeRequestInput!) {
    deleteEmployee(request: $request) {
      data {
        employeeId
      }
      message
      statusCode
      success
    }
  }
`;
