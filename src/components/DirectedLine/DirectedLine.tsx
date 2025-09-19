import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-polylinedecorator";

interface DirectedLineProps {
  positions: [number, number][];
  color?: string;
  size?: number;
}

const DirectedLine: React.FC<DirectedLineProps> = ({
  positions,
  color = "red",
  size = 20,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Draw the base polyline
    const polyline = L.polyline(positions, { color }).addTo(map);

    // Add filled arrow decorator
    const decorator = (L as any).polylineDecorator(polyline, {
      patterns: [
        {
          offset: "70%", // middle of the line
          repeat: 0, // only one arrow
          symbol: (L as any).Symbol.arrowHead({
            pixelSize: size,
            polygon: true, // filled arrow
            pathOptions: { color, weight: 1, fillOpacity: 1 },
          }),
        },
      ],
    }).addTo(map);

    // Cleanup
    return () => {
      map.removeLayer(polyline);
      map.removeLayer(decorator);
    };
  }, [map, positions, color, size]);

  return null;
};

export default DirectedLine;
