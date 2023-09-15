# 概要
- 2023/08/23
- CreateNextApp + readt-adminをベースにしたweb-serialアプリケーション。
- ssg動作するので、gh-page公開してる。
- ライブラリ整備に注力するため、当面いじる予定なし。

# 状況
- 現状の課題
  - DataGridの文字の色を変えられない。
    - (Datagrid.rowSx)[https://marmelab.com/react-admin/Datagrid.html#rowsx]で変えられそうだが、、うまく効かない。
  - webSerialDataPorts.tsで文字列変換、改行コード分割処理を入れている。
    - callbackでbinaryデータ、文字列データのいずれでも扱えるようにする。
  - webSerialDataPorts.tsで状態管理実装が2系統ある。
    - MicroStoreに統一する。

  - スマホサイズの画面にすると右側のボタンが見えなくなる。
    - Shwoは未解決
 
- 全体アーキテクチャ見直し
  - Worker:vanilla
    - webSerialDataPorts.ts
      - シリアルポートの有効ポート数管理、各ポートの送受信処理を行う。
      - Application側I/Fは極力シンプルにしておくことで、worker/mainのどちらのスレッドでも使えるようにする
    - vendors.ts
      - メジャーどころだけ押さえておけばいいのかも。
    - workerHandler.ts
      - workerスレッドのevent I/FとwebSerialDataPorts.tsを繋ぐ。

  - Main:vanilla
    - webSerialWorkerAdapter.ts
      - workerHandler.ts の対になる処理を行う。
      - 送受信系向けPromise,イベント発火系publisherを実装する。

  - Main:react
    - webSerialDataProvider.ts
      - react向けuseXXXを提供
      - 送受信系はPromiseを返すusexxx
      - イベント発火系はuseSyncExternalStoreを返すusexxx

- 検証
  - webSerialDataPorts.ts のブラッシュアップ/検証
  - webSerialDataProvider.ts の検証はwebSerialDataPorts.tsのモックでnodeでやる?

- 解決した課題
  - Edit画面で、シリアルの送受信表示
    - とりあえず送受信はできるようになった。

  - Create操作時、いったん中身なしのページに飛んでSAVEボタンを押さないとrequestPort()の画面に飛ばない。
    - useCreate()で生成した関数を呼び出すことで対応済。(app/serialPorts/src/SerialPortList.tsx)
    - app/serialPorts/src/SerialPortList.tsx で表示要素がないときの専用ページを作ったので、app/serialPorts/src/index.ts から createは抜いた。

  - ページ遷移履歴管理がクライアント側で正しく動かず、ページ遷移時に実行時警告が出る。
    - app/page.tsx で、トップ要素のAdminを動的ロード指定した。
      - これでクライアント描画動作となり、ページ遷移履歴管理がちゃんと動くようになった。

  - app/webSerialDataProvider/src/webSerialPorts.ts がサーバー側で動いているらしくエラーが出る。
    ```
    - error app/webSerialDataProvider/src/webSerialPorts.ts (399:2) @ navigator
    - error ReferenceError: navigator is not defined
    ```  
    - navigator要素を参照している個所(app/webSerialDataProvider/src/webSerialPorts.ts)を`if (typeof window !== 'undefined') {`で括った。

  - buildでエラーとなる
    - dataProvideの各メソッドの戻り値の型は、react-admin で `メソッド名Result`として定義されてるっぽい。
      - 戻り値を `as xxxResult` とキャストした。
    - navigator is not defined と言われる。
      - navigator要素を参照している個所(app/webSerialDataProvider/src/webSerialPorts.ts)を`if (typeof window !== 'undefined') {`で括った。

  - シリアルデバイスの挿抜でデータは増減するが、画面に反映しない。
    - useRefresh() で画面強制更新できる。
    - useEffect() でマウント時/案マウント時にuseRefreshの戻り値をwebSerialPortにsubscribeさせる。

  - DeleteしてEmptyになったとき、Deleteの完了後の状態更新を待たずにrequestPort()を呼び出してるので、ポート選択画面で登録済み状態と表示される。
    - Empty()への遷移をDeleteの完了後の状態更新を待ってからに遅延させられないか
      - app/serialPorts/src/SerialPortList.tsx のEmptyでタイマー回して100ms毎にportオブジェクトの長さを確認して、0になったらcreate()を呼ぶようにした。
      - 実際のところ、数秒間undo可能なトーストが出ているので、その間は0にっていないようだ。。。

  - Edit画面右側、ListItemの黒ぽっちがマージン持たずに境界線にかぶっている。
    - 'list-style'をnoneに設定。
    - reactでは'list-style'ではなく、listStyleにしなければならないのにハマった。

  - 現状受信したデータの切れ目で表示させてる→複数行まとめて改行コードでsplitしてデータ蓄積させる。
    - webSerialDataPorts.tsで文字列変換、改行コード分割処理を入れた。
    - これに伴い、rxの型をUint8Arrayからstring[]に変更した。
    - 最終的にはbinaryも扱えるようにしたい。

  - htmlでは先頭空白、空行が無視される
    - `<pre>`で括った

  - 表示行数をpropsで指定できるようにした。

  - record.idの値がすぐに取れない、suspensとか使うとうまくいく??
    - [useGetRecordId()](https://marmelab.com/react-admin/useGetRecordId.html)ならすぐに取れる。


  - 左側のリスト、Webserialportsのアイコンはリストアイコンにして登録済デバイスも表示させたほうがいいか。
    - カスタムMenuで、Port増減をトリガとしてMenu再生成するようにした
      - [Menu](https://marmelab.com/react-admin/Menu.html)

  - リストからのデバイス選択/削除で、削除が実行されるが、実際には削除されない。
    - Listページの`Datagrid`コンポーネントの`isRowSelectable`プロパティーに`={ record => (record.isOpen === 'Close') }`を設定した
      - [isrowselectable](https://marmelab.com/react-admin/Datagrid.html#isrowselectable)
    - ListページでCloseのデバイスしかBulkAction対象に選択できなくなった。

  - スマホサイズの画面にすると右側のボタンが見えなくなる。
    - Listは、https://marmelab.com/react-admin/ListTutorial.html#responsive-lists を参考にして解決

  - データ蓄積と表示方法の改善
    - SerialPortEdit.tsxでは表示に必要な行数分だけ保持している。
    - dataProviderのデータ側に起動後からのデータを蓄積
      - infinit pagenationで常に最新のを表示させ、古いのもさかのぼれるようにするのがいいかも。
      - 検索とかもできだし
      - タイムスタンプつけても便利そう

  - Delete時にoptimisticに表示される
    - DatagridのPropertyに
      ```
      bulkActionButtons={
          <BulkDeleteButton
              mutationMode='pessimistic'
          />
      }
      ```
      を追加した。
