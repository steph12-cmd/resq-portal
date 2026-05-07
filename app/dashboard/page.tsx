'use client';
import { useState } from 'react';
import Link from 'next/link';

const STATS = [
  { label: 'Total Personnel', value: '24', icon: '👥', change: '+3 this week' },
  { label: 'Active Responders', value: '8', icon: '🦺', change: 'Online now' },
  { label: 'Emergencies Today', value: '5', icon: '🚨', change: '2 resolved' },
  { label: 'Avg Response Time', value: '4.2m', icon: '⏱️', change: '-0.8m vs last week' },
];

const RECENT_EMERGENCIES = [
  { type: '🏥 Medical Emergency', location: 'Ikeja, Lagos', time: '10 mins ago', status: 'Active', responder: 'Dr. Amaka Obi' },
  { type: '🔥 Fire', location: 'Surulere, Lagos', time: '1 hour ago', status: 'Resolved', responder: 'Emeka Tunde' },
  { type: '🚗 Road Accident', location: 'Lekki, Lagos', time: '3 hours ago', status: 'Resolved', responder: 'Chidi Okonkwo' },
  { type: '🔫 Armed Robbery', location: 'Oshodi, Lagos', time: 'Yesterday', status: 'Resolved', responder: 'Sgt. Bello' },
];

const PERSONNEL = [
  { name: 'Dr. Amaka Obi', role: 'Medical', status: 'Active', responses: 24 },
  { name: 'Emeka Tunde', role: 'Fire Service', status: 'Active', responses: 18 },
  { name: 'Chidi Okonkwo', role: 'Medical', status: 'Offline', responses: 31 },
  { name: 'Sgt. Ibrahim Bello', role: 'Police', status: 'Active', responses: 14 },
  { name: 'Fatima Aliyu', role: 'Volunteer', status: 'Offline', responses: 9 },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#111111] flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#cc0000] rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">ResQ Portal</p>
            <p className="text-[#888] text-xs">Lagos Fire Service</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'emergencies', icon: '🚨', label: 'Emergencies' },
            { id: 'personnel', icon: '👥', label: 'Personnel' },
            { id: 'analytics', icon: '📈', label: 'Analytics' },
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === item.id
                  ? 'bg-[#cc0000] text-white'
                  : 'text-[#888] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-[#1a1a1a] pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Admin</p>
              <p className="text-[#888] text-xs">Lagos Fire Service</p>
            </div>
          </div>
          <Link href="/login" className="text-[#555] text-xs hover:text-[#888]">
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">

        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">Good morning 👋</h1>
              <p className="text-[#888] text-sm">Here's what's happening with Lagos Fire Service today</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-[#888] text-xs">{stat.change}</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-[#888] text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white font-bold">Recent Emergencies</h2>
                  <button
                    onClick={() => setActiveTab('emergencies')}
                    className="text-[#cc0000] text-sm hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {RECENT_EMERGENCIES.map((em, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#222] last:border-0">
                      <div>
                        <p className="text-white text-sm font-semibold">{em.type}</p>
                        <p className="text-[#888] text-xs">{em.location} • {em.time}</p>
                        <p className="text-[#666] text-xs">Responder: {em.responder}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        em.status === 'Active'
                          ? 'bg-[#3a0000] text-[#cc0000]'
                          : 'bg-[#1a3a1a] text-[#00cc44]'
                      }`}>
                        {em.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
                <h2 className="text-white font-bold mb-6">Active Responders</h2>
                <div className="flex flex-col gap-4">
                  {PERSONNEL.filter(p => p.status === 'Active').map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#cc0000] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{p.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{p.name}</p>
                        <p className="text-[#888] text-xs">{p.role}</p>
                      </div>
                      <div className="w-2 h-2 bg-[#00cc44] rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emergencies' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">All Emergencies</h1>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    {['Type', 'Location', 'Time', 'Responder', 'Status'].map((h) => (
                      <th key={h} className="text-left text-[#888] text-sm font-semibold px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_EMERGENCIES.map((em, i) => (
                    <tr key={i} className="border-b border-[#222] last:border-0 hover:bg-[#222] transition">
                      <td className="px-6 py-4 text-white text-sm">{em.type}</td>
                      <td className="px-6 py-4 text-[#888] text-sm">{em.location}</td>
                      <td className="px-6 py-4 text-[#888] text-sm">{em.time}</td>
                      <td className="px-6 py-4 text-[#888] text-sm">{em.responder}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          em.status === 'Active'
                            ? 'bg-[#3a0000] text-[#cc0000]'
                            : 'bg-[#1a3a1a] text-[#00cc44]'
                        }`}>
                          {em.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'personnel' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Personnel</h1>
              <button className="bg-[#cc0000] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#aa0000] transition">
                + Add Personnel
              </button>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    {['Name', 'Role', 'Responses', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left text-[#888] text-sm font-semibold px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERSONNEL.map((p, i) => (
                    <tr key={i} className="border-b border-[#222] last:border-0 hover:bg-[#222] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{p.name[0]}</span>
                          </div>
                          <span className="text-white text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#888] text-sm">{p.role}</td>
                      <td className="px-6 py-4 text-white text-sm">{p.responses}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          p.status === 'Active'
                            ? 'bg-[#1a3a1a] text-[#00cc44]'
                            : 'bg-[#1a1a1a] text-[#888]'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#cc0000] text-sm hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: 'Total Emergencies', value: '142', sub: 'All time' },
                { title: 'Resolved', value: '138', sub: '97% resolution rate' },
                { title: 'Avg Response Time', value: '4.2 mins', sub: 'This month' },
                { title: 'Active Personnel', value: '8/24', sub: 'Currently online' },
              ].map((item, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
                  <p className="text-[#888] text-sm mb-2">{item.title}</p>
                  <p className="text-4xl font-bold text-white mb-1">{item.value}</p>
                  <p className="text-[#cc0000] text-sm">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] max-w-lg">
              <h2 className="text-white font-semibold mb-4">Organisation Details</h2>
              {[
                { label: 'Organisation Name', value: 'Lagos Fire Service' },
                { label: 'Type', value: 'Fire Service' },
                { label: 'RC Number', value: 'RC123456' },
                { label: 'State', value: 'Lagos' },
                { label: 'Contact Email', value: 'info@lagosfire.gov.ng' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-[#222] last:border-0">
                  <span className="text-[#888] text-sm">{item.label}</span>
                  <span className="text-white text-sm font-semibold">{item.value}</span>
                </div>
              ))}
              <button className="mt-6 w-full border border-[#cc0000] text-[#cc0000] py-3 rounded-full text-sm font-semibold hover:bg-[#cc0000] hover:text-white transition">
                Edit Details
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}