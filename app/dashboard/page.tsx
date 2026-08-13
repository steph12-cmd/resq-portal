'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const MAPS_EMBED_KEY = 'AIzaSyDSApdedmKyI31lmFzL1U1kG9WoOUdmLps';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [org, setOrg] = useState<any>(null);
  const [responders, setResponders] = useState<any[]>([]);
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [allEmergencies, setAllEmergencies] = useState<any[]>([]);
    const activeEmergencies = emergencies.filter(e => {
    const declinedOrgs = e.declinedOrgs || [];
    return !declinedOrgs.includes(org?.id);
  });

  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');
  const [sharingLocation, setSharingLocation] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const [emergencyView, setEmergencyView] = useState<'list' | 'heatmap'>('list');
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const circlesRef = useRef<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('sirenOrg');
    if (!stored) {
      router.replace('/login');
      return;
    }
    const orgData = JSON.parse(stored);
    setOrg(orgData);
    fetchOrgData(orgData);

    const unsubActive = onSnapshot(
      query(
        collection(db, 'emergencies'),
        where('status', 'in', ['active', 'accepted'])
      ),
      (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setEmergencies(list);
      },
      (error) => console.log('Emergency listener error:', error)
    );

    const unsubAll = onSnapshot(
      collection(db, 'emergencies'),
      (snap) => setAllEmergencies(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (error) => console.log('All emergencies listener error:', error)
    );

    return () => {
      unsubActive();
      unsubAll();
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Keeps the open modal in sync with live updates without needing to reopen it
  useEffect(() => {
    if (!selectedEmergency) return;
    const fresh = emergencies.find(e => e.id === selectedEmergency.id)
      || allEmergencies.find(e => e.id === selectedEmergency.id);
    if (fresh) setSelectedEmergency(fresh);
  }, [emergencies, allEmergencies]);

  // Chat listener — only when chat panel is open for the selected emergency
  useEffect(() => {
    if (!showChat || !selectedEmergency) return;
    const q = query(
      collection(db, 'emergencies', selectedEmergency.id, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [showChat, selectedEmergency?.id]);

  // Heatmap renderer — draws/updates clustered circles whenever emergencies
  // change or the view is toggled to heatmap
  useEffect(() => {
    if (emergencyView !== 'heatmap' || !mapRef.current) return;
    // @ts-ignore
    if (typeof window === 'undefined' || !window.google) return;

    // @ts-ignore
    const google = window.google;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: activeEmergencies[0]?.location
          ? {
              lat: activeEmergencies[0].location.latitude,
              lng: activeEmergencies[0].location.longitude,
            }
          : { lat: 6.5244, lng: 3.3792 },
        zoom: 12,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#888888' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d0d0d' }] },
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        ],
      });
    }

    // Clear old circles
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    // Cluster nearby emergencies (within ~500m)
    const CLUSTER_KM = 0.5;
    const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const withLocation = activeEmergencies.filter((e: any) => e.location);
    const used = new Set<string>();
    const clusters: any[] = [];

    withLocation.forEach((em: any) => {
      if (used.has(em.id)) return;
      const group = [em];
      used.add(em.id);
      withLocation.forEach((other: any) => {
        if (used.has(other.id)) return;
        if (haversine(em.location.latitude, em.location.longitude, other.location.latitude, other.location.longitude) <= CLUSTER_KM) {
          group.push(other);
          used.add(other.id);
        }
      });
      const avgLat = group.reduce((s, e) => s + e.location.latitude, 0) / group.length;
      const avgLng = group.reduce((s, e) => s + e.location.longitude, 0) / group.length;
      clusters.push({ center: { lat: avgLat, lng: avgLng }, emergencies: group });
    });

    clusters.forEach((cluster) => {
      const count = cluster.emergencies.length;
      const color = count >= 4 ? '#cc0000' : count >= 2 ? '#ff6600' : '#ffcc00';
      const radius = 300 + (count - 1) * 200;

      const circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: color,
        fillOpacity: 0.25,
        map: mapInstanceRef.current,
        center: cluster.center,
        radius,
      });

      circle.addListener('click', () => {
        setSelectedEmergency(cluster.emergencies[0]);
      });

      circlesRef.current.push(circle);
    });
  }, [emergencyView, activeEmergencies]);

  const fetchOrgData = async (orgData: any) => {
    try {
      const respSnap = await getDocs(
        query(
          collection(db, 'responders'),
          where('orgCode', '==', orgData.orgCode)
        )
      );
      setResponders(respSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.log('Error fetching org data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
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
        responderName: org.orgName,
        acceptedAt: new Date(),
      });
      setSelectedEmergency(null);
      alert(`✅ ${org.orgName} is now responding to this emergency`);
    } catch (error) {
      console.log('Error accepting emergency:', error);
      alert('Failed to accept emergency. Please try again.');
    }
  };

  const handleDeclineEmergency = async (em: any) => {
    if (!org) return;
    try {
      const currentDeclined = em.declinedOrgs || [];
      await updateDoc(doc(db, 'emergencies', em.id), {
        declinedOrgs: [...currentDeclined, org.id],
      });
      setSelectedEmergency(null);
    } catch (error) {
      console.log('Error declining:', error);
    }
  };

  const handleResolveEmergency = async (em: any) => {
    if (!confirm('Mark this emergency as resolved?')) return;
    stopSharingLocation();
    try {
      await updateDoc(doc(db, 'emergencies', em.id), {
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy: org?.orgName,
        responderLocation: null,
      });
      setSelectedEmergency(null);
      setShowChat(false);
      alert(`✅ Emergency marked as resolved by ${org?.orgName}`);
    } catch (error) {
      console.log('Error resolving:', error);
      alert('Failed to resolve. Please try again.');
    }
  };

  const handleCancelOrgResponse = async (em: any) => {
    if (!confirm('Cancel your response? The emergency will go back to active.')) return;
    stopSharingLocation();
    try {
      await updateDoc(doc(db, 'emergencies', em.id), {
        status: 'active',
        responderId: null,
        responderName: null,
        responderOrgId: null,
        responderOrgName: null,
        responderOrgType: null,
        responderLocation: null,
        acceptedAt: null,
      });
      setSelectedEmergency(null);
      setShowChat(false);
    } catch (error) {
      console.log('Error cancelling response:', error);
      alert('Failed to cancel response. Please try again.');
    }
  };

  // ---- Live location sharing (writes to the SAME field the mobile map already reads) ----
  const startSharingLocation = () => {
    if (!selectedEmergency || !navigator.geolocation) {
      alert('Location sharing is not supported in this browser');
      return;
    }
    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await updateDoc(doc(db, 'emergencies', selectedEmergency.id), {
            responderLocation: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            },
          });
        } catch (error) {
          console.log('Error updating location:', error);
        }
      },
      (error) => {
        console.log('Geolocation error:', error);
        alert('Could not access your location. Please allow location permission.');
        setSharingLocation(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    watchIdRef.current = id;
    setSharingLocation(true);
  };

  const stopSharingLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharingLocation(false);
  };

  // ---- Chat ----
  const handleSendChat = async () => {
    if (!chatText.trim() || !selectedEmergency || !org) return;
    const text = chatText.trim();
    setChatText('');
    try {
      await addDoc(collection(db, 'emergencies', selectedEmergency.id, 'messages'), {
        senderId: `org_${org.id}`,
        senderName: org.orgName,
        senderRole: 'organisation',
        text,
        timestamp: serverTimestamp(),
        readBy: [`org_${org.id}`],
      });
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const formatChatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const verifiedResponders = responders.filter(r => r.isVerified);
  const pendingResponders = responders.filter(r => !r.isVerified);


  const orgResponses = allEmergencies.filter(e => e.responderOrgName === org?.orgName);
  const isRespondingOrg = selectedEmergency?.responderOrgName === org?.orgName
    && selectedEmergency?.status === 'accepted';

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
                { label: 'Type', value: selectedStaff.responderType },
                { label: 'Track', value: selectedStaff.track === 'volunteer' ? 'Volunteer' : 'Organisation Personnel' },
                { label: 'Verified', value: selectedStaff.isVerified ? '✅ Verified' : '⏳ Pending' },
                { label: 'Status', value: selectedStaff.isAvailable ? '🟢 Available' : '🔴 Offline' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-white/[0.06] last:border-0">
                  <span className="text-white/30 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedStaff(null)}
              className="w-full border border-white/10 text-white/40 py-3 rounded-xl text-sm hover:bg-white/[0.04] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Emergency Detail Modal */}
      {selectedEmergency && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-6 py-6">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-lg max-h-[92vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black text-xl">
                {selectedEmergency.emergencyEmoji} {selectedEmergency.emergencyType}
              </h3>
              <span className={`text-xs px-3 py-1.5 rounded-full ${
                selectedEmergency.status === 'accepted'
                  ? 'bg-[#1a3a1a] text-[#00cc44]'
                  : selectedEmergency.status === 'resolved'
                  ? 'bg-[#1a2a3a] text-[#4499ff]'
                  : 'bg-[#3a0000] text-[#cc0000]'
              }`}>
                {selectedEmergency.status === 'accepted'
                  ? 'Responder assigned'
                  : selectedEmergency.status === 'resolved'
                  ? 'Resolved'
                  : 'Awaiting response'}
              </span>
            </div>

            <div className="space-y-1 mb-6">
              {[
                { label: 'Victim', value: selectedEmergency.userName || 'Unknown' },
                { label: 'Description', value: selectedEmergency.description || 'No description' },
                { label: 'People Affected', value: selectedEmergency.peopleAffected || '1' },
                {
                  label: 'Location',
                  value: selectedEmergency.location
                    ? `${selectedEmergency.location.latitude?.toFixed(4)}, ${selectedEmergency.location.longitude?.toFixed(4)}`
                    : 'Not available',
                },
                { label: 'Status', value: selectedEmergency.status },
                {
                  label: 'Responder',
                  value: selectedEmergency.responderName || selectedEmergency.responderOrgName || 'None yet',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-start py-3 border-b border-white/[0.06] last:border-0 gap-4"
                >
                  <span className="text-white/30 text-sm shrink-0">{item.label}</span>
                  <span className="text-white text-sm text-right">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Live mini-map — shows victim pin, and route if org is sharing location */}
            {selectedEmergency.location && (
              <div className="rounded-xl overflow-hidden mb-4 border border-white/10">
                <iframe
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={
                    selectedEmergency.responderLocation
                      ? `https://www.google.com/maps/embed/v1/directions?key=${MAPS_EMBED_KEY}&origin=${selectedEmergency.responderLocation.latitude},${selectedEmergency.responderLocation.longitude}&destination=${selectedEmergency.location.latitude},${selectedEmergency.location.longitude}`
                      : `https://www.google.com/maps/embed/v1/view?key=${MAPS_EMBED_KEY}&center=${selectedEmergency.location.latitude},${selectedEmergency.location.longitude}&zoom=15`
                  }
                />
              </div>
            )}

            {selectedEmergency.location && (
              <a>
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedEmergency.location.latitude},${selectedEmergency.location.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full bg-white/[0.04] border border-white/[0.08] text-white text-center py-3 rounded-xl text-sm mb-4 hover:bg-white/[0.08] transition"
              
                🗺️ Navigate (Open in Google Maps)
              </a>
            )}

            {/* ACCEPT / DECLINE */}
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

            {/* RESPONDING — chat, location sharing, resolve, cancel */}
            {isRespondingOrg && (
              <div className="space-y-3 mb-4">
                <div className="bg-[#1a3a1a] border border-[#00cc44] rounded-xl p-3 text-center">
                  <p className="text-[#00cc44] text-sm font-semibold">
                    ✅ Your organisation is responding
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex-1 bg-[#0d1a2a] border border-[#4499ff] text-[#4499ff] py-3 rounded-xl text-sm font-semibold hover:bg-[#4499ff] hover:text-white transition"
                  >
                    💬 {showChat ? 'Hide Chat' : 'Message Victim'}
                  </button>
                  <button
                    onClick={() => sharingLocation ? stopSharingLocation() : startSharingLocation()}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition ${
                      sharingLocation
                        ? 'bg-[#cc0000] border-[#cc0000] text-white'
                        : 'bg-[#1a1a1a] border-white/20 text-white/60 hover:bg-white/[0.06]'
                    }`}
                  >
                    {sharingLocation ? '📡 Sharing Location' : '📍 Share My Location'}
                  </button>
                </div>

                {/* Chat panel */}
                {showChat && (
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                    <div className="max-h-64 overflow-y-auto flex flex-col gap-2 mb-3">
                      {messages.length === 0 ? (
                        <p className="text-white/20 text-xs text-center py-6">No messages yet</p>
                      ) : (
                        messages.map((msg) => {
                          const isMe = msg.senderRole === 'organisation';
                          return (
                            <div
                              key={msg.id}
                              className={`max-w-[80%] rounded-xl px-3 py-2 ${
                                isMe
                                  ? 'bg-[#cc0000] text-white self-end rounded-br-sm'
                                  : 'bg-[#1a1a1a] text-white/80 self-start rounded-bl-sm'
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-white/30'}`}>
                                {formatChatTime(msg.timestamp)}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={chatText}
                        onChange={(e) => setChatText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#cc0000]/50"
                      />
                      <button
                        onClick={handleSendChat}
                        className="bg-[#cc0000] text-white px-4 rounded-xl text-sm font-semibold hover:bg-[#aa0000] transition"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleResolveEmergency(selectedEmergency)}
                  className="w-full bg-[#1a3a1a] border border-[#00cc44] text-[#00cc44] py-4 rounded-xl text-sm font-semibold hover:bg-[#00cc44] hover:text-white transition"
                >
                  ✅ Mark as Resolved
                </button>

                <button
                  onClick={() => handleCancelOrgResponse(selectedEmergency)}
                  className="w-full bg-[#1a1a1a] border border-white/10 text-white/40 py-3 rounded-xl text-sm hover:bg-white/[0.04] transition"
                >
                  Cancel Response
                </button>
              </div>
            )}

            {selectedEmergency.status === 'accepted' &&
              selectedEmergency.responderOrgName !== org?.orgName && (
              <div className="bg-[#1a2a3a] border border-[#4499ff] rounded-xl p-4 mb-4 text-center">
                <p className="text-[#4499ff] text-sm font-semibold">
                  ℹ️ {selectedEmergency.responderName || 'Another responder'} is handling this
                </p>
              </div>
            )}

            {selectedEmergency.status === 'resolved' && (
              <div className="bg-[#1a2a3a] border border-[#4499ff] rounded-xl p-4 mb-4 text-center">
                <p className="text-[#4499ff] text-sm font-semibold">
                  ✅ This emergency has been resolved
                </p>
              </div>
            )}

            <button
              onClick={() => {
                stopSharingLocation();
                setShowChat(false);
                setSelectedEmergency(null);
              }}
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
              {(item as any).count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === item.id ? 'bg-white/20' : 'bg-[#cc0000]'
                } text-white`}>
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
              <h1 className="text-2xl font-black text-white mb-1">
                Welcome, {org?.orgName} 👋
              </h1>
              <p className="text-white/30 text-sm">
                Your organisation code:{' '}
                <span className="text-[#cc0000] font-mono font-bold">{org?.orgCode}</span>
                <span className="text-white/20 ml-2">— Share with your personnel</span>
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Personnel', value: responders.length, sub: `${pendingResponders.length} pending` },
                { label: 'Verified', value: verifiedResponders.length, sub: 'Ready to respond' },
                { label: 'Active Emergencies', value: activeEmergencies.length, sub: 'Right now' },
                { label: 'Our Responses', value: orgResponses.length, sub: 'All time' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                  <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-white/40 text-sm mb-1">{stat.label}</p>
                  <p className="text-white/20 text-xs">{stat.sub}</p>
                </div>
              ))}
            </div>

            {activeEmergencies.length > 0 ? (
              <div className="bg-white/[0.02] border border-[#cc0000]/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#cc0000] rounded-full animate-pulse" />
                    <h2 className="text-white font-bold">
                      Live Emergencies — Action Required
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('emergencies')}
                    className="text-[#cc0000] text-sm hover:underline"
                  >
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
                      <p className="text-white text-sm font-semibold">
                        {em.emergencyEmoji} {em.emergencyType}
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        Victim: {em.userName || 'Unknown'} • {em.peopleAffected || '1'} affected
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        em.status === 'accepted'
                          ? 'bg-[#1a3a1a] text-[#00cc44]'
                          : 'bg-[#3a0000] text-[#cc0000]'
                      }`}>
                        {em.status === 'accepted' ? 'Assigned' : 'Needs response'}
                      </span>
                      <span className="text-white/20 text-lg">›</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 mb-6 text-center">
                <p className="text-white/20 text-sm">No active emergencies right now</p>
                <p className="text-white/10 text-xs mt-1">
                  New emergencies will appear here automatically
                </p>
              </div>
            )}

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold">Your Personnel</h2>
                <button
                  onClick={() => setActiveTab('personnel')}
                  className="text-[#cc0000] text-sm hover:underline"
                >
                  View all →
                </button>
              </div>
              {responders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/20 text-sm mb-2">No personnel yet</p>
                  <p className="text-white/10 text-xs">
                    Share org code{' '}
                    <span className="text-[#cc0000] font-mono">{org?.orgCode}</span>
                  </p>
                </div>
              ) : (
                responders.slice(0, 5).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] rounded-xl px-2 transition"
                    onClick={() => setSelectedStaff(r)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {r.name ? r.name[0] : 'R'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{r.name}</p>
                        <p className="text-white/30 text-xs">{r.responderType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${r.isAvailable ? 'bg-[#00cc44]' : 'bg-[#555]'}`} />
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        r.isVerified
                          ? 'bg-[#1a3a1a] text-[#00cc44]'
                          : 'bg-[#2a1a00] text-[#cc6600]'
                      }`}>
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
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-black text-white mb-2">Live Emergencies</h1>
                <p className="text-white/30 text-sm">
                  Click any emergency to view details, chat, share location, and respond on behalf of{' '}
                  <span className="text-white">{org?.orgName}</span>
                </p>
              </div>
              <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
                <button
                  onClick={() => setEmergencyView('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    emergencyView === 'list' ? 'bg-[#cc0000] text-white' : 'text-white/40'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setEmergencyView('heatmap')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    emergencyView === 'heatmap' ? 'bg-[#cc0000] text-white' : 'text-white/40'
                  }`}
                >
                  🗺️ Heatmap
                </button>
              </div>
            </div>

            <div className="mb-6" />

            {emergencyView === 'heatmap' ? (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div ref={mapRef} style={{ width: '100%', height: '560px' }} />
                <div className="flex items-center justify-center gap-8 p-4 border-t border-white/[0.06]">
                  {[
                    { color: '#ffcc00', label: 'Low activity' },
                    { color: '#ff6600', label: 'Moderate' },
                    { color: '#cc0000', label: 'High activity' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-white/40 text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeEmergencies.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-16 text-center">
                <div className="w-3 h-3 bg-[#cc0000]/30 rounded-full mx-auto mb-4" />
                <p className="text-white/20 text-sm">No active emergencies right now</p>
                <p className="text-white/10 text-xs mt-2">
                  Emergencies will appear here in real time
                </p>
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
                        <h3 className="text-white font-bold text-lg">
                          {em.emergencyEmoji} {em.emergencyType}
                        </h3>
                        <p className="text-white/40 text-sm mt-1">
                          {em.description?.slice(0, 80)}
                        </p>
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
                            : `${em.responderName || 'Responder'} assigned`
                          : 'Tap to respond'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-white/20 text-xs mb-1">Victim</p>
                        <p className="text-white text-sm">{em.userName || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs mb-1">People</p>
                        <p className="text-white text-sm">{em.peopleAffected || '1'}</p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs mb-1">Location</p>
                        <p className="text-white text-xs">
                          {em.location
                            ? `${em.location.latitude?.toFixed(3)}, ${em.location.longitude?.toFixed(3)}`
                            : 'No location'}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs mb-1">Action</p>
                        <p className="text-[#cc0000] text-sm font-semibold">
                          {em.status === 'active' ? 'Respond →' : 'View →'}
                        </p>
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
                        <tr
                          key={r.id}
                          className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] cursor-pointer"
                          onClick={() => setSelectedStaff(r)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {r.name ? r.name[0] : 'R'}
                                </span>
                              </div>
                              <span className="text-white text-sm">{r.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.responderType}</td>
                          <td className="px-6 py-4 text-white/40 text-sm font-mono">{r.staffId || '—'}</td>
                          <td className="px-6 py-4 text-white/40 text-sm">{r.phone}</td>
                          <td className="px-6 py-4">
                            <span className="bg-[#2a1a00] text-[#cc6600] text-xs px-3 py-1 rounded-full">
                              Pending
                            </span>
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
              <h2 className="text-white font-bold mb-4">
                Verified Personnel ({verifiedResponders.length})
              </h2>
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
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-white/20 text-sm">
                          No verified personnel yet
                        </td>
                      </tr>
                    ) : (
                      verifiedResponders.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] cursor-pointer"
                          onClick={() => setSelectedStaff(r)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#cc0000] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {r.name ? r.name[0] : 'R'}
                                </span>
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
                            <span className="bg-[#1a3a1a] text-[#00cc44] text-xs px-3 py-1 rounded-full">
                              Verified
                            </span>
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
            <p className="text-white/30 text-sm mb-8">
              {org?.orgName} response performance
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { title: 'Total Personnel', value: responders.length, sub: 'Registered' },
                { title: 'Verified Responders', value: verifiedResponders.length, sub: 'Active on Siren' },
                { title: 'Currently Available', value: verifiedResponders.filter((r: any) => r.isAvailable).length, sub: 'Online now' },
                { title: 'Our Emergency Responses', value: orgResponses.length, sub: 'All time' },
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
                <h2 className="text-white font-bold mb-4">Personnel Summary</h2>
                {[
                  { label: 'Total Registered', value: responders.length },
                  { label: 'Verified', value: verifiedResponders.length },
                  { label: 'Pending Verification', value: pendingResponders.length },
                  { label: 'Online Now', value: verifiedResponders.filter((r: any) => r.isAvailable).length },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-white/60 text-sm">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">Emergency Summary</h2>
                {[
                  { label: 'Active Right Now', value: activeEmergencies.length },
                  { label: 'We Responded To', value: orgResponses.length },
                  { label: 'Resolved by Us', value: orgResponses.filter((e: any) => e.status === 'resolved').length },
                  { label: 'Total in System', value: allEmergencies.length },
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
                  <span className={`text-sm font-semibold ${
                    item.label === 'Org Code' ? 'text-[#cc0000] font-mono' : 'text-white'
                  }`}>
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