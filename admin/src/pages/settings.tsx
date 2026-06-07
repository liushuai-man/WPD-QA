export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">系统设置</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">基本设置</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">系统名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  defaultValue="WPD-QA"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">联系邮箱</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg"
                  defaultValue="admin@wpd-qa.com"
                />
              </div>
            </div>
          </div>
          <div className="pt-6 border-t">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
