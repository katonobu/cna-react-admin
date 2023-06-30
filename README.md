# 状況
- 現状の課題
  - ネット接続
    - TB認証は通るが、データアクセスしてない
  - シリアル
    - シリアルページでも認証が求められる。
    - シリアルデバイスの挿抜でデータは増減するが、画面に反映しない。
      - subscribe&描画更新の方法確認必要。

- 今後の機能追加予定
  - ネット接続
    - TBのデバイスリスト、デバイス選択時のServer/Clientアトリビュート表示
    - TBのWebSocketでテレメトリのリアルタイム表示
  - シリアル
    - シリアルの送受信表示

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

