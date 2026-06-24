import { gql } from "@apollo/client";

export const CREATE_PAYROLL = gql`
  mutation CreatePayroll($request: CreatePayrollRequestInput!) {
    createPayroll(request: $request) {
      data {
        payrollId
      }
      message
      statusCode
      success
    }
  }
`;
