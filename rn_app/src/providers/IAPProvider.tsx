import React, {useCallback, useEffect, createContext, useState} from 'react';
import {Platform} from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import Config from 'react-native-config';
import {useReceiptVerify} from '~/hooks/iap';

type Props = {
  children: JSX.Element;
};

const IAP_SKUS = Platform.select({
  ios: [Config.IAP_SHOP],
});

export const IAPContext: React.Context<Partial<{
  processing: boolean;
  setProcessing: (v: boolean) => void;
  getProducts: () => Promise<InAppPurchases.IAPItemDetails[] | undefined>;
}>> = createContext({});

export const IAPProvider = React.memo(({children}: Props) => {
  const {verifyReciept} = useReceiptVerify();
  const [processing, setProcessing] = useState(false);
  const processNewPurchase = useCallback(
    async (purchace: InAppPurchases.InAppPurchase) => {
      const {productId} = purchace;

      let body: {
        platform: string;
        productId: string;
        receipt?: string;
      } = {
        platform: Platform.OS,
        productId,
      };

      if (Platform.OS === 'ios') {
        // レシート(base64)の取得
        body.receipt = purchace.transactionReceipt;

        // ストレージに保存する
      }

      if (Platform.OS === 'android') {
      }

      try {
        // サーバー側に検証リクエスト
        console.log('検証開始');
        await verifyReciept(body);
        // 成功した場合ストレージに保存したレシートを削除
      } catch (e) {
        console.log(e);
        setProcessing(false);
      }
    },
    [verifyReciept],
  );

  const getProducts = useCallback(async () => {
    const {responseCode, results} = await InAppPurchases.getProductsAsync(
      IAP_SKUS as string[],
    );
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results;
    } else {
      console.log('💦 error');
      return [];
    }
  }, []);

  useEffect(() => {
    (async function () {
      try {
        await InAppPurchases.connectAsync();
      } catch (e) {
        // 既に接続されている場合
        console.log('既に接続されています');
      }

      InAppPurchases.setPurchaseListener(
        async ({responseCode, results, errorCode}) => {
          console.log('run listner');
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            if (!results) {
              console.log('no results');
              return;
            }

            // 購入成功処理
            results.forEach(async (purchace) => {
              console.log('success!!');
              await processNewPurchase(purchace);
              await InAppPurchases.finishTransactionAsync(purchace, false);
            });
          } else if (
            responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED
          ) {
            console.log('ユーザーがキャンセルしました');
          } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
            console.log('保護者の認証が必要です');
          } else {
            console.log(
              `何かしらのエラーが発生しました。エラーコード${errorCode}`,
            );
          }
        },
      );
    })();

    return () => {
      (async function () {
        await InAppPurchases.disconnectAsync();
      })();
    };
  }, [processNewPurchase]);

  return (
    <IAPContext.Provider
      value={{
        processing,
        setProcessing,
        getProducts,
      }}>
      {children}
    </IAPContext.Provider>
  );
});
