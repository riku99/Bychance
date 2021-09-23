type UserData = {
  id: string;
  name: string;
  avatar: string | null;
};

export type ResponseForGetApplyingGroups = {
  id: number;
  appliedUser: UserData;
}[];

export type ResponseForGetAppliedGroups = {
  id: number;
  applyingUser: UserData;
}[];
