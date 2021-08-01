import {AnotherUser} from './anotherUser';

// NearbyUserは位置情報により取得したユーザーなので必ずlat, lngが存在する。AnotherUserはトーク相手とかも含まれるので位置情報のデータが必ず含まれるとは限らない
export type NearbyUser = Omit<AnotherUser, 'lat' | 'lng'> & {
  lat: number;
  lng: number;
};
export type NearbyUsers = NearbyUser[];
