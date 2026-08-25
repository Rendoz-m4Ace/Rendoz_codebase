'use client';

import { useState, useEffect } from 'react';

interface WaitlistEntry {
  id: number;
  email: string;
  created_at: string;
  ip_address: string | null;
  source: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [emails, setEmails] = useState<WaitlistEntry[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/waitlist');
      if (response.ok) {
        setIsAuthenticated(true);
        fetchEmails();
      }
    } catch (err) {
      console.log('Not authenticated');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        fetchEmails();
      } else {
        setError(data.message || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setEmails([]);
      setCount(0);
    } catch (err) {
      console.error('Logout failed');
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/waitlist');
      const data = await response.json();

      if (data.success) {
        setEmails(data.data.emails);
        setCount(data.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch emails');
    }
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Date', 'Source'];
    const rows = emails.map(e => [e.email, new Date(e.created_at).toLocaleDateString(), e.source]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rendoz-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEmails = emails.filter(e =>
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Rendoz Admin</h1>
              <p className="text-slate-500 mt-2">Enter password to access dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Rendoz Admin</h1>
            <p className="text-slate-500 text-sm">Waitlist Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-slate-500 text-sm">Total Subscribers</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{count}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-slate-500 text-sm">Today&apos;s Signups</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">
              {emails.filter(e => {
                const today = new Date().toDateString();
                return new Date(e.created_at).toDateString() === today;
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-slate-500 text-sm">This Week</p>
            <p className="text-3xl font-bold text-blue-500 mt-1">
              {emails.filter(e => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(e.created_at) > weekAgo;
              }).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={exportToCSV}
                className="px-6 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEmails.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{entry.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{entry.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEmails.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                {searchTerm ? 'No emails match your search' : 'No emails in waitlist yet'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
