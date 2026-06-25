import { gql } from "@apollo/client";

export const GET_ALL_ANNOUNCEMENT = gql`
  query GetAllAnnouncement($request: GetAllAnnouncementRequestInput!) {
    getAllAnnouncement(request: $request) {
      data {
        announcement {
          id
          announcementId
          title
          category
          priority
          content
          visibilityScope
          expiryDate
          views
          acknowledgements
          createdBy
          createdAt
        }
      }
      meta {
        totalCount
        skip
        take
      }
      success
      message
      statusCode
    }
  }
`;
