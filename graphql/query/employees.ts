import { gql } from "@apollo/client";

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees($request: GetAllEmployeesRequestInput!) {
    getAllEmployees(request: $request) {
      data {
        employees {
          employeeId
          employeeCode
          firstName
          lastName
          email
          phone
          department
          designation
          joiningDate
          employmentType
          salary
          status
        }
      }
      message
      statusCode
      success
    }
  }
`;
