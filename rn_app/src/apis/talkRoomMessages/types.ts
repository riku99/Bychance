export type ResponseForGetTalkRoomMessages = {
  roomPresence: boolean;
  messages: {
    id: number;
    userId: string;
    text: string;
    createdAt: string;
  }[];
};

export type ResponseForPostTalkRoomMessage =
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
