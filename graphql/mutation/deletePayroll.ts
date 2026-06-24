import { gql } from "@apollo/client";

export const DELETE_PAYROLL = gql`
  mutation DeletePayroll($request: DeletePayrollRequestInput!) {
    deletePayroll(request: $request) {
      data {
        payrollId
      }
      message
      statusCode
      success
    }
  }
`;
