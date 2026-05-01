export default function Profile({ user }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">My Profile</h2>
      <div className="bg-white rounded-xl shadow p-6 max-w-md">

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center
            text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Full Name</span>
            <span className="text-sm font-medium text-gray-800">{user?.name}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Email</span>
            <span className="text-sm font-medium text-gray-800">{user?.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Date of Birth</span>
            <span className="text-sm font-medium text-gray-800">
              {user?.dob?.slice(0,10) || 'Not set'}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-sm text-gray-500">Blood Type</span>
            <span className="text-sm font-bold text-red-500">
              {user?.blood_type || 'Not set'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}