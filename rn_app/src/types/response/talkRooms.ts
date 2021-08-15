export type TalkRoomDataResponse = {
  id: number;
  updatedAt: string;
  unreadMessages: {
    id: number;
  }[];
  lastMessage: {
    id: number;
    text: string;
  }[];
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar: string;
  };
}[];
