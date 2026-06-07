export default function Dashboard() {
  // TODO: Fetch statistics from API
  const stats = {
    totalUsers: 1000,
    todayActiveUsers: 50,
    totalChats: 5000,
    todayChats: 100,
    totalQuiz: 20000,
    todayQuiz: 200,
    knowledgeCount: 50,
    questionCount: 500,
    ragHitRate: 85.5,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">数据统计</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">总用户数</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">今日活跃用户</p>
          <p className="text-3xl font-bold text-green-600">{stats.todayActiveUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">总对话数</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalChats}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">RAG命中率</p>
          <p className="text-3xl font-bold text-orange-600">{stats.ragHitRate}%</p>
        </div>
      </div>
    </div>
  );
}
