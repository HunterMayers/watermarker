import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

export default class App extends React.Component {
  state = {
    accountName: 'John Doe',
    currentRegion: null,
    lastLatitude: 0,
    lastLongitude: 0,
    error: null,
    markers: [
      {
        title: 'example',
        coordinates: {
          latitude: 19.6400,
          longitude: -155.9969
        },
        color: 'blue',
        date: new Date(2018, 5, 18),
      }
    ]
  }

  watchID: ?number = null

  addMarker = (p_title, p_color, p_date) => {
    let curMarker = {
      title: p_title,
      coordinates: {
        latitude: this.state.lastLatitude,
        longitude: this.state.lastLongitude
      },
      color: p_color,
      date: p_date,
    }
    this.setState({ markers: [...this.state.markers, curMarker] });
    console.log(this.state.markers);
  };

  onRegionChange(p_region, p_lastLatitude, p_lastLongitude) {
    this.setState({
      currentRegion: p_region,
      lastLatitude: p_lastLatitude || this.state.lastLatitude,
      lastLongitude: p_lastLongitude || this.state.lastLongitude,
    });
  }

  componentWillMount() {
    setTimeout(()=>this.forceUpdate(), 500);
  }

  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
        this.onRegionChange(region, region.latitude, region.longitude);
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1}
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        <MapView style={styles.map}
          provider='google'
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          region={this.state.currentRegion}>
          {this.state.markers.map((marker, i) => (
            <MapView.Marker
            key={i}
            coordinate={marker.coordinates}
            title={marker.title}
            pinColor={marker.color}
            description={marker.date.toString()}
            />
          ))}
        </MapView>
        {/* Rest of the app comes ABOVE the action button component !*/}
        <ActionButton size={40} position="left" buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#154360' title="Marlin" onPress={() => this.addMarker('Marlin ' + '-' + this.state.accountName, '#154360', new Date())}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#D0D3D4' title="Ahi" onPress={() => this.addMarker('Ahi ' + '-' + this.state.accountName ,'#D0D3D4', new Date())}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#fbff33' title="Mahi-Mahi" onPress={() => this.addMarker('Mahi-Mahi ' + '-' + this.state.accountName, '#fbff33', new Date())}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#f39c12' title="Ono" onPress={() => this.addMarker('Ono ' + '-' + this.state.accountName, '#f39c12', new Date())}>
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
