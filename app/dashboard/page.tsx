'use client';
import { useState } from 'react';
import Link from 'next/link';

const STATS = [
  { label: 'Total Personnel', value: '0', change: 'No personnel yet' },
  { label: 'Active Responders', value: '0', change: 'None online' },
  { label: 'Emergencies Today', value: '0', change: 'No emergencies' },
  { label: 'Avg Response Time', value: '—', change: 'No data yet' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <img src="/icon.png" alt="Siren" className="w-8 h-8 rounded-xl" />
          <div>
            <p className="text-white font-bold text-sm">Siren Portal</p>
            <p className="text-white/30 text-xs">Organisation Dashboard</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'emergencies', label: 'Emergencies' },
            { id: 'personnel', label: 'Personnel' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === item.id
                  ? 'bg-[#cc0000] text-white'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Admin</p>
              <p className="text-white/30 text-xs">Organisation</p>
            </div>
          </div>
          <Link href="/login" className="text-white/20 text-xs hover:text-white/50 transition">
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">

        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-black text-white mb-1">Dashboard</h1>
              <p className="text-white/30 text-sm">Welcome to your Siren organisation portal</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-white/40 text-sm mb-1">{stat.label}</p>
                  <p className="text-white/20 text-xs">{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white font-bold">Recent Emergencies</h2>
                  <button
                    onClick={() => setActiveTab('emergencies')}
                    className="text-[#cc0000] text-sm hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-2 h-2 bg-[#cc0000] rounded-full mb-4" />
                  <p className="text-white/40 text-sm">No emergencies yet</p>
                  <p className="text-white/20 text-xs mt-1">Emergencies will appear here when your responders go live</p>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-6">Active Responders</h2>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-2 h-2 bg-[#cc0000] rounded-full mb-4" />
                  <p className="text-white/40 text-sm">No responders online</p>
                  <p className="text-white/20 text-xs mt-1">Add personnel to get started</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-8">Emergencies</h1>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Type', 'Location', 'Time', 'Responder', 'Status'].map((h) => (
                      <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-white/30 text-sm">
                      No emergencies recorded yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'personnel' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-black text-white">Personnel</h1>
              <button className="bg-[#cc0000] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#aa0000] transition">
                + Add Personnel
              </button>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Name', 'Role', 'Responses', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-white/30 text-sm">
                      No personnel added yet. Share your organisation code with your team to get started.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-8">Analytics</h1>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: 'Total Emergencies', value: '0', sub: 'All time' },
                { title: 'Resolved', value: '0', sub: '0% resolution rate' },
                { title: 'Avg Response Time', value: '—', sub: 'No data yet' },
                { title: 'Active Personnel', value: '0', sub: 'Currently online' },
              ].map((item) => (
                <div key={item.title} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                  <p className="text-white/30 text-sm mb-2">{item.title}</p>
                  <p className="text-4xl font-black text-white mb-1">{item.value}</p>
                  <p className="text-[#cc0000] text-sm">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-8">Settings</h1>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 max-w-lg">
              <h2 className="text-white font-bold mb-6">Organisation Details</h2>
              {[
                { label: 'Organisation Name', value: 'Your Organisation' },
                { label: 'Type', value: '—' },
                { label: 'RC Number', value: '—' },
                { label: 'State', value: '—' },
                { label: 'Contact Email', value: '—' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-4 border-b border-white/[0.06] last:border-0">
                  <span className="text-white/30 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-semibold">{item.value}</span>
                </div>
              ))}
              <button className="mt-6 w-full border border-[#cc0000] text-[#cc0000] py-3 rounded-xl text-sm font-semibold hover:bg-[#cc0000] hover:text-white transition">
                Edit Details
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}