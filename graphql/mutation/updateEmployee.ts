import { gql } from "@apollo/client";

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($request: UpdateEmployeeRequestInput!) {
    updateEmployee(request: $request) {
      data {
        employeeId
      }
      message
      statusCode
      success
    }
  }
`;
