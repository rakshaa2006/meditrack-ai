export default function Profile({ user }) {
  return (
    <div style={{ minHeight: '100vh', background: '#111827', padding: '20px' }}>
      <h2 className="text-xl font-bold text-white mb-6">My Profile</h2>
      <div className="bg-slate-900 rounded-xl shadow-lg p-6 max-w-md border border-slate-700">

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center
            text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{user?.name}</h3>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-slate-700">
            <span className="text-sm text-slate-400">Full Name</span>
            <span className="text-sm font-medium text-slate-100">{user?.name}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-700">
            <span className="text-sm text-slate-400">Email</span>
            <span className="text-sm font-medium text-slate-100">{user?.email}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-700">
            <span className="text-sm text-slate-400">Date of Birth</span>
            <span className="text-sm font-medium text-slate-100">
              {user?.dob?.slice(0,10) || 'Not set'}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-sm text-slate-400">Blood Type</span>
            <span className="text-sm font-bold text-rose-300">
              {user?.blood_type || 'Not set'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}