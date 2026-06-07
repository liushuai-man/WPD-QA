export default function Conversations() {
  // TODO: Fetch conversations from API
  const conversations = [
    { id: 1, title: '小麦叶片发黄怎么办？', userEmail: 'user1@example.com', messageCount: 5, createdAt: '2024-01-01' },
    { id: 2, title: '小麦条锈病如何防治？', userEmail: 'user2@example.com', messageCount: 8, createdAt: '2024-01-02' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">会话管理</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">会话标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">消息数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <tr key={conv.id}>
                <td className="px-6 py-4 whitespace-nowrap">{conv.id}</td>
                <td className="px-6 py-4">{conv.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{conv.userEmail}</td>
                <td className="px-6 py-4 whitespace-nowrap">{conv.messageCount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{conv.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">查看</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
