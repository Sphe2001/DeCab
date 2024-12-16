import { useEffect, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";

type Location = {
  latitude: number;
  longitude: number;
};

export default function MyRidesPage() {
  // Define the location state with type
  const [location, setLocation] = useState<Location>({ latitude: 0, longitude: 0 });

  useEffect(() => {
    // Create a STOMP client instance
    const client = new Client({
      brokerURL: "ws://localhost:8181/ws",
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to the topic and handle incoming messages
        client.subscribe("/topic/location-updates", (message: IMessage) => {
          try {
            const updatedLocation: Location = JSON.parse(message.body);
            setLocation(updatedLocation);
          } catch (error) {
            console.error("Error parsing WebSocket message", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
      },
    });

    // Activate the WebSocket connection
    client.activate();

    // Clean up when the component unmounts
    return () => {
      // Ensure deactivation is handled synchronously
      if (client.connected) {
        client.deactivate(); // This call will schedule an async disconnect
      }
    };
  }, []);

  return (
    <div>
      <h1>Live Location</h1>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
    </div>
  );
}
