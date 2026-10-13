import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  Building2, 
  Lock, 
  Save, 
  CheckCircle2, 
  Clock, 
  Smartphone,
  AlertCircle
} from 'lucide-react';

export const AdminAccountView: React.FC = () => {
  const { currentUser, auditLogs, addToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department || 'Office of the Campus Director & Quality Assurance');
  const [title, setTitle] = useState(currentUser.title || 'Director of Extension Services');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      description: 'Administrative profile details saved successfully.'
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast({ type: 'info', title: 'Password Required', description: 'Enter current administrative password.' });
      return;
    }
    if (newPassword.length < 8) {
      addToast({ type: 'error', title: 'Weak Password', description: 'New password must have at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ type: 'error', title: 'Mismatch', description: 'New passwords do not match.' });
      return;
    }

    addToast({
      type: 'success',
      title: 'Password Changed',
      description: 'Your administrator password has been updated securely.'
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const myAuditLogs = auditLogs.filter(log => log.adminName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0] || ''));

  return (
    <div className="space-y-6">
      {/* Account Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center font-black text-xl shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                Full Administrator
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.title} · {currentUser.department}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 sm:text-right">
          <span className="block font-semibold text-slate-700">Account ID: {currentUser.id}</span>
          <span className="text-[11px] text-slate-400">Authenticated with SLSU Institutional SSO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserCheck className="w-4 h-4 text-emerald-800" />
            <span>Administrator Profile Details</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation / Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Department / Campus Unit</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & Password */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-purple-700" />
            <span>Security & Authentication</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* 2FA Toggle */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-800" />
                <div>
                  <span className="font-bold text-slate-900 block text-xs">Two-Factor Authentication (2FA)</span>
                  <span className="text-[11px] text-slate-500">Require mobile OTP for institutional audits</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  twoFactorEnabled ? 'bg-emerald-800' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RA 10173 Audit & Session Records for this Admin */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Personal Administrative Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compliance logs recorded under your credentials in accordance with Republic Act No. 10173.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {myAuditLogs.length} Actions Logged
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {myAuditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 capitalize">{log.action.replace('_', ' ')}</span>
                <span className="text-slate-500 text-[11px] block">{log.reason}</span>
              </div>
              <div className="text-slate-400 text-[11px] sm:text-right shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
