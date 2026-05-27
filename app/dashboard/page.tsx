'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [org, setOrg] = useState<any>(null);
  const [responders, setResponders] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sirenOrg');
    if (!stored) {
      router.replace('/login');
      return;
    }
    const orgData = JSON.parse(stored);
    setOrg(orgData);
    fetchOrgData(orgData);

    // Listen for live emergencies
    const unsubEmergencies = onSnapshot(
      query(collection(db, 'emergencies'), where('status', 'in', ['active', 'accepted'])),
      (snap) => {
        setEmergencies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );
    return () => unsubEmergencies();
  }, []);

  const fetchOrgData = async (orgData: any) => {
    try {
      const respSnap = await getDocs(
        query(collection(db, 'responders'), where('orgCode', '==', orgData.orgCode))
      );
      setResponders(respSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.log('Error fetching org data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sirenOrg');
    router.replace('/login');
  };

  const verifiedResponders = responders.filter(r => r.isVerified);
  const pendingResponders = responders.filter(r => !r.isVerified);
  const activeEmergencies = emergencies.filter(e => e.status === 'active' || e.status === 'accepted');

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-white/30 text-sm">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <img src="/icon.png" alt="Siren" className="w-8 h-8 rounded-xl" />
          <div>
            <p className="text-white font-bold text-sm truncate">{org?.orgName}</p>
            <p className="text-white/30 text-xs">{org?.orgType}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'emergencies', label: 'Live Emergencies' },
            { id: 'personnel', label: 'Personnel' },
            { id: 'settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
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
              <span className="text-white text-xs font-bold">
                {org?.orgName ? org.orgName[0].toUpperCase() : 'O'}
              </span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold truncate">{org?.contactPerson}</p>
              <p className="text-white/30 text-xs">Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-white/20 text-xs hover:text-white/50 transition">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-black text-white mb-1">
                Welcome, {org?.orgName} 👋
              </h1>
              <p className="text-white/30 text-sm">
                Your organisation code: <span className="text-[#cc0000] font-mono font-bold">{org?.orgCode}</span>
                <span className="text-white/20 ml-2">— Share this with your personnel to join</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Personnel', value: responders.length, sub: `${pendingResponders.length} pending verification` },
                { label: 'Verified Responders', value: verifiedResponders.length, sub: 'Ready to respond' },
                { label: 'Active Emergencies', value: activeEmergencies.length, sub: 'Right now' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-white/40 text-sm mb-1">{stat.label}</p>
                  <p className="text-white/20 text-xs">{stat.sub}</p>
                </div>
              ))}
            </div>

            {activeEmergencies.length > 0 && (
              <div className="bg-white/[0.02] border border-[#cc0000]/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse" />
                  <h2 className="text-white font-bold">Live Emergencies</h2>
                </div>
                {activeEmergencies.map((em) => (
                  <div key={em.id} className="flex items-center justify-between bg-white/[0.02] rounded-xl p-4 mb-3 last:mb-0">
                    <div>
                      <p className="text-white text-sm font-semibold">{em.emergencyEmoji} {em.emergencyType}</p>
                      <p className="text-white/40 text-xs mt-1">{em.description?.slice(0, 60)}...</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      em.status === 'accepted' ? 'bg-[#1a3a1a] text-[#00cc44]' : 'bg-[#3a0000] text-[#cc0000]'
                    }`}>
                      {em.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4">Your Personnel</h2>
              {responders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/20 text-sm mb-2">No personnel yet</p>
                  <p className="text-white/10 text-xs">
                    Share your org code <span className="text-[#cc0000] font-mono">{org?.orgCode}</span> with your team
                  </p>
                </div>
              ) : (
                responders.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{r.name ? r.name[0] : 'R'}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{r.name}</p>
                        <p className="text-white/30 text-xs">{r.responderType}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      r.isVerified ? 'bg-[#1a3a1a] text-[#00cc44]' : 'bg-[#2a1a00] text-[#cc6600]'
                    }`}>
                      {r.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* LIVE EMERGENCIES */}
        {activeTab === 'emergencies' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Live Emergencies</h1>
            <p className="text-white/30 text-sm mb-8">Real-time emergency alerts in your coverage area</p>

            {emergencies.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
                <div className="w-3 h-3 bg-[#cc0000]/30 rounded-full mx-auto mb-4" />
                <p className="text-white/20 text-sm">No active emergencies right now</p>
                <p className="text-white/10 text-xs mt-2">Your verified responders will be alerted automatically</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {emergencies.map((em) => (
                  <div key={em.id} className="bg-white/[0.02] border border-[#cc0000]/20 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{em.emergencyEmoji} {em.emergencyType}</h3>
                        <p className="text-white/40 text-sm mt-1">{em.description}</p>
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full ${
                        em.status === 'accepted' ? 'bg-[#1a3a1a] text-[#00cc44]' : 'bg-[#3a0000] text-[#cc0000]'
                      }`}>
                        {em.status === 'accepted' ? 'Responder assigned' : 'Awaiting response'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-white/20 text-xs mb-1">People affected</p>
                        <p className="text-white text-sm">{em.peopleAffected}</p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs mb-1">Location</p>
                        <p className="text-white text-sm">
                          {em.location ? `${em.location.latitude?.toFixed(3)}, ${em.location.longitude?.toFixed(3)}` : 'No location'}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs mb-1">Status</p>
                        <p className="text-white text-sm capitalize">{em.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PERSONNEL */}
        {activeTab === 'personnel' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-black text-white mb-1">Personnel</h1>
                <p className="text-white/30 text-sm">
                  Share org code <span className="text-[#cc0000] font-mono font-bold">{org?.orgCode}</span> with your team to join
                </p>
              </div>
            </div>

            {pendingResponders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#cc6600] rounded-full" />
                  Pending Verification ({pendingResponders.length})
                </h2>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['Name', 'Type', 'Staff ID', 'Phone', 'Status'].map((h) => (
                          <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingResponders.map((r) => (
                        <tr key={r.id} className="border-b border-white/[0.04] last:border-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{r.name ? r.name[0] : 'R'}</span>
                              </div>
                              <span className="text-white text-sm">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.responderType}</td>
                          <td className="px-6 py-4 text-white/40 text-sm font-mono">{r.staffId}</td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.phone}</td>
                          <td className="px-6 py-4">
                            <span className="bg-[#2a1a00] text-[#cc6600] text-xs px-3 py-1 rounded-full">Pending Siren verification</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-white font-bold mb-4">Verified Personnel ({verifiedResponders.length})</h2>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Name', 'Type', 'Staff ID', 'Phone', 'Status'].map((h) => (
                        <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedResponders.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm">No verified personnel yet</td></tr>
                    ) : (
                      verifiedResponders.map((r) => (
                        <tr key={r.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{r.name ? r.name[0] : 'R'}</span>
                              </div>
                              <span className="text-white text-sm">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.responderType}</td>
                          <td className="px-6 py-4 text-white/40 text-sm font-mono">{r.staffId}</td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.phone}</td>
                          <td className="px-6 py-4">
                            <span className="bg-[#1a3a1a] text-[#00cc44] text-xs px-3 py-1 rounded-full">Verified</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-8">Organisation Settings</h1>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 max-w-lg">
              <h2 className="text-white font-bold mb-6">Organisation Details</h2>
              {[
                { label: 'Organisation Name', value: org?.orgName },
                { label: 'Type', value: org?.orgType },
                { label: 'RC Number', value: org?.rcNumber },
                { label: 'State', value: org?.state },
                { label: 'LGA', value: org?.lga },
                { label: 'Contact Person', value: org?.contactPerson },
                { label: 'Email', value: org?.email },
                { label: 'Phone', value: org?.phone },
                { label: 'Org Code', value: org?.orgCode },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-4 border-b border-white/[0.06] last:border-0">
                  <span className="text-white/30 text-sm">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.label === 'Org Code' ? 'text-[#cc0000] font-mono' : 'text-white'}`}>
                    {item.value || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}