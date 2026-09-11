export default function ResourcesPage() {
  return (
    <section className="p-5 ">
      <div className="p-4 text-3xl text-black flex flex-row gap-7">
        <label htmlFor="search">Search Resources</label>
        <input
          type="text"
          id="search"
          placeholder="Enter user name..."
          className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john.doe@example.com</td>
            <td>User</td>
            <td>Active</td>
            <td>
              <button className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
                Edit
              </button>
              <button className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
                Delete
              </button>
            </td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>john.doe@example.com</td>
            <td>User</td>
            <td>Active</td>
            <td>
              <button className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
                Edit
              </button>
              <button className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
                Delete
              </button>
            </td>
          </tr>
          <tr>
            <td>John Doe</td>
            <td>john.doe@example.com</td>
            <td>User</td>
            <td>Active</td>
            <td>
              <button className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">
                Edit
              </button>
              <button className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
