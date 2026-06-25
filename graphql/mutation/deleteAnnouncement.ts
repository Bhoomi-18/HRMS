import { gql } from "@apollo/client";

export const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($request: DeleteAnnouncementRequestInput!) {
    deleteAnnouncement(request: $request) {
      data {
        announcementId
      }
      success
      message
      statusCode
    }
  }
`;
