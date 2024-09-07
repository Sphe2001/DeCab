import React from 'react';
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";




interface LatLng {
  latitude: number;
  longitude: number;
}

interface Location {
  lat_lng: LatLng;
}

interface RouteRequest {
  origin: {
    location: Location;
  };
  destination: {
    location: Location;
  };
  routing_preference: string;
  travel_mode: string;
}


export default function DriverHomePage() {
  const protoPath: string = "YOUR_PROTO_PATH";
  const apiKey: string = "YOUR_API_KEY";
  const host: string = "routes.googleapis.com:443";
  const fieldMask: string = "*";

const packageDefinition: protoLoader.PackageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor: any = grpc.loadPackageDefinition(packageDefinition).google.maps.routing.v2;
const metadata: grpc.Metadata = new grpc.Metadata();
const ComputeRoutesRequest: RouteRequest = {
  origin: {
    location: {
      lat_lng: {
        latitude: -37.816,
        longitude: 144.964,
      },
    },
  },
  destination: {
    location: {
      lat_lng: {
        latitude: -37.815,
        longitude: 144.966,
      },
    },
  },
  routing_preference: "TRAFFIC_AWARE",
  travel_mode: "DRIVE",
};

const ssl_creds: grpc.ChannelCredentials = grpc.credentials.createSsl();
const call_creds: grpc.CallCredentials = grpc.credentials.createFromMetadataGenerator(
  (args, callback) => {
    metadata.set("X-Goog-Api-Key", apiKey);
    metadata.set("X-Goog-Fieldmask", fieldMask);
    metadata.set("Content-Type", "application/json");
    callback(null, metadata);
  },
);

const credentials: grpc.ChannelCredentials = grpc.credentials.combineChannelCredentials(
  ssl_creds,
  call_creds,
);

const client = new protoDescriptor.Routes(host, credentials);

client.ComputeRoutes(ComputeRoutesRequest, (error: grpc.ServiceError | null, response: any) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(response);
});

  return (
    <div>
      DriverHomePage
    </div>
  );
}
