export default function Users() {
  // TODO: Fetch users from API
  const users = [
    { id: 1, email: 'user1@example.com', nickname: '用户1', chatCount: 25, quizCount: 120, createdAt: '2024-01-01' },
    { id: 2, email: 'user2@example.com', nickname: '用户2', chatCount: 18, quizCount: 80, createdAt: '2024-01-02' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">邮箱</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">昵称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">对话数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">答题数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.nickname}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.chatCount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.quizCount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
