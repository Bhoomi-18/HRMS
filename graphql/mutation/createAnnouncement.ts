import { gql } from "@apollo/client";

export const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($request: CreateAnnouncementRequestInput!) {
    createAnnouncement(request: $request) {
      data {
        announcementId
      }
      success
      message
      statusCode
    }
  }
`;
