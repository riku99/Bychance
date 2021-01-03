# Bychance

見ていただきありがとうございます。

これは現在進行形で作っているアプリです。

## どのようなアプリか

たまたま近くにいた人と繋がれたり、その時同じイベント(スポーツ観戦やライブなど)にいる人のシェアしたモノをインスタのストーリーのような形で見れたりできるアプリ。

ゆくゆくはもっと色んなことができるようにしたいと思っています。

## アプリ名の由来

たまたま近くにいた人、たまたま同じイベントにいた人など、たまたま(偶然)を英語にすると by chance となるのでそこからとりました！

## 主な使用技術

- TypeScript, ReactNative, Redux, Redux Toolkit, hooks など
- Ruby, Ruby On Rails
- Docker/Docker-compose
- OpenID Connect
- WebSocket
- AWS<br>
  - S3

など

## 主な機能

- ユーザー登録、ログイン(ユーザー登録、ログイン共に Line ログインを使い実装)、ログアウト<br>
  今後はパスワードとユーザー名を使用したよくあるログイン機能も実装する予定<br>
- プロフィール編集
- インスタのような画像投稿
- ストーリーのような期間限定、かつ連続で表示される画像、動画の投稿
- メッセージのやり取り
- 指定した範囲に存在するユーザーの取得
- 自分のデバイスで写真、動画の撮影、投稿

## 現時点での機能の一部のデモ

このアプリはまだ完成していません。<br>

なので、一部ですが現在どのような機能があるのか少しでもわかるように gif を載せます。

**アプリを開いてからログインまで**<br>

- 注意点
  - 画像で一部隠しています
  - デザインなどはあまりまだ手をつけてられてないので、ログイン画面は今後しっかりしたものを作ります
  - アプリ名やチャンネル名もまだ設定、変更を行っておらずそのままなので不自然です

![login_demo](https://user-images.githubusercontent.com/52064725/103432480-d3be5f80-4c22-11eb-808a-d872a8d9bbba.gif)

**プロフィール編集**

- 注意点
  - 自己紹介の編集で複数の改行を行ったにも関わらず、結果 1 回の改行になっていますがこれは仕様でそうしています。

![edit_profile_demo](https://user-images.githubusercontent.com/52064725/103433009-02413800-4c2d-11eb-88b2-b7a57a8b49cd.gif)

**写真の投稿、削除**

![post_movie](https://user-images.githubusercontent.com/52064725/103433599-41748680-4c37-11eb-83f1-d8ff22720198.gif)

**フラッシュを撮って投稿するまで**

- 注意点
  - フラッシュとはいわゆるインスタのストーリーズみたいなものです
  - 写真の撮影、フォルダからの選択、撮影したものをフォルダに保存することもできます

![take_flash_demo](https://user-images.githubusercontent.com/52064725/103432511-4c252080-4c23-11eb-9148-5ad6de5475c0.gif)

**フラッシュを表示する**

- 注意点
  - 動画が止まったり、画面上部にあるプログレスバーが止まったりしますがこれはインスタのストーリーのように自分でタップして操作しているものです
  - 現在、投稿した全てのものが表示されるようになっていますが、今後 24 時間以内に投稿したもののみ表示されるようにします

![show_flash_demo](https://user-images.githubusercontent.com/52064725/103432769-b8eee980-4c28-11eb-91ed-f364a0699a79.gif)

**他のユーザーを距離指定して検索**

- 注意点
  - 現在、指定距離がキロメートル単位になっていますが、今後 100 メートル、300 メートルなどメートル単位に修正します
  - 距離検索するボタンがわからない(現在は表示されている距離)ですが、今後デザインを変更する時にわかりやすくします
  - 設定で自分を他のユーザーに表示させないこともできます
  - 開発の効率上の関係で自分も表示されるようになっていますが、最終的には自分は表示されないようにします

![search_users_demo](https://user-images.githubusercontent.com/52064725/103433204-7b8e5a00-4c30-11eb-93a9-5597a0a8b66e.gif)

**表示されたユーザーのフラッシュを連続して表示**

- 注意点
  - 一人のユーザーのものを全て見終えたら自動で次のユーザーのものを表示しています(手動でももちろん可能です)
  - 一人のユーザーのものを全て身終えたらアイコン周りの色が変わります
  - 連続されて表示されるのはアイコン周りがグラデーションのユーザー、つまり全て閲覧されていないユーザーのものです(これらは全てインスタのストリーズのようなものです)

![show_many_flashes_demo](https://user-images.githubusercontent.com/52064725/103433357-1720ca00-4c33-11eb-8374-04a0d8f93dcd.gif)

**表示されたユーザーにメッセージを送る**

- 注意点
  - 現在メッセージが多くなると一瞬カクッとした動きになってしまうことがあるので、改善します
  - Websocket 通信を行っており、リアルタイムでメッセージが反映されています
  - 既読機能があり、未読のものの件数が表示されるようになっていますが、Rails 側で中間テーブルを使わずに実装してしまっていて、今後スケールしづらいので改善します

![message_demo](https://user-images.githubusercontent.com/52064725/103435672-45af9c80-4c55-11eb-9d43-2f2cf2ba7667.gif)

**ログアウト**

![logout_demo](https://user-images.githubusercontent.com/52064725/103433708-72ee5180-4c39-11eb-9da4-86ec051ab59d.gif)

## コードレベルの注意点

- Container コンポーネントと Presentational コンポーネントの分離<br>

  開発を始めてから途中までなるべく分離させて実装してきましたが、途中から分離させないようにしました。<br>

  なので、分離しているコンポーネント、分離していないコンポーネントがあります。

- 非同期通信を行う際のコードを謎に分離<br>

  axios で API と非同期通信を行っているのですが、なぜか二つのディレクトリ(actions と apis)にある別ファイルに跨って実装してしまっており、見づらいし記述量が無駄に増えるだけだったので途中から一つのフ ァイルにまとめました。<br>

  今後もまとめて実装していきます。

## 今後追加しなければいけないもの、追加したいものの一部

このアプリはまだまだ開発途中で、追加しなければいけないものや追加したいものが大量にあります。<br>

その中の一部を記します。<br>

- テスト

  - このアプリを開発し始める前に勉強のために作っていた簡単な CRUD のものには RSpec や Jest などを導入して実装し、テストも学んでいたが今回取り入れてないので、今後必ず取り入れる。

- 画像、動画編集機能

  - インスタのストーリーのように、選択した画像や動画を GL を使って簡単な編集(文字の追加)などできるようにしたい

- ストリーミング再生機能

  - 動画の再生をストリーミングにして、動画をロードする時間を短くしたい

- 画像形式を WebP にする

  - 現在、画像を速く表示するために画像のクオリティーを下げることをしているが、Lamda とか使って WebP 形式にしてみて、クオリティーを落とさずに画像を速く表示できるか試してみたい。

- キャッシュ機能

  - 正直まだやり方は良くわかってないが、画像の表示などを高速にしたい。

- プッシュ通知機能

  - メッセージのやり取りでプッシュ通知がくるようにしたい。

- デザイン

  - デザインやスタイルはまだあまり考えれておらず、現在迷走中なので今後違和感の少ないデザインに統一したい。あとロゴとかも作ってみたい。

- デプロイ

  - API 側をデプロイする。以前 AWS の EC2 などを使い 2 回デプロイしたことがあるが、Lamda を使ってみたい。

大量にあるのでほんの一部ですが、このようなことを今後取り入れていきたいと思っています。

_README を読んでいただきありがとうございました！_
