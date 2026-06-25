import { gql } from "@apollo/client";

export const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($request: UpdateAnnouncementRequestInput!) {
    updateAnnouncement(request: $request) {
      data {
        announcementId
      }
      success
      message
      statusCode
    }
  }
`;
