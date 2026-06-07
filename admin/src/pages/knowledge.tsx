export default function Knowledge() {
  // TODO: Fetch knowledge documents from API
  const documents = [
    { id: 1, title: '小麦病虫害防治手册', source: '农业农村部', fileType: 'PDF', createdAt: '2024-01-01' },
    { id: 2, title: '小麦栽培技术指南', source: '农科院', fileType: 'DOCX', createdAt: '2024-01-02' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">知识库管理</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          上传文档
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">来源</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap">{doc.id}</td>
                <td className="px-6 py-4">{doc.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doc.source}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doc.fileType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doc.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">查看</button>
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
