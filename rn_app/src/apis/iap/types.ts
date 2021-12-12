type PostRequestToIapVerifyPayload = {
  platform: string;
  productId: string;
  receipt?: string;
};

export type PostRequestToIapVerify = {
  payload: PostRequestToIapVerifyPayload;
};
