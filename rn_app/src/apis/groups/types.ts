export type ResponseForGetGroups =
  | {
      presence: true;
      id: string;
      ownerId: string;
      members: {
        id: string;
        avatar: string | null;
      }[];
    }
  | {
      presence: false;
    };
