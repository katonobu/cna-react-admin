# 状況
- 現状の課題
  - 左側のリスト、Webserialportsのアイコンはリストアイコンにして登録済デバイスも表示させたほうがいいか。

- 今後の機能追加予定
  - Edit画面で、シリアルの送受信表示

- 解決した課題
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
