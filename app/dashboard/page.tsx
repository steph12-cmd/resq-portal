'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [org, setOrg] = useState<any>(null);
  const [responders, setResponders] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [allEmergencies, setAllEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('sirenOrg');
    if (!stored) { router.replace('/login'); return; }
    const orgData = JSON.parse(stored);
    setOrg(orgData);
    fetchOrgData(orgData);

    const unsubEmergencies = onSnapshot(
      query(collection(db, 'emergencies'), where('status', 'in', ['active', 'accepted'])),
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEmergencies(list);
      }
    );

    const unsubAll = onSnapshot(
      collection(db, 'emergencies'),
      (snap) => {
        setAllEmergencies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    return () => { unsubEmergencies(); unsubAll(); };
  }, []);

  const fetchOrgData = async (orgData: any) => {
    try {
      const respSnap = await getDocs(
        query(collection(db, 'responders'), where('orgCode', '==', orgData.orgCode))
      );
      setResponders(respSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sirenOrg');
    router.replace('/login');
  };

  const handleAcceptEmergency = async (em: any) => {
    if (!org) return;
    try {
      await updateDoc(doc(db, 'emergencies', em.id), {
        status: 'accepted',
        responderId: `org_${org.id}`,
        responderOrgId: org.id,
        responderOrgName: org.orgName,
        responderOrgType: org.orgType,
        acceptedAt: new Date(),
      });
      setSelectedEmergency(null);
      alert(`✅ ${org.orgName} is now responding to this emergency`);
    } catch (error) {
      console.log('Error accepting emergency:', error);
    }
  };

  const handleDeclineEmergency = async (em: any) => {
    if (!org) return;
    try {
      await updateDoc(doc(db, 'emergencies', em.id), {
        declinedOrgs: [...(em.declinedOrgs || []), org.id],
      });
      setSelectedEmergency(null);
    } catch (error) {
      console.log('Error declining:', error);
    }
  };

  const verifiedResponders = responders.filter(r => r.isVerified);
  const pendingResponders = responders.filter(r => !r.isVerified);
  const activeEmergencies = emergencies.filter(e => {
    if (e.declinedOrgs?.includes(org?.id)) return false;
    return true;
  });
  const resolvedEmergencies = allEmergencies.filter(e => e.status === 'resolved');

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-white/30 text-sm">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-6">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#cc0000] rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-black">
                  {selectedStaff.name ? selectedStaff.name[0].toUpperCase() : 'R'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-black text-xl">{selectedStaff.name}</h3>
                <p className="text-white/40 text-sm">{selectedStaff.responderType}</p>
              </div>
            </div>
            <div className="space-y-1 mb-6">
              {[
                { label: 'Phone', value: selectedStaff.phone },
                { label: 'Email', value: selectedStaff.email || 'Not provided' },
                { label: 'Staff ID', value: selectedStaff.staffId || '—' },
                { label: 'Org Code', value: selectedStaff.orgCode },
                { label: 'Responder Type', value: selectedStaff.responderType },
                { label: 'Track', value: selectedStaff.track === 'volunteer' ? 'Independent Volunteer' : 'Organisation Personnel' },
                { label: 'Verification', value: selectedStaff.isVerified ? '✅ Verified' : '⏳ Pending Verification' },
                { label: 'Availability', value: selectedStaff.isAvailable ? '🟢 Available' : '🔴 Offline' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-white/[0.06] last:border-0">
                  <span className="text-white/30 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedStaff(null)}
              className="w-full border border-white/10 text-white/40 py-3 rounded-xl text-sm hover:bg-white/[0.04] transition">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Emergency Detail Modal */}
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-6">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-xl">
                {selectedEmergency.emergencyEmoji} {selectedEmergency.emergencyType}
              </h3>
              <span className={`text-xs px-3 py-1.5 rounded-full ${
                selectedEmergency.status === 'accepted' ? 'bg-[#1a3a1a] text-[#00cc44]' : 'bg-[#3a0000] text-[#cc0000]'
              }`}>
                {selectedEmergency.status === 'accepted' ? 'Responder assigned' : 'Awaiting response'}
              </span>
            </div>

            <div className="space-y-1 mb-6">
              {[
                { label: 'Description', value: selectedEmergency.description },
                { label: 'People Affected', value: selectedEmergency.peopleAffected },
                { label: 'Location', value: selectedEmergency.location ? `${selectedEmergency.location.latitude?.toFixed(4)}, ${selectedEmergency.location.longitude?.toFixed(4)}` : 'Not available' },
                { label: 'Status', value: selectedEmergency.status },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start py-3 border-b border-white/[0.06] last:border-0 gap-4">
                  <span className="text-white/30 text-sm shrink-0">{item.label}</span>
                  <span className="text-white text-sm text-right">{item.value || '—'}</span>
                </div>
              ))}
            </div>

            {selectedEmergency.location && (
              <a
                href={`https://maps.google.com/?q=${selectedEmergency.location.latitude},${selectedEmergency.location.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full bg-white/[0.04] border border-white/[0.08] text-white text-center py-3 rounded-xl text-sm mb-4 hover:bg-white/[0.08] transition"
              >
                🗺️ View on Google Maps
              </a>
            )}

            {selectedEmergency.status === 'active' && (
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => handleAcceptEmergency(selectedEmergency)}
                  className="flex-1 bg-[#1a3a1a] border border-[#00cc44] text-[#00cc44] py-3 rounded-xl text-sm font-semibold hover:bg-[#00cc44] hover:text-white transition"
                >
                  ✅ {org?.orgName} will respond
                </button>
                <button
                  onClick={() => handleDeclineEmergency(selectedEmergency)}
                  className="flex-1 bg-[#3a0000] border border-[#cc0000] text-[#cc0000] py-3 rounded-xl text-sm font-semibold hover:bg-[#cc0000] hover:text-white transition"
                >
                  ❌ Decline
                </button>
              </div>
            )}

            {selectedEmergency.status === 'accepted' && selectedEmergency.responderOrgName === org?.orgName && (
              <div className="bg-[#1a3a1a] border border-[#00cc44] rounded-xl p-4 mb-4 text-center">
                <p className="text-[#00cc44] text-sm font-semibold">✅ Your organisation is responding to this emergency</p>
              </div>
            )}

            <button
              onClick={() => setSelectedEmergency(null)}
              className="w-full border border-white/10 text-white/40 py-3 rounded-xl text-sm hover:bg-white/[0.04] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
            { id: 'emergencies', label: 'Live Emergencies', count: activeEmergencies.length },
            { id: 'personnel', label: 'Personnel' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'settings', label: 'Settings' },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === item.id ? 'bg-[#cc0000] text-white' : 'text-white/40 hover:bg-white/[0.04] hover:text-white'
              }`}>
              <span>{item.label}</span>
              {(item as any).count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white/20' : 'bg-[#cc0000]'} text-white`}>
                  {(item as any).count}
                </span>
              )}
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
              <h1 className="text-2xl font-black text-white mb-1">Welcome, {org?.orgName} 👋</h1>
              <p className="text-white/30 text-sm">
                Your organisation code:{' '}
                <span className="text-[#cc0000] font-mono font-bold">{org?.orgCode}</span>
                <span className="text-white/20 ml-2">— Share with your personnel</span>
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Personnel', value: responders.length, sub: `${pendingResponders.length} pending verification` },
                { label: 'Verified', value: verifiedResponders.length, sub: 'Ready to respond' },
                { label: 'Active Emergencies', value: activeEmergencies.length, sub: 'Needs attention' },
                { label: 'Resolved', value: resolvedEmergencies.length, sub: 'All time' },
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse" />
                    <h2 className="text-white font-bold">Live Emergencies — Action Required</h2>
                  </div>
                  <button onClick={() => setActiveTab('emergencies')} className="text-[#cc0000] text-sm hover:underline">
                    View all →
                  </button>
                </div>
                {activeEmergencies.slice(0, 3).map((em) => (
                  <div
                    key={em.id}
                    className="flex items-center justify-between bg-white/[0.02] rounded-xl p-4 mb-3 last:mb-0 cursor-pointer hover:bg-white/[0.04] transition"
                    onClick={() => setSelectedEmergency(em)}
                  >
                    <div>
                      <p className="text-white text-sm font-semibold">{em.emergencyEmoji} {em.emergencyType}</p>
                      <p className="text-white/40 text-xs mt-1">{em.description?.slice(0, 50)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        em.status === 'accepted' ? 'bg-[#1a3a1a] text-[#00cc44]' : 'bg-[#3a0000] text-[#cc0000]'
                      }`}>
                        {em.status === 'accepted' ? 'Assigned' : 'Needs response'}
                      </span>
                      <span className="text-white/20 text-lg">›</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold">Your Personnel</h2>
                <button onClick={() => setActiveTab('personnel')} className="text-[#cc0000] text-sm hover:underline">
                  View all →
                </button>
              </div>
              {responders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/20 text-sm mb-2">No personnel yet</p>
                  <p className="text-white/10 text-xs">Share code <span className="text-[#cc0000] font-mono">{org?.orgCode}</span></p>
                </div>
              ) : (
                responders.slice(0, 5).map((r) => (
                  <div key={r.id}
                    className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] rounded-xl px-2 transition"
                    onClick={() => setSelectedStaff(r)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{r.name ? r.name[0] : 'R'}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{r.name}</p>
                        <p className="text-white/30 text-xs">{r.responderType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${r.isAvailable ? 'bg-[#00cc44]' : 'bg-[#555]'}`} />
                      <span className={`text-xs px-2 py-1 rounded-full ${r.isVerified ? 'bg-[#1a3a1a] text-[#00cc44]' : 'bg-[#2a1a00] text-[#cc6600]'}`}>
                        {r.isVerified ? 'Verified' : 'Pending'}
                      </span>
                      <span className="text-white/20 text-lg">›</span>
                    </div>
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
            <p className="text-white/30 text-sm mb-8">
              Click any emergency to view details and respond on behalf of {org?.orgName}
            </p>

            {activeEmergencies.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
                <div className="w-3 h-3 bg-[#cc0000]/30 rounded-full mx-auto mb-4" />
                <p className="text-white/20 text-sm">No active emergencies right now</p>
                <p className="text-white/10 text-xs mt-2">Emergencies will appear here in real time</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeEmergencies.map((em) => (
                  <div
                    key={em.id}
                    className="bg-white/[0.02] border border-[#cc0000]/20 rounded-2xl p-6 cursor-pointer hover:bg-white/[0.04] transition"
                    onClick={() => setSelectedEmergency(em)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-bold text-lg">{em.emergencyEmoji} {em.emergencyType}</h3>
                        <p className="text-white/40 text-sm mt-1">{em.description?.slice(0, 80)}</p>
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full shrink-0 ml-4 ${
                        em.status === 'accepted'
                          ? em.responderOrgName === org?.orgName
                            ? 'bg-[#1a3a1a] text-[#00cc44]'
                            : 'bg-[#1a2a3a] text-[#4499ff]'
                          : 'bg-[#3a0000] text-[#cc0000]'
                      }`}>
                        {em.status === 'accepted'
                          ? em.responderOrgName === org?.orgName
                            ? `✅ ${org?.orgName} responding`
                            : `${em.responderOrgName || 'Responder'} assigned`
                          : 'Awaiting response'}
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
                        <p className="text-white/20 text-xs mb-1">Action</p>
                        <p className="text-[#cc0000] text-sm font-semibold">Click to respond →</p>
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
            <div className="mb-8">
              <h1 className="text-2xl font-black text-white mb-1">Personnel</h1>
              <p className="text-white/30 text-sm">
                Share org code{' '}
                <span className="text-[#cc0000] font-mono font-bold">{org?.orgCode}</span>
                {' '}with your team. Click any staff for full details.
              </p>
            </div>

            {pendingResponders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#cc6600] rounded-full" />
                  Pending Siren Verification ({pendingResponders.length})
                </h2>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['Name', 'Type', 'Staff ID', 'Phone', 'Status', ''].map((h) => (
                          <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingResponders.map((r) => (
                        <tr key={r.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedStaff(r)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{r.name ? r.name[0] : 'R'}</span>
                              </div>
                              <span className="text-white text-sm">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.responderType}</td>
                          <td className="px-6 py-4 text-white/40 text-sm font-mono">{r.staffId || '—'}</td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.phone}</td>
                          <td className="px-6 py-4">
                            <span className="bg-[#2a1a00] text-[#cc6600] text-xs px-3 py-1 rounded-full">Pending verification</span>
                          </td>
                          <td className="px-6 py-4 text-white/20 text-lg">›</td>
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
                      {['Name', 'Type', 'Staff ID', 'Availability', 'Status', ''].map((h) => (
                        <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedResponders.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-white/20 text-sm">No verified personnel yet</td></tr>
                    ) : (
                      verifiedResponders.map((r) => (
                        <tr key={r.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedStaff(r)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{r.name ? r.name[0] : 'R'}</span>
                              </div>
                              <span className="text-white text-sm">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.responderType}</td>
                          <td className="px-6 py-4 text-white/40 text-sm font-mono">{r.staffId || '—'}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${r.isAvailable ? 'bg-[#00cc44]' : 'bg-[#555]'}`} />
                              <span className={`text-xs ${r.isAvailable ? 'text-[#00cc44]' : 'text-white/30'}`}>
                                {r.isAvailable ? 'Available' : 'Offline'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-[#1a3a1a] text-[#00cc44] text-xs px-3 py-1 rounded-full">Verified</span>
                          </td>
                          <td className="px-6 py-4 text-white/20 text-lg">›</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Analytics</h1>
            <p className="text-white/30 text-sm mb-8">Your organisation response performance</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { title: 'Total Personnel', value: responders.length, sub: 'Registered under your org' },
                { title: 'Verified Responders', value: verifiedResponders.length, sub: 'Active on Siren' },
                { title: 'Currently Available', value: verifiedResponders.filter((r: any) => r.isAvailable).length, sub: 'Online now' },
                { title: 'Emergencies Responded', value: allEmergencies.filter(e => e.responderOrgName === org?.orgName).length, sub: 'By your organisation' },
              ].map((item) => (
                <div key={item.title} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                  <p className="text-white/30 text-sm mb-2">{item.title}</p>
                  <p className="text-5xl font-black text-white mb-1">{item.value}</p>
                  <p className="text-[#cc0000] text-sm">{item.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">Personnel Breakdown</h2>
                {[
                  { label: 'Total Registered', value: responders.length },
                  { label: 'Verified', value: verifiedResponders.length },
                  { label: 'Pending', value: pendingResponders.length },
                  { label: 'Currently Online', value: verifiedResponders.filter((r: any) => r.isAvailable).length },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-white/60 text-sm">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">Emergency Response</h2>
                {[
                  { label: 'Active Now', value: activeEmergencies.length },
                  { label: 'Responded by Org', value: allEmergencies.filter(e => e.responderOrgName === org?.orgName).length },
                  { label: 'Total in System', value: allEmergencies.length },
                  { label: 'Resolved', value: resolvedEmergencies.length },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-white/60 text-sm">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-8">Settings</h1>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 max-w-lg">
              <h2 className="text-white font-bold mb-6">Organisation Details</h2>
              {[
                { label: 'Organisation Name', value: org?.orgName },
                { label: 'Type', value: org?.orgType },
                { label: 'RC Number', value: org?.rcNumber },
                { label: 'State', value: org?.state },
                { label: 'LGA', value: org?.lga },
                { label: 'Address', value: org?.address },
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