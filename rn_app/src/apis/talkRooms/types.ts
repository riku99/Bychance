type Blocked = {
  id: number;
  createdAt: string;
  blockBy: string;
  blockTo: string;
}[];

export type ResponseForGetTalkRoomData = {
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
    blocked: Blocked;
  };
  recipient: {
    id: string;
    name: string;
    avatar: string | null;
    blocked: Blocked;
  };
}[];

export type ResponseForPostTalkRooms = {
  presence: boolean;
  roomId: number;
  timestamp: string;
};
