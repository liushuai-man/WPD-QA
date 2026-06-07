export default function Questions() {
  // TODO: Fetch questions from API
  const questions = [
    { id: 1, title: '小麦条锈病的病原菌是什么？', difficulty: 2, categoryName: '病害', createdAt: '2024-01-01' },
    { id: 2, title: '小麦蚜虫的主要危害时期是？', difficulty: 1, categoryName: '虫害', createdAt: '2024-01-02' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">题库管理</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          添加题目
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题目</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">难度</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((q) => (
              <tr key={q.id}>
                <td className="px-6 py-4 whitespace-nowrap">{q.id}</td>
                <td className="px-6 py-4">{q.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs ${
                    q.difficulty === 1 ? 'bg-green-100 text-green-800' :
                    q.difficulty === 2 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {q.difficulty === 1 ? '简单' : q.difficulty === 2 ? '中等' : '困难'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{q.categoryName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{q.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button className="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
