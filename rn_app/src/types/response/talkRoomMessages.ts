export type GetTalkRoomMessagesResponse = {
  roomPresence: boolean;
  messages: {
    id: number;
    userId: string;
    text: string;
    createdAt: string;
  }[];
};

export type CreateTalkRoomMessageResponse =
  | {
      talkRoomPrecence: false;
      talkRoomId: number;
    }
  | {
      talkRoomPrecence: true;
      message: {
        text: string;
        createdAt: string;
        id: number;
        userId: string;
        roomId: number;
      };
    };

export type RecieveTalkRoomMessageWithSocket = {
  message: {
    id: number;
    userId: string;
    roomId: number;
    text: string;
    createdAt: string;
  };
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
  show: boolean;
};
