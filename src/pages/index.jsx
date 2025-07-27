import Chat from '../../components/chat';

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Realtime Chat</h1>
      <Chat />
    </main>
  );
}
