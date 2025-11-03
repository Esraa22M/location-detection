import { View , StyleSheet} from "react-native";
import { LocationInfo } from "../components/locationInfo.components";
import MapView, { Marker } from "react-native-maps";
export const LocationPicker = ({ mapRef, location }) => {

	const initialRegion = {
		latitude: location ? location.latitude : 37.78825,
		longitude: location ? location.longitude : -122.4324,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};
	return (
		<View style={styles.container}>
			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={initialRegion}
				showsUserLocation={false} // we use our own Marker for clarity
				showsMyLocationButton={true}
				toolbarEnabled={true}
				pitchEnabled={true}
			>
				{location && (
					<Marker
						coordinate={{
							latitude: location.latitude,
							longitude: location.longitude,
						}}
						title="You"
						description="Live location"
					/>
				)}
			</MapView>
			<LocationInfo
				location={location}
				message={"Location updates happen in real-time"}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	container: { flex: 1 },
	map: { flex: 1 },
	small: { fontSize: 12, color: "gray", marginTop: 4 },
});
