import { gql } from "@apollo/client";

export const UPDATE_PAYROLL = gql`
  mutation UpdatePayroll($request: UpdatePayrollRequestInput!) {
    updatePayroll(request: $request) {
      data {
        payrollId
      }
      message
      statusCode
      success
    }
  }
`;
