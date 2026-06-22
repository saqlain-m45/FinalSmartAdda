import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaShieldAlt, FaUserCircle, FaMapMarkerAlt, FaClock,
  FaRoute, FaTachometerAlt, FaWhatsapp, FaPhoneAlt, FaShareAlt, FaBusAlt, FaSearch,
} from 'react-icons/fa';
import coachDefault from '../../assets/images/coach_default.jpg';

/* ─── Fix Leaflet icons (Vite) ─────────────────────────────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const busIcon = (r = 0) => L.divIcon({
  className: '',
  html: `<div style="transform:rotate(${r}deg);width:42px;height:42px;display:flex;align-items:center;justify-content:center">
    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0D7C3F,#064e29);
      display:flex;align-items:center;justify-content:center;border:3px solid #fff;
      box-shadow:0 0 0 2px #0D7C3F,0 6px 18px rgba(13,124,63,.55)">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
        <path d="M4 16c0 1.1.9 2 2 2h1v1a1 1 0 002 0v-1h6v1a1 1 0 002 0v-1h1c1.1 0 2-.9 2-2V7c0-3.5-3.6-5-8-5S4 3.5 4 7v9zm2-5h12v4H6v-4zm1.5-5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
      </svg>
    </div></div>`,
  iconSize: [42, 42], iconAnchor: [21, 21],
});

const myIcon = (r = 0) => L.divIcon({
  className: '',
  html: `<div style="transform:rotate(${r}deg);width:42px;height:42px;display:flex;align-items:center;justify-content:center">
    <div id="my-pulse" style="position:absolute;width:48px;height:48px;border-radius:50%;
      background:rgba(59,130,246,.22);animation:myPulse 1.8s ease-out infinite"></div>
    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#1e3a8a);
      display:flex;align-items:center;justify-content:center;border:3px solid #fff;
      box-shadow:0 0 0 2px #3B82F6,0 6px 18px rgba(59,130,246,.55)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style="transform:translateY(-1px)">
        <path d="M12 2L4 21l8-4 8 4L12 2z"/>
      </svg>
    </div></div>`,
  iconSize: [42, 42], iconAnchor: [21, 21],
});

const pinIcon = (color, label) => L.divIcon({
  className: '',
  html: `<div style="background:${color};color:#fff;padding:4px 10px;border-radius:9px;
    font-size:11px;font-weight:800;font-family:Poppins,sans-serif;white-space:nowrap;
    box-shadow:0 4px 12px ${color}66;border:1px solid rgba(255,255,255,.3)">${label}</div>`,
  iconSize: [120, 26], iconAnchor: [60, 26],
});

/* ─── City map ───────────────────────────────────────────────────────────── */
const CITIES = {
  Karachi: [24.8607, 67.0011], Hyderabad: [25.3960, 68.3578], Sukkur: [27.7244, 68.8475],
  'Rahim Yar Khan': [28.4202, 70.2989], Bahawalpur: [29.3956, 71.6836], Multan: [30.1575, 71.5249],
  Sahiwal: [30.6682, 73.1114], Lahore: [31.5204, 74.3587], Rawalpindi: [33.5651, 73.0169],
  Islamabad: [33.6844, 73.0479], Taxila: [33.7463, 72.8253], Wah: [33.7844, 72.7153],
  'Hasan Abdal': [33.8189, 72.6897], Swabi: [34.1202, 72.4691], Nowshera: [34.0158, 71.9812],
  Peshawar: [34.0151, 71.5249], Mardan: [34.1986, 72.0436], Mingora: [34.7717, 72.3602],
  Swat: [34.8065, 72.3610], Abbottabad: [34.1688, 73.2215], Mansehra: [34.3312, 73.1972],
  Besham: [34.8694, 72.8761], Chilas: [35.4128, 74.1042], Gilgit: [35.9187, 74.3125],
  Gwadar: [25.1216, 62.3253], Quetta: [30.1798, 66.9750], Chaman: [30.9167, 66.4500],
  Muzaffarabad: [34.3597, 73.4714], Murree: [33.9070, 73.3943], Faisalabad: [31.4504, 73.1350],
  Hangu: [33.5351, 71.0581], Kohat: [33.5869, 71.4414], Karak: [33.1114, 71.0911],
  Sheikhupura: [31.7131, 73.9783],
};

const SAMPLE_BUSES = [
  { id: 'sample-1', name: 'Grand Cabin Luxury', from: 'Karachi', to: 'Gwadar', time: '08:00 PM', busNumber: 'GDR-101' },
  { id: 'sample-2', name: 'Executive High-Roof', from: 'Islamabad', to: 'Gilgit', time: '03:56 PM', busNumber: 'GLT-442' },
  { id: 'sample-3', name: 'Royal Flycoach', from: 'Peshawar', to: 'Swat', time: '10:30 AM', busNumber: 'SWT-889' },
  { id: 'sample-4', name: 'Sania Hi-Ace', from: 'Multan', to: 'Faisalabad', time: '02:00 PM', busNumber: 'FSD-221' },
  { id: 'sample-5', name: 'Green Line Transit', from: 'Quetta', to: 'Chaman', time: '09:00 AM', busNumber: 'QTA-993' },
  { id: 'sample-6', name: 'Valley Express', from: 'Muzaffarabad', to: 'Rawalpindi', time: '11:15 AM', busNumber: 'AJK-112' },
  { id: 'sample-7', name: 'Kohat Express', from: 'Hangu', to: 'Kohat', time: '08:30 AM', busNumber: 'KHT-083' },
  { id: 'sample-8', name: 'Karak Skyways', from: 'Karak', to: 'Kohat', time: '08:00 PM', busNumber: 'LEX-7808' },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const city = (n) => { if (!n) return null; const k = Object.keys(CITIES).find(c => c.toLowerCase() === n.toLowerCase().trim()); return k ? CITIES[k] : null; };

const distKm = (a, b) => {
  if (!a || !b) return 0;
  const R = 6371, dLat = (b[0] - a[0]) * Math.PI / 180, dLng = (b[1] - a[1]) * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const bearing = (a, b) => {
  if (!a || !b) return 0;
  const r = d => d * Math.PI / 180, dLng = r(b[1] - a[1]), la = r(a[0]), lb = r(b[0]);
  return (Math.atan2(Math.sin(dLng) * Math.cos(lb), Math.cos(la) * Math.sin(lb) - Math.sin(la) * Math.cos(lb) * Math.cos(dLng)) * 180 / Math.PI + 360) % 360;
};

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

const parseTime = (t) => {
  if (!t) return new Date();
  const [hm, mod] = t.trim().split(/\s+/); let [h, m] = hm.split(':').map(Number);
  if (mod === 'PM' && h < 12) h += 12; if (mod === 'AM' && h === 12) h = 0;
  const d = new Date(); d.setHours(h, m, 0, 0); return d;
};

const fmtEta = (mins) => {
  if (!mins || mins <= 0) return 'Arrived';
  if (mins < 60) return `${Math.round(mins)} min`;
  return `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`;
};

/* ─── OSRM Router ────────────────────────────────────────────────────────── */
const getRoute = async (from, to) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]) {
      return {
        pts: data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]),
        dist: data.routes[0].distance / 1000,
        dur: data.routes[0].duration / 60,
      };
    }
  } catch (e) { }
  const n = 30, pts = Array.from({ length: n + 1 }, (_, i) => lerp(from, to, i / n));
  return { pts, dist: distKm(from, to), dur: distKm(from, to) / 65 * 60 };
};

/* ─── Map Event Handlers ─────────────────────────────────────────────────── */
function MapEffects({ followMe, myPos, mapRefCallback }) {
  const map = useMap();

  // Store the map ref
  useEffect(() => {
    mapRefCallback(map);
  }, [map, mapRefCallback]);

  // Handle map dragging (turn off follow-me)
  useMapEvents({
    dragstart: () => {
      // We dispatch a custom event to the parent to update state
      window.dispatchEvent(new Event('map-user-drag'));
    }
  });

  // Handle smooth panning
  const prevPos = useRef(myPos);
  useEffect(() => {
    if (followMe && myPos) {
      const prev = prevPos.current;
      const hasMoved = !prev || Math.abs(prev[0] - myPos[0]) > 0.00001 || Math.abs(prev[1] - myPos[1]) > 0.00001;

      if (hasMoved) {
        map.panTo(myPos, { animate: true, duration: 0.6 });
        if (map.getZoom() < 14) map.setZoom(15, { animate: true });
        prevPos.current = myPos;
      }
    }
  }, [followMe, myPos, map]);

  return null;
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function TrackBus() {
  const { busId: routeBusId } = useParams();
  const { currentUser } = useAuth();

  /* ── State ─────────────────────────────────────────────────────────────── */
  const [activeBusId, setActiveBusId] = useState(routeBusId || 'sample-2');
  const [myBookings, setMyBookings] = useState([]);

  // Live GPS Data
  const [mySpeed, setMySpeed] = useState(0);
  const [myEta, setMyEta] = useState(null);
  const [myProgress, setMyProgress] = useState(0);
  const [myPos, setMyPos] = useState(null);
  const [myRot, setMyRot] = useState(0);
  const [geoOk, setGeoOk] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [arrived, setArrived] = useState(false);
  const [showArrival, setShowArrival] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Routes
  const [busRoute, setBusRoute] = useState([]);
  const [liveRoute, setLiveRoute] = useState([]);

  // Bus Data
  const [busPos, setBusPos] = useState(null);
  const [busRot, setBusRot] = useState(0);
  const [busInfo, setBusInfo] = useState({
    name: 'Select a coach', from: '', to: '', speed: '—', eta: '—',
    nextStop: '—', status: 'Standby', progress: 0, busNumber: '—',
  });

  // UI
  const [followMe, setFollowMe] = useState(true);
  const [searchQ, setSearchQ] = useState('');

  /* ── Refs ──────────────────────────────────────────────────────────────── */
  const mapRef = useRef(null);
  const destRef = useRef(null);
  const startRef = useRef(null);
  const liveTimer = useRef(null);
  const lastPosRef = useRef(null);
  const lastTimeRef = useRef(null);
  const compassActiveRef = useRef(false);

  /* ── Compass Orientation ───────────────────────────────────────────────── */
  useEffect(() => {
    const handleOrientation = (e) => {
      let head = e.webkitCompassHeading;
      if (head === undefined || head === null) {
        // Fallback for Android (absolute)
        if (e.alpha !== null && e.absolute) head = 360 - e.alpha;
      }
      if (head !== undefined && head !== null && !isNaN(head)) {
        compassActiveRef.current = true;
        setMyRot(head);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation);
    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  /* ── Map Controller Callback ───────────────────────────────────────────── */
  const setMapInstance = useCallback((map) => {
    mapRef.current = map;
  }, []);

  /* ── Event Listener for Map Drag ───────────────────────────────────────── */
  useEffect(() => {
    const handleDrag = () => setFollowMe(false);
    window.addEventListener('map-user-drag', handleDrag);
    return () => window.removeEventListener('map-user-drag', handleDrag);
  }, []);

  /* ── Bookings ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'bookings'), where('userId', '==', currentUser.uid));
    return onSnapshot(q, snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMyBookings(data);
    });
  }, [currentUser]);

  /* ── Live Route & Progress Calculation ─────────────────────────────────── */
  const refreshLiveRoute = useCallback((pos) => {
    const dest = destRef.current;
    if (!dest || !pos) return;

    const d = distKm(pos, dest);
    if (d < 0.4) { setArrived(true); setShowArrival(true); setLiveRoute([]); return; }

    const totalDist = startRef.current ? distKm(startRef.current, dest) : 0;
    const coveredDist = startRef.current ? distKm(startRef.current, pos) : 0;
    const prog = totalDist > 0 ? Math.min(Math.round((coveredDist / totalDist) * 100), 99) : 0;
    setMyProgress(prog);

    if (liveTimer.current) clearTimeout(liveTimer.current);
    liveTimer.current = setTimeout(async () => {
      const r = await getRoute(pos, dest);
      setLiveRoute(r.pts);
    }, 500);
  }, []);

  /* ── GPS watchPosition (Core Engine) ───────────────────────────────────── */
  useEffect(() => {
    if (!('geolocation' in navigator)) { setGeoError('GPS not supported'); return; }

    const onPos = (pos) => {
      const coords = [pos.coords.latitude, pos.coords.longitude];

      // Ignore tiny drifts to prevent jitter when resting
      let movedDistance = 0;
      if (lastPosRef.current) {
        movedDistance = distKm(lastPosRef.current, coords);
        const speed = pos.coords.speed || 0;
        // Ignore movements under 12 meters if moving slowly (< 1 m/s)
        if (movedDistance < 0.012 && speed < 1) return;
      }

      // Update rotation (only if compass isn't providing data)
      if (!compassActiveRef.current) {
        if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) {
          setMyRot(pos.coords.heading);
        } else if (lastPosRef.current && movedDistance > 0.005) {
          setMyRot(bearing(lastPosRef.current, coords));
        }
      }

      // Update state so React knows where we are
      setGeoOk(true);
      setGeoError(null);
      setMyPos(coords);

      // Speed calculation
      const now = Date.now();
      if (lastPosRef.current && lastTimeRef.current) {
        const dt = (now - lastTimeRef.current) / 3600000;
        const dist = distKm(lastPosRef.current, coords);
        if (dt > 0 && dist > 0) {
          const spd = dist / dt;
          if (spd < 250) setMySpeed(prev => Math.round(prev * 0.4 + spd * 0.6));
        }
      }
      lastPosRef.current = coords;
      lastTimeRef.current = now;

      // Update ETA
      setMyEta(prev => {
        const d = distRef.current;
        const spd = mySpeedRef.current;
        return (spd > 0.5 && d) ? (d / spd) * 60 : prev;
      });

      refreshLiveRoute(coords);
    };

    const onErr = (err) => {
      console.warn('[GPS]', err.code, err.message);
      const msgs = { 1: 'Location denied', 2: 'Cannot get GPS', 3: 'GPS timeout' };
      setGeoError(msgs[err.code] || err.message);
    };

    const id = navigator.geolocation.watchPosition(onPos, onErr, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000,
    });

    return () => {
      navigator.geolocation.clearWatch(id);
      if (liveTimer.current) clearTimeout(liveTimer.current);
    };
  }, [refreshLiveRoute, retryKey]);

  // Keep refs for closure use
  const distRef = useRef(0);
  const mySpeedRef = useRef(0);
  useEffect(() => { mySpeedRef.current = mySpeed; }, [mySpeed]);
  useEffect(() => { if (myPos && destRef.current) distRef.current = distKm(myPos, destRef.current); }, [myPos]);

  /* ── Bus Selection & OSRM Routing ──────────────────────────────────────── */
  useEffect(() => {
    if (!activeBusId) return;

    let fromName, toName;
    const isSample = activeBusId.startsWith('sample-');

    if (isSample) {
      const s = SAMPLE_BUSES.find(b => b.id === activeBusId);
      fromName = s?.from; toName = s?.to;
    } else {
      fromName = busInfo.from; toName = busInfo.to;
    }

    const fromC = city(fromName);
    const toC = city(toName);
    if (!fromC || !toC) return;

    startRef.current = fromC;
    destRef.current = toC;
    setBusRoute([]); setLiveRoute([]); setArrived(false); setShowArrival(false); setMyProgress(0); setMyEta(null);

    getRoute(fromC, toC).then(r => setBusRoute(r.pts));
    if (lastPosRef.current) refreshLiveRoute(lastPosRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusId]);

  /* ── Bus Simulation Tick ───────────────────────────────────────────────── */
  useEffect(() => {
    let interval;
    if (!activeBusId) return;

    if (!activeBusId.startsWith('sample-')) {
      const unsub = onSnapshot(doc(db, 'buses', activeBusId), snap => {
        if (!snap.exists()) return;
        const d = snap.data();
        const fromC = city(d.from) || [33.6844, 73.0479];
        const toC = city(d.to) || [35.9187, 74.3125];
        const pos = d.currentLocation ? [d.currentLocation.lat, d.currentLocation.lng] : fromC;

        startRef.current = fromC;
        destRef.current = toC;
        setBusPos(pos);

        const total = distKm(fromC, toC);
        const covered = distKm(fromC, pos);
        setBusInfo({
          name: d.name || '—', from: d.from || '—', to: d.to || '—',
          speed: d.currentSpeed ? d.currentSpeed : '0 km/h',
          eta: d.eta || '—', nextStop: d.nextStop || '—',
          status: d.status === 'on-track' ? 'En Route' : 'Standby',
          progress: total > 0 ? Math.min(Math.round(covered / total * 100), 100) : 0,
          busNumber: d.busNumber || '—',
        });
      });
      return () => unsub();
    }

    const s = SAMPLE_BUSES.find(b => b.id === activeBusId) || SAMPLE_BUSES[1];
    const fromC = city(s.from) || [31.5204, 74.3587];
    const toC = city(s.to) || [35.9187, 74.3125];
    startRef.current = fromC;
    destRef.current = toC;

    const totalDistKm = distKm(fromC, toC);
    const avgSpd = ['Gilgit', 'Swat', 'Muzaffarabad', 'Chitral'].includes(s.to) ? 45 : 62;
    const journeyMs = Math.max((totalDistKm / avgSpd) * 3600000, 600000);
    const schedStart = parseTime(s.time).getTime();

    const tick = () => {
      const now = Date.now();
      let p = 0, speed = 0, etaMins = 0, status = 'Standby';

      if (now >= schedStart + journeyMs) {
        p = 1; status = 'Arrived'; speed = 0; etaMins = 0;
      } else if (now >= schedStart) {
        p = Math.min((now - schedStart) / journeyMs, 1);
        status = 'En Route';
        speed = Math.round(avgSpd - 3 + Math.sin(p * Math.PI * 5) * 6);
        etaMins = Math.round(journeyMs * (1 - p) / 60000);
      } else {
        etaMins = Math.round((schedStart - now + journeyMs) / 60000);
      }

      const path = busRouteRef.current;
      const pts = path?.length > 1 ? path : [fromC, toC];
      const raw = p * (pts.length - 1);
      const idx = Math.min(Math.floor(raw), pts.length - 2);
      const pos = lerp(pts[idx], pts[idx + 1], raw - idx);

      setBusPos(pos);
      setBusRot(bearing(pts[idx], pts[idx + 1]));
      setBusInfo({
        name: s.name, from: s.from, to: s.to,
        speed: speed > 0 ? `${speed} km/h` : '0 km/h',
        eta: fmtEta(etaMins),
        nextStop: p < 0.5 ? 'Mid-way Stop' : 'Final Destination',
        status, progress: Math.round(p * 100), busNumber: s.busNumber,
      });
    };

    tick();
    interval = setInterval(tick, 1000); // 1s tick is smooth enough with CSS transitions
    return () => clearInterval(interval);
  }, [activeBusId]);

  // Keep route ref fresh for interval closure
  const busRouteRef = useRef([]);
  useEffect(() => { busRouteRef.current = busRoute; }, [busRoute]);

  /* ── Actions ──────────────────────────────────────────────────────────── */
  const enableLocation = () => {
    // iOS 13+ Compass Permission
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }

    // Re-trigger the watchPosition hook
    setGeoError(null);
    setRetryKey(k => k + 1);

    // Also explicitly request a single fresh position to update immediately
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const c = [pos.coords.latitude, pos.coords.longitude];
        setMyPos(c); setGeoOk(true); setFollowMe(true);
        if (mapRef.current) {
          mapRef.current.panTo(c, { animate: true });
          if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(15);
        }
        refreshLiveRoute(c);
      },
      err => setGeoError(err.message),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const recenterMe = () => {
    if (myPos && mapRef.current) {
      setFollowMe(true);
      mapRef.current.panTo(myPos, { animate: true, duration: 0.6 });
      if (mapRef.current.getZoom() < 14) mapRef.current.setZoom(15);
    } else enableLocation();
  };

  const recenterBus = () => {
    if (busPos && mapRef.current) {
      setFollowMe(false);
      mapRef.current.setView(busPos, 13, { animate: true });
    }
  };

  /* ── Derived display ─────────────────────────────────────────────────── */
  const startCoord = busInfo.from ? city(busInfo.from) : null;
  const endCoord = busInfo.to ? city(busInfo.to) : null;

  const displaySpeed = mySpeed > 0.3 ? `${mySpeed.toFixed(1)} km/h` : (geoOk ? '0 km/h' : '—');
  const displayEta = myEta != null ? fmtEta(myEta) : (geoOk && endCoord && myPos ? fmtEta(distKm(myPos, endCoord) / (mySpeed || 5) * 60) : '—');

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 20px', animation: 'fadeIn .4s ease' }}>
      <style>{`
        @keyframes myPulse{0%{transform:scale(.4);opacity:.9}70%{transform:scale(2.2);opacity:0}100%{transform:scale(.4);opacity:0}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .leaflet-container{font-family:Poppins,sans-serif!important;border-radius:24px}
        .leaflet-control-zoom{border-radius:12px!important;border:none!important;box-shadow:0 4px 14px rgba(0,0,0,.13)!important;overflow:hidden}
        .leaflet-control-zoom a{width:36px!important;height:36px!important;line-height:36px!important;font-size:17px!important;color:#334155!important}
        .leaflet-popup-content-wrapper{border-radius:14px!important;box-shadow:0 8px 22px rgba(0,0,0,.13)!important;font-family:Poppins,sans-serif!important}
        .leaflet-tooltip{border-radius:8px!important;font-family:Poppins,sans-serif!important;font-weight:700;font-size:11px;border:none!important;box-shadow:0 3px 10px rgba(0,0,0,.12)!important}
        
        /* Smooth marker transitions */
        .leaflet-marker-icon, .leaflet-marker-shadow {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 27, fontWeight: 800, margin: '0 0 3px' }}>Live Tracker</h1>
          <p style={{ color: 'var(--grey)', fontWeight: 500, fontSize: 13, margin: 0 }}>Real-time GPS coach monitoring</p>
        </div>
        <select value={activeBusId} onChange={e => setActiveBusId(e.target.value)}
          style={{ height: 44, padding: '0 16px', borderRadius: 13, border: '2px solid var(--primary)', fontWeight: 600, background: 'white', fontSize: 13, fontFamily: 'Poppins,sans-serif', maxWidth: 320 }}>
          <option value="" disabled>Select a Coach</option>
          {SAMPLE_BUSES.map(b => <option key={b.id} value={b.id}>🚌 {b.name} ({b.from} → {b.to})</option>)}
          {myBookings.map(b => <option key={b.id} value={b.busId || b.id}>🎫 {b.busName}</option>)}
        </select>
      </div>

      <div className="track-bus-grid">

        {/* ══ MAP ══════════════════════════════════════════════════════════ */}
        <div style={{ borderRadius: 24, overflow: 'hidden', height: 620, position: 'relative', boxShadow: '0 14px 44px rgba(0,0,0,.17)' }}>

          <MapContainer
            center={myPos || startCoord || [33.6844, 73.0479]}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            zoomControl
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              maxZoom={19}
            />

            <MapEffects followMe={followMe} myPos={myPos} mapRefCallback={setMapInstance} />

            {/* Bus full route — grey dashed */}
            {busRoute.length > 1 && <Polyline positions={busRoute} pathOptions={{ color: '#94A3B8', weight: 5, opacity: .5, dashArray: '9 6' }} />}

            {/* Traveled bus route — green */}
            {busRoute.length > 1 && busInfo.progress > 0 && (
              <Polyline positions={busRoute.slice(0, Math.max(2, Math.floor(busInfo.progress / 100 * busRoute.length)))}
                pathOptions={{ color: '#0D7C3F', weight: 6, opacity: 1 }} />
            )}

            {/* MY live route — blue road line */}
            {liveRoute.length > 1 && <Polyline positions={liveRoute} pathOptions={{ color: '#3B82F6', weight: 5, opacity: .95 }} />}

            {/* Start pin */}
            {startCoord && (
              <Marker position={startCoord} icon={pinIcon('#0D7C3F', '🏁 ' + busInfo.from)}>
                <Tooltip permanent direction="top" offset={[0, -4]}>{busInfo.from}</Tooltip>
              </Marker>
            )}

            {/* Destination pin */}
            {endCoord && (
              <Marker position={endCoord} icon={pinIcon('#EF4444', '📍 ' + busInfo.to)}>
                <Tooltip permanent direction="top" offset={[0, -4]}>{busInfo.to}</Tooltip>
                <Popup>
                  <div style={{ textAlign: 'center', fontWeight: 700 }}>
                    <p style={{ margin: '0 0 4px', fontSize: 14 }}>📍 {busInfo.to}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                      {myPos ? `${distKm(myPos, endCoord).toFixed(1)} km away` : 'Destination'}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Bus marker */}
            {busPos && (
              <Marker position={busPos} icon={busIcon(busRot)}>
                <Popup>
                  <div style={{ fontWeight: 700 }}>
                    🚌 {busInfo.name}<br />
                    <span style={{ fontSize: 12, color: '#64748b' }}>{busInfo.from} → {busInfo.to}</span><br />
                    <span style={{ color: '#0D7C3F' }}>{busInfo.speed}</span> · {busInfo.status}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* My location arrow */}
            {myPos && (
              <Marker position={myPos} icon={myIcon(myRot)} zIndexOffset={1000}>
                <Popup>
                  <div style={{ textAlign: 'center', fontWeight: 700 }}>
                    📍 Your Location<br />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{myPos[0].toFixed(5)}, {myPos[1].toFixed(5)}</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {myPos && <Circle center={myPos} radius={60} pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: .1, weight: 1 }} />}
          </MapContainer>

          {/* GPS error banner */}
          {geoError && (
            <div style={{
              position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
              background: 'rgba(255,255,255,.97)', padding: '9px 16px', borderRadius: 14,
              boxShadow: '0 5px 18px rgba(0,0,0,.13)', fontSize: 13, fontWeight: 700, color: '#334155',
              display: 'flex', gap: 10, alignItems: 'center', whiteSpace: 'nowrap'
            }}>
              <span>📍 {geoError.slice(0, 55)}</span>
              <button onClick={enableLocation} style={{
                background: 'var(--primary)', color: 'white', border: 'none',
                padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 800, fontSize: 12
              }}>
                Allow
              </button>
            </div>
          )}

          {/* Follow-me pill */}
          {geoOk && !geoError && (
            <div style={{
              position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 999,
              display: 'flex', alignItems: 'center', gap: 7,
              background: followMe ? 'rgba(59,130,246,.95)' : 'rgba(255,255,255,.95)',
              color: followMe ? 'white' : '#334155', padding: '6px 16px', borderRadius: 20,
              boxShadow: '0 4px 14px rgba(0,0,0,.12)', fontSize: 12, fontWeight: 700,
              backdropFilter: 'blur(8px)', pointerEvents: 'none', whiteSpace: 'nowrap'
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: followMe ? 'white' : '#3B82F6', display: 'inline-block'
              }} />
              {followMe ? '📍 Following your live location' : '🔓 Tap ⊕ to re-follow'}
            </div>
          )}

          {/* Arrival popup */}
          {showArrival && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              zIndex: 2000, background: 'white', borderRadius: 22, padding: '30px 34px', textAlign: 'center',
              boxShadow: '0 20px 55px rgba(0,0,0,.22)', animation: 'fadeIn .4s ease'
            }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>🎉</div>
              <h2 style={{ margin: '0 0 7px', fontSize: 21, fontWeight: 800, color: '#0D7C3F' }}>You've Arrived!</h2>
              <p style={{ margin: '0 0 18px', color: '#64748b', fontSize: 14, fontWeight: 600 }}>Welcome to <strong>{busInfo.to}</strong></p>
              <button onClick={() => setShowArrival(false)} style={{
                background: 'var(--primary)', color: 'white',
                border: 'none', padding: '11px 26px', borderRadius: 13, fontWeight: 800, fontSize: 14, cursor: 'pointer'
              }}>
                Close
              </button>
            </div>
          )}

          {/* Search */}
          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 998 }}>
            <form onSubmit={e => { e.preventDefault(); const c = city(searchQ); if (c && mapRef.current) { setFollowMe(false); mapRef.current.setView(c, 13, { animate: true }); } else alert('City not found'); }} style={{
              display: 'flex', background: 'white', borderRadius: 11,
              padding: '3px 5px', boxShadow: '0 4px 14px rgba(0,0,0,.11)', border: '1px solid #eee'
            }}>
              <input type="text" placeholder="Find City..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                style={{ border: 'none', padding: '6px 9px', fontSize: 13, fontWeight: 600, width: 118, outline: 'none', fontFamily: 'Poppins,sans-serif' }} />
              <button type="submit" style={{
                background: 'var(--primary)', color: 'white', border: 'none',
                borderRadius: 8, padding: '6px 10px', cursor: 'pointer'
              }}>
                <FaSearch size={12} />
              </button>
            </form>
          </div>

          {/* FAB buttons */}
          <div style={{ position: 'absolute', bottom: 22, right: 14, zIndex: 998, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Follow me */}
            <button onClick={recenterMe} title="Follow my location"
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: followMe ? '#3B82F6' : 'white',
                border: followMe ? '3px solid rgba(59,130,246,.45)' : '2px solid #E2E8F0',
                boxShadow: followMe ? '0 0 0 5px rgba(59,130,246,.18),0 8px 22px rgba(59,130,246,.4)' : '0 5px 16px rgba(0,0,0,.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all .3s ease', color: followMe ? 'white' : '#3B82F6'
              }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" fill={followMe ? 'white' : '#3B82F6'} stroke="none" />
                <circle cx="12" cy="12" r="7" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
              </svg>
            </button>
            {/* Jump to bus */}
            <button onClick={recenterBus} title="Go to bus"
              style={{
                width: 43, height: 43, borderRadius: '50%', background: 'white', border: '2px solid #E2E8F0',
                boxShadow: '0 4px 13px rgba(0,0,0,.1)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', color: '#0D7C3F', alignSelf: 'center'
              }}>
              <FaBusAlt size={15} />
            </button>
          </div>

          {/* Overlay bus info */}
          <div style={{
            position: 'absolute', top: 14, left: 14, zIndex: 998,
            background: 'rgba(10,15,29,.92)', backdropFilter: 'blur(16px)',
            color: 'white', borderRadius: 17, padding: '14px 17px', width: 234,
            border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 10px 26px rgba(0,0,0,.28)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <div style={{ width: 33, height: 33, borderRadius: 9, overflow: 'hidden', flexShrink: 0 }}>
                <img src={coachDefault} alt="Coach" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 8, opacity: .4, letterSpacing: 1 }}>TRACKING</p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 11.5 }}>{busInfo.name}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {[
                { l: 'ROUTE', v: busInfo.from && busInfo.to ? `${busInfo.from} → ${busInfo.to}` : '—' },
                { l: 'SPEED', v: busInfo.speed, gold: true },
                { l: 'STATUS', v: busInfo.status },
                { l: 'BUS NO.', v: busInfo.busNumber },
              ].map(({ l, v, gold }) => (
                <div key={l}>
                  <p style={{ margin: '0 0 1px', fontSize: 7.5, opacity: .4, letterSpacing: 1 }}>{l}</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 10.5, color: gold ? '#F4C430' : 'white' }}>{v || '—'}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 3.5, background: 'rgba(255,255,255,.1)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${busInfo.progress || 0}%`, background: 'linear-gradient(90deg,#0D7C3F,#F4C430)', borderRadius: 4, transition: 'width .6s ease' }} />
              </div>
              <p style={{ margin: '3px 0 0', fontSize: 8.5, opacity: .45, textAlign: 'right' }}>{busInfo.progress || 0}% complete</p>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* MY Journey Progress (based on MY live GPS) */}
          <div style={{ background: 'linear-gradient(135deg,#0D7C3F,#085C2D)', borderRadius: 22, padding: '22px', color: 'white', boxShadow: '0 10px 26px rgba(13,124,63,.28)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>My Journey</h3>
              <span style={{ padding: '4px 11px', background: 'rgba(255,255,255,.15)', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                {arrived ? '✅ Arrived' : geoOk ? '🟢 Live GPS' : '⏳ Waiting GPS'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 18 }}>
              {/* Speed — REAL from GPS */}
              <div style={{ padding: '12px', background: 'rgba(255,255,255,.12)', borderRadius: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, fontSize: 10, opacity: .7 }}>
                  <FaTachometerAlt /> MY SPEED
                </div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#F4C430' }}>{displaySpeed}</p>
              </div>
              {/* ETA — real distance / real speed */}
              <div style={{ padding: '12px', background: 'rgba(255,255,255,.12)', borderRadius: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, fontSize: 10, opacity: .7 }}>
                  <FaClock /> ETA TO DEST
                </div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>{displayEta}</p>
              </div>
              {/* Distance to destination */}
              <div style={{ padding: '12px', background: 'rgba(255,255,255,.12)', borderRadius: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, fontSize: 10, opacity: .7 }}>
                  <FaRoute /> DISTANCE
                </div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>
                  {myPos && endCoord ? `${distKm(myPos, endCoord).toFixed(1)} km` : '—'}
                </p>
              </div>
              {/* Destination */}
              <div style={{ padding: '12px', background: 'rgba(255,255,255,.12)', borderRadius: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, fontSize: 10, opacity: .7 }}>
                  <FaMapMarkerAlt /> DESTINATION
                </div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 14 }}>{busInfo.to || '—'}</p>
              </div>
            </div>

            {/* My progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11, fontWeight: 700 }}>
                <span style={{ opacity: .8 }}>{busInfo.from || 'Start'}</span>
                <span style={{ opacity: .8 }}>{busInfo.to || 'Destination'}</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,.2)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${myProgress}%`, background: 'linear-gradient(90deg,#F4C430,#fff)',
                  borderRadius: 8, transition: 'width .6s ease', position: 'relative'
                }}>
                  {myProgress > 0 && <div style={{
                    position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)',
                    width: 14, height: 14, background: 'white', borderRadius: '50%', boxShadow: '0 2px 7px rgba(0,0,0,.22)'
                  }} />}
                </div>
              </div>
              <p style={{ textAlign: 'center', marginTop: 6, fontSize: 11, fontWeight: 700, opacity: .75 }}>
                {myProgress}% of your journey completed
              </p>
            </div>
          </div>

          {/* My GPS Location card */}
          <div style={{ background: 'white', borderRadius: 18, padding: '18px 20px', boxShadow: '0 4px 14px rgba(0,0,0,.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 13px', fontSize: 14, fontWeight: 800 }}>📡 My Live Location</h3>
            {myPos ? (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 11 }}>
                  <div style={{ flex: 1, background: '#EFF6FF', borderRadius: 10, padding: '9px 12px' }}>
                    <p style={{ margin: 0, fontSize: 9, color: '#64748b', fontWeight: 700 }}>LATITUDE</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e40af' }}>{myPos[0].toFixed(5)}</p>
                  </div>
                  <div style={{ flex: 1, background: '#EFF6FF', borderRadius: 10, padding: '9px 12px' }}>
                    <p style={{ margin: 0, fontSize: 9, color: '#64748b', fontWeight: 700 }}>LONGITUDE</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1e40af' }}>{myPos[1].toFixed(5)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#0D7C3F', background: '#F0FDF4', padding: '4px 11px', borderRadius: 20 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0D7C3F', display: 'inline-block' }} /> GPS Active
                  </span>
                  {liveRoute.length > 1 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#3B82F6', background: '#EFF6FF', padding: '4px 11px', borderRadius: 20 }}>
                      🗺 Route Ready
                    </span>
                  )}
                  {arrived && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#DC2626', background: '#FEF2F2', padding: '4px 11px', borderRadius: 20 }}>
                      🎉 Arrived!
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <p style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                  {geoError ? '⚠️ ' + geoError.slice(0, 55) : '⏳ Waiting for GPS signal…'}
                </p>
                <button onClick={enableLocation}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 11, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  📍 Enable Location
                </button>
              </div>
            )}
          </div>

          {/* Bus status (coach being tracked) */}
          <div style={{ background: 'white', borderRadius: 18, padding: '18px 20px', boxShadow: '0 4px 14px rgba(0,0,0,.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 13px', fontSize: 14, fontWeight: 800 }}>🚌 Coach Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { l: 'Coach Speed', v: busInfo.speed },
                { l: 'Coach ETA', v: busInfo.eta },
                { l: 'Next Stop', v: busInfo.nextStop },
                { l: 'Status', v: busInfo.status },
              ].map(({ l, v }) => (
                <div key={l} style={{ background: '#F8FAFC', borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ margin: 0, fontSize: 9, color: '#94a3b8', fontWeight: 700, marginBottom: 3 }}>{l.toUpperCase()}</p>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: '#1e293b' }}>{v || '—'}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 6, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${busInfo.progress || 0}%`, background: 'linear-gradient(90deg,#0D7C3F,#22c55e)', borderRadius: 6, transition: 'width .6s ease' }} />
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 10, color: '#94a3b8', textAlign: 'right' }}>{busInfo.progress || 0}% complete</p>
            </div>
          </div>

          {/* Journey Crew */}
          <div style={{ background: 'white', borderRadius: 18, padding: '18px 20px', boxShadow: '0 4px 14px rgba(0,0,0,.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800 }}>Journey Crew</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <FaUserCircle size={27} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 13 }}>Captain {busInfo.name?.split(' ')[0]}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--grey)', fontWeight: 600 }}>Verified Driver ✓</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 11 }}>
              <a href={`https://wa.me/923001234567?text=Tracking bus ${busInfo.busNumber}, route ${busInfo.from} to ${busInfo.to}`}
                target="_blank" rel="noreferrer"
                style={{ textDecoration: 'none', background: '#25D366', color: 'white', padding: '10px', borderRadius: 11, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <FaWhatsapp size={13} /> WhatsApp
              </a>
              <a href="tel:+923001234567"
                style={{ textDecoration: 'none', background: 'var(--dark)', color: 'white', padding: '10px', borderRadius: 11, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <FaPhoneAlt size={12} /> Call
              </a>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Copied!'); }}
              style={{ width: '100%', background: '#F8FAFC', color: 'var(--dark)', border: '1px solid #E2E8F0', padding: '10px', borderRadius: 11, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 11, cursor: 'pointer' }}>
              <FaShareAlt size={11} /> Share Tracking Link
            </button>
            <div style={{ padding: '10px 12px', background: '#FEF2F2', borderRadius: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#DC2626', fontWeight: 800, fontSize: 12, marginBottom: 3 }}>
                <FaShieldAlt size={12} /> EMERGENCY?
              </div>
              <p style={{ margin: 0, fontSize: 11, color: '#991B1B', fontWeight: 500, lineHeight: 1.4 }}>Tap below for immediate help.</p>
              <button style={{ marginTop: 8, width: '100%', background: '#DC2626', color: 'white', border: 'none', padding: '7px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
                REPORT CONCERN
              </button>
            </div>
          </div>

          {/* My bookings */}
          {myBookings.length > 0 && (
            <div style={{ background: 'white', borderRadius: 18, padding: '16px 18px', boxShadow: '0 4px 14px rgba(0,0,0,.06)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 11px', fontSize: 13, fontWeight: 800 }}>My Booked Trips</h3>
              {myBookings.map(b => (
                <div key={b.id} onClick={() => setActiveBusId(b.busId || b.id)}
                  style={{
                    padding: '10px 12px', borderRadius: 11, cursor: 'pointer',
                    background: activeBusId === (b.busId || b.id) ? 'var(--primary)' : '#F9FAFB',
                    color: activeBusId === (b.busId || b.id) ? 'white' : 'var(--dark)',
                    marginBottom: 7, transition: 'all .2s ease',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 12 }}>{b.busName}</p>
                    <p style={{ margin: 0, fontSize: 10, opacity: .7 }}>{b.from} → {b.to}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', background: 'rgba(255,255,255,.2)', borderRadius: 9 }}>
                    {b.seats?.join(',')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
