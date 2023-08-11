"use client";
import dynamic from 'next/dynamic'

const AppRoot = dynamic(() => import('./AppRoot'), {
  ssr: false, // サーバーサイドレンダリングを無効化
});

const App = () => {
  return <AppRoot></AppRoot>
}
export default App;
