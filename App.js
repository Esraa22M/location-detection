import React, { useEffect, useState, useRef } from "react";
import * as Location from "expo-location";
import { AppLoader } from "./src/components/appLoader.components";
import { PermissionRequest } from "./src/components/permissionRequest.components";
import { LocationPicker } from "./src/screens/locationPicker.screens";

function App() {
	const [permissionStatus, setPermissionStatus] = useState(null);
	const [loading, setLoading] = useState(true);
	const [location, setLocation] = useState(null);
	const mapRef = useRef(null);
	const locationSubscriptionRef = useRef(null);

	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			setPermissionStatus(status);
			if (status !== "granted") {
				setLoading(false);
				return;
			}

			// Get initial location (one-time) and then subscribe to updates
			try {
				const loc = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Highest,
				});
				const coords = {
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
				};
				setLocation({ ...coords });
				setLoading(false);

				const subscription = await Location.watchPositionAsync(
					{
						accuracy: Location.Accuracy.Highest,
						timeInterval: 2000, // receive updates every 2 seconds (if available)
						distanceInterval: 1, // receive updates when moved by 1 meter (if available)
					},
					(locUpdate) => {
						const newCoords = {
							latitude: locUpdate.coords.latitude,
							longitude: locUpdate.coords.longitude,
						};
						setLocation(newCoords);

						// Move map to new location
						if (mapRef.current) {
							mapRef.current.animateToRegion(
								{
									...newCoords,
									latitudeDelta: 0.005,
									longitudeDelta: 0.005,
								},
								500 // ms
							);
						}
					}
				);
				locationSubscriptionRef.current = subscription;
			} catch (err) {
				console.warn("Failed to get initial location", err);
				setLoading(false);
			}
		})();

		return () => {
			if (locationSubscriptionRef.current) {
				locationSubscriptionRef.current.remove();
			}
		};
	}, []);

	if (loading) {
		return <AppLoader message={"Waiting for location & permissions..."} />;
	}

	if (permissionStatus !== "granted") {
		// requirement: If permission is denied, show a text message
		return <PermissionRequest />;
	}

	return <LocationPicker mapRef={mapRef} location={location} />;
}
export default App;
