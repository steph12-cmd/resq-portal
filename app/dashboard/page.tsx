'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [responders, setResponders] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rejectType, setRejectType] = useState('');

  useEffect(() => {
    fetchAllData();
    const unsubEmergencies = onSnapshot(
      collection(db, 'emergencies'),
      (snap) => {
        setEmergencies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );
    return () => unsubEmergencies();
  }, []);

  const fetchAllData = async () => {
    try {
      const [orgSnap, respSnap, userSnap] = await Promise.all([
        getDocs(collection(db, 'organisations')),
        getDocs(collection(db, 'responders')),
        getDocs(collection(db, 'users')),
      ]);
      setOrganisations(orgSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setResponders(respSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setUsers(userSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOrgCode = () => {
    return 'SRN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const sendEmail = async (type: string, to: string, data: any) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, to, ...data }),
      });
    } catch (error) {
      console.log('Email error:', error);
    }
  };

  const handleApproveOrg = async (org: any) => {
    try {
      const orgCode = generateOrgCode();
      await updateDoc(doc(db, 'organisations', org.id), {
        status: 'approved',
        orgCode,
        approvedAt: new Date(),
      });
      await sendEmail('org_approved', org.email, {
        orgName: org.orgName,
        orgCode,
      });
      fetchAllData();
      alert(`✅ ${org.orgName} approved! Org code: ${orgCode}`);
    } catch (error) {
      console.log('Error approving org:', error);
    }
  };

  const handleRejectOrg = async () => {
    if (!rejectReason) return alert('Please enter a reason');
    try {
      await updateDoc(doc(db, 'organisations', selectedItem.id), {
        status: 'rejected',
        rejectionReason: rejectReason,
        rejectedAt: new Date(),
      });
      await sendEmail('org_rejected', selectedItem.email, {
        orgName: selectedItem.orgName,
        reason: rejectReason,
      });
      setShowRejectModal(false);
      setRejectReason('');
      fetchAllData();
      alert(`❌ ${selectedItem.orgName} rejected`);
    } catch (error) {
      console.log('Error rejecting org:', error);
    }
  };

  const handleApproveResponder = async (responder: any) => {
    try {
      await updateDoc(doc(db, 'responders', responder.id), {
        isVerified: true,
        verifiedAt: new Date(),
      });
      if (responder.email) {
        await sendEmail('responder_approved', responder.email, {
          responderName: responder.name,
        });
      }
      fetchAllData();
      alert(`✅ ${responder.name} approved as responder!`);
    } catch (error) {
      console.log('Error approving responder:', error);
    }
  };

  const handleRejectResponder = async () => {
    if (!rejectReason) return alert('Please enter a reason');
    try {
      await updateDoc(doc(db, 'responders', selectedItem.id), {
        isVerified: false,
        rejectionReason: rejectReason,
        rejectedAt: new Date(),
      });
      if (selectedItem.email) {
        await sendEmail('responder_rejected', selectedItem.email, {
          responderName: selectedItem.name,
          reason: rejectReason,
        });
      }
      setShowRejectModal(false);
      setRejectReason('');
      fetchAllData();
      alert(`❌ ${selectedItem.name} rejected`);
    } catch (error) {
      console.log('Error rejecting responder:', error);
    }
  };

  const pendingOrgs = organisations.filter(o => !o.status || o.status === 'pending');
  const approvedOrgs = organisations.filter(o => o.status === 'approved');
  const pendingResponders = responders.filter(r => !r.isVerified);
  const verifiedResponders = responders.filter(r => r.isVerified);
  const activeEmergencies = emergencies.filter(e => e.status === 'active' || e.status === 'accepted');
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved');

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-6">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <h3 className="font-black text-xl mb-2">Reason for rejection</h3>
            <p className="text-white/40 text-sm mb-6">
              This will be sent to {selectedItem?.orgName || selectedItem?.name} via email
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete documentation, Invalid RC number..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-4 text-white placeholder-white/20 text-sm resize-none h-32 focus:outline-none focus:border-[#cc0000]/50 mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                className="flex-1 border border-white/10 py-3 rounded-xl text-white/40 text-sm hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
              <button
                onClick={rejectType === 'org' ? handleRejectOrg : handleRejectResponder}
                className="flex-1 bg-[#cc0000] py-3 rounded-xl text-white text-sm font-semibold hover:bg-[#aa0000] transition"
              >
                Send Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <img src="/icon.png" alt="Siren" className="w-8 h-8 rounded-xl" />
          <div>
            <p className="text-white font-bold text-sm">Siren Admin</p>
            <p className="text-white/30 text-xs">Control Centre</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { id: 'overview', label: 'Overview', count: null },
            { id: 'organisations', label: 'Organisations', count: pendingOrgs.length },
            { id: 'responders', label: 'Responders', count: pendingResponders.length },
            { id: 'emergencies', label: 'Emergencies', count: activeEmergencies.length },
            { id: 'users', label: 'Citizens', count: null },
            { id: 'analytics', label: 'Analytics', count: null },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === item.id
                  ? 'bg-[#cc0000] text-white'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.count !== null && item.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === item.id ? 'bg-white/20 text-white' : 'bg-[#cc0000] text-white'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Siren Admin</p>
              <p className="text-white/30 text-xs">Super Admin</p>
            </div>
          </div>
          <Link href="/login" className="text-white/20 text-xs hover:text-white/50 transition">
            Logout
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white mb-1">Command Centre</h1>
              <p className="text-white/30 text-sm">Real-time overview of Siren operations</p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Citizens', value: users.length, sub: 'Registered users' },
                { label: 'Organisations', value: approvedOrgs.length, sub: `${pendingOrgs.length} pending approval` },
                { label: 'Responders', value: verifiedResponders.length, sub: `${pendingResponders.length} pending verification` },
                { label: 'Active Emergencies', value: activeEmergencies.length, sub: `${resolvedEmergencies.length} resolved total` },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-white/40 text-sm mb-1">{stat.label}</p>
                  <p className="text-white/20 text-xs">{stat.sub}</p>
                </div>
              ))}
            </div>

            {pendingOrgs.length > 0 && (
              <div className="bg-white/[0.02] border border-[#cc0000]/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse" />
                  <h2 className="text-white font-bold">
                    {pendingOrgs.length} Organisation{pendingOrgs.length > 1 ? 's' : ''} Awaiting Approval
                  </h2>
                </div>
                <div className="flex flex-col gap-3">
                  {pendingOrgs.slice(0, 3).map((org) => (
                    <div key={org.id} className="flex items-center justify-between bg-white/[0.02] rounded-xl p-4">
                      <div>
                        <p className="text-white text-sm font-semibold">{org.orgName}</p>
                        <p className="text-white/40 text-xs">{org.orgType} • {org.state}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveOrg(org)}
                          className="bg-[#1a3a1a] border border-[#00cc44] text-[#00cc44] text-xs px-3 py-1.5 rounded-lg hover:bg-[#00cc44] hover:text-white transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => { setSelectedItem(org); setRejectType('org'); setShowRejectModal(true); }}
                          className="bg-[#3a0000] border border-[#cc0000] text-[#cc0000] text-xs px-3 py-1.5 rounded-lg hover:bg-[#cc0000] hover:text-white transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingOrgs.length > 3 && (
                    <button onClick={() => setActiveTab('organisations')} className="text-[#cc0000] text-sm hover:underline text-left">
                      View all {pendingOrgs.length} pending →
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">Live Emergencies</h2>
                {activeEmergencies.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/20 text-sm">No active emergencies</p>
                  </div>
                ) : (
                  activeEmergencies.map((em) => (
                    <div key={em.id} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                      <div>
                        <p className="text-white text-sm font-semibold">{em.emergencyEmoji} {em.emergencyType}</p>
                        <p className="text-white/40 text-xs">{em.description?.slice(0, 40)}...</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        em.status === 'accepted' ? 'bg-[#1a3a1a] text-[#00cc44]' : 'bg-[#3a0000] text-[#cc0000]'
                      }`}>
                        {em.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">Recent Registrations</h2>
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
                    <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">
                        {user.name ? user.name[0].toUpperCase() : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm">{user.name || 'Unknown'}</p>
                      <p className="text-white/30 text-xs">{user.phone} • {user.state}</p>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-white/20 text-sm text-center py-8">No citizens registered yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORGANISATIONS */}
        {activeTab === 'organisations' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Organisations</h1>
            <p className="text-white/30 text-sm mb-8">Review and verify emergency response organisations</p>

            {pendingOrgs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse" />
                  Pending Approval ({pendingOrgs.length})
                </h2>
                <div className="flex flex-col gap-4">
                  {pendingOrgs.map((org) => (
                    <div key={org.id} className="bg-white/[0.02] border border-[#cc0000]/20 rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">{org.orgName}</h3>
                          <p className="text-white/40 text-sm">{org.orgType} • {org.state}, {org.lga}</p>
                        </div>
                        <span className="bg-[#2a1a00] border border-[#cc6600] text-[#cc6600] text-xs px-3 py-1 rounded-full">
                          Pending
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {[
                          { label: 'Contact Person', value: org.contactPerson },
                          { label: 'Email', value: org.email },
                          { label: 'Phone', value: org.phone },
                          { label: 'RC Number', value: org.rcNumber },
                          { label: 'Address', value: org.address },
                          { label: 'LGA', value: org.lga },
                        ].map((field) => (
                          <div key={field.label}>
                            <p className="text-white/30 text-xs mb-1">{field.label}</p>
                            <p className="text-white text-sm">{field.value || '—'}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveOrg(org)}
                          className="flex-1 bg-[#1a3a1a] border border-[#00cc44] text-[#00cc44] py-3 rounded-xl text-sm font-semibold hover:bg-[#00cc44] hover:text-white transition"
                        >
                          ✅ Approve Organisation
                        </button>
                        <button
                          onClick={() => { setSelectedItem(org); setRejectType('org'); setShowRejectModal(true); }}
                          className="flex-1 bg-[#3a0000] border border-[#cc0000] text-[#cc0000] py-3 rounded-xl text-sm font-semibold hover:bg-[#cc0000] hover:text-white transition"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-white font-bold mb-4">Approved Organisations ({approvedOrgs.length})</h2>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Organisation', 'Type', 'State', 'Org Code', 'Status'].map((h) => (
                        <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {approvedOrgs.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm">No approved organisations yet</td></tr>
                    ) : (
                      approvedOrgs.map((org) => (
                        <tr key={org.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                            <p className="text-white text-sm font-semibold">{org.orgName}</p>
                            <p className="text-white/30 text-xs">{org.email}</p>
                          </td>
                          <td className="px-6 py-4 text-white/40 text-sm">{org.orgType}</td>
                          <td className="px-6 py-4 text-white/40 text-sm">{org.state}</td>
                          <td className="px-6 py-4">
                            <span className="bg-white/[0.04] border border-white/10 text-white text-xs px-3 py-1 rounded-lg font-mono">
                              {org.orgCode}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-[#1a3a1a] text-[#00cc44] text-xs px-3 py-1 rounded-full">Approved</span>
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

        {/* RESPONDERS */}
        {activeTab === 'responders' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Responders</h1>
            <p className="text-white/30 text-sm mb-8">Verify emergency responders across all organisations</p>

            {pendingResponders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse" />
                  Pending Verification ({pendingResponders.length})
                </h2>
                <div className="flex flex-col gap-4">
                  {pendingResponders.map((responder) => (
                    <div key={responder.id} className="bg-white/[0.02] border border-[#cc0000]/20 rounded-2xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#cc0000] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {responder.name ? responder.name[0].toUpperCase() : 'R'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-white font-bold">{responder.name}</h3>
                            <p className="text-white/40 text-sm">{responder.responderType} • {responder.phone}</p>
                          </div>
                        </div>
                        <span className="bg-[#2a1a00] border border-[#cc6600] text-[#cc6600] text-xs px-3 py-1 rounded-full">
                          Pending
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {[
                          { label: 'Organisation Code', value: responder.orgCode },
                          { label: 'Staff ID', value: responder.staffId },
                          { label: 'Email', value: responder.email || 'Not provided' },
                        ].map((field) => (
                          <div key={field.label}>
                            <p className="text-white/30 text-xs mb-1">{field.label}</p>
                            <p className="text-white text-sm">{field.value || '—'}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApproveResponder(responder)}
                          className="flex-1 bg-[#1a3a1a] border border-[#00cc44] text-[#00cc44] py-3 rounded-xl text-sm font-semibold hover:bg-[#00cc44] hover:text-white transition"
                        >
                          ✅ Verify Responder
                        </button>
                        <button
                          onClick={() => { setSelectedItem(responder); setRejectType('responder'); setShowRejectModal(true); }}
                          className="flex-1 bg-[#3a0000] border border-[#cc0000] text-[#cc0000] py-3 rounded-xl text-sm font-semibold hover:bg-[#cc0000] hover:text-white transition"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-white font-bold mb-4">Verified Responders ({verifiedResponders.length})</h2>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {['Name', 'Type', 'Org Code', 'Phone', 'Status'].map((h) => (
                        <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedResponders.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm">No verified responders yet</td></tr>
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
                          <td className="px-6 py-4">
                            <span className="font-mono text-white/60 text-xs">{r.orgCode}</span>
                          </td>
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

        {/* EMERGENCIES */}
        {activeTab === 'emergencies' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Emergencies</h1>
            <p className="text-white/30 text-sm mb-8">Real-time emergency feed across Nigeria</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Active', value: activeEmergencies.length, color: 'text-[#cc0000]' },
                { label: 'Resolved', value: resolvedEmergencies.length, color: 'text-[#00cc44]' },
                { label: 'Total', value: emergencies.length, color: 'text-white' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-center">
                  <p className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
                  <p className="text-white/30 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Type', 'Description', 'Location', 'People', 'Status'].map((h) => (
                      <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {emergencies.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm">No emergencies recorded yet</td></tr>
                  ) : (
                    emergencies.map((em) => (
                      <tr key={em.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <p className="text-white text-sm font-semibold">{em.emergencyEmoji} {em.emergencyType}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white/40 text-sm max-w-xs truncate">{em.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white/40 text-xs">
                            {em.location ? `${em.location.latitude?.toFixed(3)}, ${em.location.longitude?.toFixed(3)}` : 'No location'}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-white/40 text-sm">{em.peopleAffected}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            em.status === 'resolved' ? 'bg-[#1a3a1a] text-[#00cc44]' :
                            em.status === 'accepted' ? 'bg-[#1a2a3a] text-[#4499ff]' :
                            'bg-[#3a0000] text-[#cc0000]'
                          }`}>
                            {em.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CITIZENS */}
        {activeTab === 'users' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Citizens</h1>
            <p className="text-white/30 text-sm mb-8">All registered citizens on Siren</p>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Name', 'Phone', 'Location', 'Emergencies'].map((h) => (
                      <th key={h} className="text-left text-white/30 text-xs font-semibold px-6 py-4 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-white/20 text-sm">No citizens registered yet</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {user.name ? user.name[0].toUpperCase() : '?'}
                              </span>
                            </div>
                            <span className="text-white text-sm">{user.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/40 text-sm">{user.phone}</td>
                        <td className="px-6 py-4 text-white/40 text-sm">
                          {user.lga && user.state ? `${user.lga}, ${user.state}` : user.state || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white/40 text-sm">
                            {emergencies.filter(e => e.userId === user.id).length}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Analytics</h1>
            <p className="text-white/30 text-sm mb-8">Platform performance and insights</p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { title: 'Total Emergencies', value: emergencies.length, sub: 'All time' },
                { title: 'Resolution Rate', value: emergencies.length > 0 ? `${Math.round((resolvedEmergencies.length / emergencies.length) * 100)}%` : '0%', sub: 'Resolved vs total' },
                { title: 'Active Responders', value: verifiedResponders.filter((r: any) => r.isAvailable).length, sub: 'Currently online' },
                { title: 'Registered Citizens', value: users.length, sub: 'Total users' },
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
                <h2 className="text-white font-bold mb-4">Emergency Types Breakdown</h2>
                {(() => {
                  const types: { [key: string]: number } = {};
                  emergencies.forEach((e: any) => {
                    if (e.emergencyType) {
                      types[e.emergencyType] = (types[e.emergencyType] || 0) + 1;
                    }
                  });
                  const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 5);
                  return sorted.length === 0 ? (
                    <p className="text-white/20 text-sm text-center py-8">No data yet</p>
                  ) : (
                    sorted.map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                        <span className="text-white/60 text-sm">{type}</span>
                        <span className="text-white font-bold">{count}</span>
                      </div>
                    ))
                  );
                })()}
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">Organisation Overview</h2>
                {[
                  { label: 'Total Registered', value: organisations.length },
                  { label: 'Approved', value: approvedOrgs.length },
                  { label: 'Pending', value: pendingOrgs.length },
                  { label: 'Rejected', value: organisations.filter((o: any) => o.status === 'rejected').length },
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

      </div>
    </div>
  );
}