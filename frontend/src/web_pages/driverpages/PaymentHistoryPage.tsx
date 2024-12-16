import { useEffect } from "react";
import { Client } from "@stomp/stompjs";

export default function PaymentHistoryPage() {
  useEffect(() => {
    // Initialize STOMP client
    const client = new Client({
      brokerURL: "ws://localhost:8181/ws", // Replace with your WebSocket URL
      onConnect: () => console.log("Connected to WebSocket"),
    });

    // Activate the client
    client.activate();

    // Watch the user's geolocation
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = JSON.stringify({ latitude, longitude });

        // Publish the location data to the WebSocket server
        client.publish({
          destination: "/app/location",
          body: locationData,
        });
      },
      (error) => {
        console.error("Error watching geolocation:", error);
      }
    );

    // Cleanup function for the useEffect hook
    return () => {
      // Clear the geolocation watch
      navigator.geolocation.clearWatch(watchId);

      // Deactivate the WebSocket client
      if (client.connected) {
        client.deactivate();
      }
    };
  }, []);

  return <div>Sharing Live Location...</div>;
}
