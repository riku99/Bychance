export type GetTalkRoomDataResponse = {
  id: number;
  updatedAt: string;
  unreadMessages: {
    id: number;
  }[];
  lastMessage: {
    id: number;
    text: string;
    userId: string;
    createdAt: string;
  }[];
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
  recipient: {
    id: string;
    name: string;
    avatar: string | null;
  };
}[];

export type CreateTalkRoomResponse = {
  presence: boolean;
  roomId: number;
  timestamp: string;
};
