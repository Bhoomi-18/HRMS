import { gql } from "@apollo/client";

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($request: CreateEmployeeRequestInput!) {
    createEmployee(request: $request) {
      data {
        employeeId
      }
      message
      statusCode
      success
    }
  }
`;
