import React, { useEffect, useRef, useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { 
  Truck, MapPin, Warehouse, CheckCircle2, Navigation, 
  Clock, ShieldCheck, Phone, Copy, Check, Play, Pause, 
  RotateCcw, Compass, ExternalLink, Zap
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface OrderTrackingMapProps {
  order: Order;
  className?: string;
  height?: string;
  expanded?: boolean;
}

// Known coordinates for Indian fulfillment & delivery cities
const CITY_COORDINATES: Record<string, [number, number]> = {
  'mumbai': [19.0760, 72.8777],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'hyderabad': [17.3850, 78.4867],
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'noida': [28.5355, 77.3910],
  'gurgaon': [28.4595, 77.0266],
  'gurugram': [28.4595, 77.0266],
  'pune': [18.5204, 73.8567],
  'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639],
  'ahmedabad': [23.0225, 72.5714],
  'jaipur': [26.9124, 75.7873],
  'kochi': [9.9312, 76.2673],
  'cochin': [9.9312, 76.2673],
  'lucknow': [26.8467, 80.9462],
  'chandigarh': [30.7333, 76.7794],
  'indore': [22.7196, 75.8577],
  'surat': [21.1702, 72.8311],
  'nagpur': [21.1458, 79.0882],
  'visakhapatnam': [17.6868, 83.2185]
};

function getCityCoords(cityName?: string, defaultCoords: [number, number] = [12.9716, 77.5946]): [number, number] {
  if (!cityName) return defaultCoords;
  const key = cityName.toLowerCase().trim();
  if (CITY_COORDINATES[key]) return CITY_COORDINATES[key];
  for (const k of Object.keys(CITY_COORDINATES)) {
    if (key.includes(k) || k.includes(key)) {
      return CITY_COORDINATES[k];
    }
  }
  // Deterministic offset based on city name hash around Bangalore/Central India
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) hash = (hash << 5) - hash + cityName.charCodeAt(i);
  const latOffset = ((Math.abs(hash) % 100) - 50) / 25;
  const lngOffset = ((Math.abs(hash >> 2) % 100) - 50) / 25;
  return [15.5 + latOffset, 76.5 + lngOffset];
}

export const OrderTrackingMap: React.FC<OrderTrackingMapProps> = ({
  order,
  className = '',
  height = '380px'
}) => {
  const { success } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const vehicleMarkerRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [copiedAwb, setCopiedAwb] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(() => {
    switch (order.status) {
      case 'Confirmed': return 0.05;
      case 'Processing': return 0.20;
      case 'Shipped': return 0.65;
      case 'Delivered': return 1.0;
      default: return 0.5;
    }
  });

  const awbNumber = `BLC-${order.orderId.replace(/[^0-9]/g, '') || '9823'}-${order.shippingMethod === 'express' ? 'EXP' : 'STD'}`;
  const courierPartner = order.shippingMethod === 'express' ? 'BlueCart Priority Air Logistics' : 'BlueCart Ground Express';
  const driverName = 'Suresh Patil (Verified Courier Pilot)';
  const driverPhone = '+91 98765 43210';
  const vehicleModel = 'Tata Ace EV #KA-04-EQ-8812';

  // Compute Origin (Vendor hub) & Destination (Customer delivery address)
  const destCoords = getCityCoords(order.shippingAddress.city, [12.9716, 77.5946]);
  // Origin Hub from vendor or central hub
  const originCity = order.shippingAddress.city?.toLowerCase().includes('mumbai') ? 'Bengaluru' : 'Mumbai';
  const originCoords = getCityCoords(originCity, [19.0760, 72.8777]);

  // Intermediate Checkpoint Hubs
  const midLat1 = originCoords[0] + (destCoords[0] - originCoords[0]) * 0.35 + 0.15;
  const midLng1 = originCoords[1] + (destCoords[1] - originCoords[1]) * 0.35 - 0.12;

  const midLat2 = originCoords[0] + (destCoords[0] - originCoords[0]) * 0.75 - 0.08;
  const midLng2 = originCoords[1] + (destCoords[1] - originCoords[1]) * 0.75 + 0.05;

  const routePoints: [number, number][] = [
    originCoords,
    [midLat1, midLng1],
    [midLat2, midLng2],
    destCoords
  ];

  // Interpolate position along polyline based on progress (0 to 1)
  const getInterpolatedPosition = (progress: number): [number, number] => {
    if (progress <= 0) return routePoints[0];
    if (progress >= 1) return routePoints[routePoints.length - 1];

    const segmentCount = routePoints.length - 1;
    const scaled = progress * segmentCount;
    const segIndex = Math.min(Math.floor(scaled), segmentCount - 1);
    const subProgress = scaled - segIndex;

    const p1 = routePoints[segIndex];
    const p2 = routePoints[segIndex + 1];

    return [
      p1[0] + (p2[0] - p1[0]) * subProgress,
      p1[1] + (p2[1] - p1[1]) * subProgress
    ];
  };

  const currentVehiclePosition = getInterpolatedPosition(simulationProgress);

  // Initialize Leaflet Map
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch {}
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: currentVehiclePosition,
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });
      mapInstanceRef.current = map;

      // Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Route Polyline
      const polyline = L.polyline(routePoints, {
        color: '#2563EB',
        weight: 4,
        opacity: 0.85,
        dashArray: order.status === 'Shipped' ? '8, 8' : undefined
      }).addTo(map);

      // 1. Origin Marker
      const originIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background:#0F172A; color:#FFFFFF; padding:6px 10px; border-radius:8px; font-weight:700; font-size:11px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.2); display:flex; align-items:center; gap:5px; border:2px solid #38BDF8; white-space:nowrap;">
            <span>🏢 Hub: ${originCity}</span>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 16]
      });
      L.marker(originCoords, { icon: originIcon })
        .addTo(map)
        .bindPopup(`<strong>Fulfillment Warehouse</strong><br/>${originCity} Sorting Hub`);

      // 2. Intermediate Waypoint Marker 1
      const way1Icon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="width:12px; height:12px; border-radius:50%; background:#3B82F6; border:2px solid white; box-shadow:0 0 0 2px #3B82F6;"></div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      L.marker([midLat1, midLng1], { icon: way1Icon })
        .addTo(map)
        .bindPopup('<strong>Air Cargo Sorting Terminal</strong><br/>Departed on route');

      // 3. Destination Marker
      const destIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="background:#059669; color:#FFFFFF; padding:6px 10px; border-radius:8px; font-weight:700; font-size:11px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.2); display:flex; align-items:center; gap:5px; border:2px solid #34D399; white-space:nowrap;">
            <span>📍 ${order.shippingAddress.city || 'Delivery Address'}</span>
          </div>
        `,
        iconSize: [130, 32],
        iconAnchor: [65, 16]
      });
      L.marker(destCoords, { icon: destIcon })
        .addTo(map)
        .bindPopup(`<strong>Customer Destination</strong><br/>${order.shippingAddress.street || ''}, ${order.shippingAddress.city}`);

      // 4. Delivery Vehicle Marker
      const vehicleIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="position:relative; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:44px; height:44px; border-radius:50%; background:rgba(37, 99, 235, 0.25); animation:pulse 2s infinite;"></div>
            <div style="width:34px; height:34px; border-radius:50%; background:#2563EB; border:3px solid #FFFFFF; box-shadow:0 4px 10px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:#FFFFFF;">
              🚚
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const vehicleMarker = L.marker(currentVehiclePosition, { icon: vehicleIcon })
        .addTo(map)
        .bindPopup(`<strong>${courierPartner}</strong><br/>Pilot: ${driverName}<br/>Status: In Active Delivery`);
      vehicleMarkerRef.current = vehicleMarker;

      // Fit map to bounds
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    } catch (e) {
      console.warn('Leaflet initialization fallback:', e);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, [order.orderId]);

  // Update vehicle marker on simulation progress changes
  useEffect(() => {
    if (vehicleMarkerRef.current) {
      const pos = getInterpolatedPosition(simulationProgress);
      vehicleMarkerRef.current.setLatLng(pos);
    }
  }, [simulationProgress]);

  // Live Simulation Animation Loop
  useEffect(() => {
    if (!isSimulating) return;

    let start = performance.now();
    const duration = 12000; // 12 seconds full trip loop

    const tick = (now: number) => {
      const elapsed = (now - start) % duration;
      const prog = elapsed / duration;
      setSimulationProgress(prog);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSimulating]);

  const handleCopyAwb = () => {
    navigator.clipboard?.writeText(awbNumber);
    setCopiedAwb(true);
    success(`AWB tracking number ${awbNumber} copied to clipboard!`);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const pos = getInterpolatedPosition(simulationProgress);
      mapInstanceRef.current.flyTo(pos, 10, { duration: 1.2 });
    }
  };

  return (
    <div className={`flex flex-col bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-700 shadow-xl ${className}`}>
      {/* Top Telemetry Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">{courierPartner}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                LIVE GPS
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-400 font-mono">AWB: {awbNumber}</span>
              <button
                onClick={handleCopyAwb}
                className="text-slate-400 hover:text-white transition-colors"
                title="Copy AWB Tracking Number"
              >
                {copiedAwb ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Simulation & Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isSimulating 
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Transit Sim
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" /> Simulate Live Transit
              </>
            )}
          </button>

          <button
            onClick={handleRecenter}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
            title="Recenter on Delivery Vehicle"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative w-full overflow-hidden bg-slate-950" style={{ height }}>
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Live Telemetry Badge (Top Left Overlay) */}
        <div className="absolute top-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700/80 shadow-lg text-xs space-y-1.5 max-w-[240px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Delivery</span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> On Schedule
            </span>
          </div>
          <p className="font-extrabold text-sm text-white">
            {order.status === 'Delivered' 
              ? 'Delivered to Doorstep' 
              : order.status === 'Shipped' 
              ? 'Today by 3:45 PM' 
              : 'Within 2-3 Business Days'}
          </p>
          <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
            <span>Distance Remaining:</span>
            <span className="font-mono font-bold text-blue-400">
              {Math.max(0, Math.round((1 - simulationProgress) * 48))} km
            </span>
          </div>
        </div>

        {/* Floating Route Waypoint Legend (Bottom Left Overlay) */}
        <div className="absolute bottom-3 left-3 z-[400] hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border-2 border-sky-400"></span>
            <span>Origin Hub</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Live Vehicle</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Destination</span>
          </div>
        </div>
      </div>

      {/* Driver & Courier Contact Footer Strip */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-blue-400">
            SP
          </div>
          <div>
            <p className="font-bold text-white flex items-center gap-1">
              {driverName}
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </p>
            <p className="text-[11px] text-slate-400">{vehicleModel}</p>
          </div>
        </div>

        <div className="flex items-center justify-start sm:justify-center gap-2">
          <a
            href={`tel:${driverPhone}`}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Call Courier ({driverPhone})
          </a>
        </div>

        <div className="flex items-center justify-start sm:justify-end gap-2 text-right">
          <div className="text-right">
            <p className="text-[11px] text-slate-400">Shipping Mode</p>
            <p className="font-bold text-white uppercase text-[11px] tracking-wider text-emerald-400">
              {order.shippingMethod === 'express' ? '⚡ Express 24H Delivery' : '📦 Standard Ground'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
