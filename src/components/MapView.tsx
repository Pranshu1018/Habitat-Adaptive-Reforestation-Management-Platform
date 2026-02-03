import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Layers, TreeDeciduous, Droplets, AlertTriangle } from 'lucide-react';
import { Region, regions } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Note: In production, use environment variable for the token
mapboxgl.accessToken = 'pk.eyJ1IjoicHJhbnNodTA3ZCIsImEiOiJjbWw3M3Y4anMwaTRjM2ZzMnRxNDMwZG1wIn0.9xoLZUBXBjL20WJhsmXDcw';

interface MapViewProps {
  selectedRegion: Region | null;
  onSelectRegion: (region: Region) => void;
  simulationMode: boolean;
}

type LayerType = 'vegetation' | 'soil' | 'risk';

const MapView = ({ selectedRegion, onSelectRegion, simulationMode }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [activeLayer, setActiveLayer] = useState<LayerType | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initializeMap = () => {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [20, 5],
          zoom: 1.8,
          minZoom: 1.5,
          maxZoom: 12,
          projection: 'mercator',
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        // Add region markers
        map.current.on('load', () => {
          regions.forEach((region) => {
            const markerEl = document.createElement('div');
            markerEl.className = 'region-marker';
            markerEl.innerHTML = `
              <div class="w-10 h-10 rounded-full bg-primary/90 shadow-glow flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-glow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 10V6c0-2.21-1.79-4-4-4S9 3.79 9 6v4"/>
                  <path d="M12 2c3.87 0 7 3.13 7 7-1.07.57-2.28.93-3.58.95a8.04 8.04 0 0 0-6.84 0C7.28 9.93 6.07 9.57 5 9c0-3.87 3.13-7 7-7Z"/>
                  <path d="M12 22v-4"/>
                  <path d="m5 11 2 2"/>
                  <path d="m19 11-2 2"/>
                  <path d="M12 14a6 6 0 0 0 6-6"/>
                  <path d="M12 14a6 6 0 0 1-6-6"/>
                </svg>
              </div>
            `;

            markerEl.addEventListener('click', () => onSelectRegion(region));

            const marker = new mapboxgl.Marker({ element: markerEl })
              .setLngLat(region.coordinates)
              .addTo(map.current!);

            markersRef.current.push(marker);
          });
        });

        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [onSelectRegion]);

  // Fly to selected region
  useEffect(() => {
    if (map.current && selectedRegion) {
      map.current.flyTo({
        center: selectedRegion.coordinates,
        zoom: 6,
        duration: 1500,
        essential: true,
      });
    }
  }, [selectedRegion]);

  // Simulation mode visual effects
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    
    try {
      if (simulationMode) {
        // Add slight red/orange tint for simulation mode
        if (map.current.getLayer('land')) {
          map.current.setPaintProperty('land', 'background-color', 'hsl(30, 30%, 92%)');
        }
      } else {
        if (map.current.getLayer('land')) {
          map.current.setPaintProperty('land', 'background-color', 'hsl(140, 20%, 94%)');
        }
      }
    } catch (error) {
      console.warn('Could not set map paint property:', error);
    }
  }, [simulationMode]);

  const toggleLayer = (layer: LayerType) => {
    setActiveLayer(activeLayer === layer ? null : layer);
  };

  return (
    <div className="relative flex-1 h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-2xl overflow-hidden" />

      {/* Layer Controls */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 glass-card rounded-xl p-2 space-y-2"
      >
        <button
          onClick={() => toggleLayer('vegetation')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
            activeLayer === 'vegetation'
              ? "bg-success/20 text-success"
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <TreeDeciduous className="w-4 h-4" />
          <span>Vegetation</span>
        </button>
        <button
          onClick={() => toggleLayer('soil')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
            activeLayer === 'soil'
              ? "bg-chart-earth/20 text-chart-earth"
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Soil Quality</span>
        </button>
        <button
          onClick={() => toggleLayer('risk')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
            activeLayer === 'risk'
              ? "bg-warning/20 text-warning"
              : "hover:bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Risk Zones</span>
        </button>
      </motion.div>

      {/* Simulation Mode Indicator */}
      {simulationMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-warning/20 border border-warning/50 text-warning font-medium text-sm flex items-center gap-2"
        >
          <Droplets className="w-4 h-4" />
          <span>Simulation Active</span>
        </motion.div>
      )}

      {/* Selected Region Info */}
      {selectedRegion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 glass-card rounded-xl p-4 max-w-xs"
        >
          <h3 className="font-semibold text-foreground">{selectedRegion.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedRegion.country}</p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="text-primary font-medium">{selectedRegion.hectares.toLocaleString()} ha</span>
            <span className="text-muted-foreground">{selectedRegion.survivalRate}% survival</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MapView;
