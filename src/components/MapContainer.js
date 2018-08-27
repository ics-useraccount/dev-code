import React, {Component} from 'react';
import {Card} from 'material-ui/Card';
import _ from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';


class MapContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gpsPoints: null
    }
  }

  componentDidMount() {
    this.googleChecker();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.gpsPoints !== this.state.gpsPoints) {
      this.setState({
        gpsPoints: nextProps.gpsPoints
      }, () => {
        this.renderMap();
      })
    }
    ;
  };

  googleChecker = () => {
    if (!window.google.maps) {
      setTimeout(this.googleChecker, 100);
    } else {
      this.renderMap();
    }
  };


  renderMap = () => {
    const google = window.google;
    let bounds = new google.maps.LatLngBounds();
    let map = new google.maps.Map(this.refs.mapContainer, {
      zoom: 10,
      gestureHandling: "greedy"
    });
    if (this.state.gpsPoints && this.state.gpsPoints.GPS && this.state.gpsPoints.GPS.length) {
      this.renderOnClick(google, map, bounds);
    }
  };

  renderOnClick = (google, map, bounds) => {
    let flightPath, latLong;
    this.state.gpsPoints.GPS.forEach((point) => {
      point.lat = point.Lat;
      point.lng = point.Lon;
      bounds.extend(new google.maps.LatLng(point.Lat, point.Lon));
    });

    latLong = _.map(this.state.gpsPoints.GPS, _.partial(_.ary(_.pick, 3), _, ['lat', 'lng', 'speed']));
    flightPath = new google.maps.Polyline({
      path: latLong,
      geodesic: true,
      strokeColor: '#00bcd4',
      strokeOpacity: 0,
      strokeWeight: 6
    });
    flightPath.setMap(map);
    this.runSnapToRoad(google, flightPath.getPath(), map);
  };

  runSnapToRoad = (google, path, map) => {
    let pathValues = [];
    for (let i = 0; i < path.getLength(); i++) {
      pathValues.push(path.getAt(i).toUrlValue());
    }
    // API.snapToRoad(pathValues)
    //   .then((res) => {
        this.processSnapToRoadResponse(google, [], map);

        console.log(this.state.gpsPoints.GPS);
      // });
  };

  processSnapToRoadResponse = (google, data, map) => {
    let snappedCoordinates = [];
    let placeIdArray = [];
    let infowindow = new google.maps.InfoWindow();
    let bounds = new google.maps.LatLngBounds();
    // if (data.snappedPoints) {
    if(this.state.gpsPoints && this.state.gpsPoints.GPS){
      this.state.gpsPoints.GPS.forEach((point, index) => {
        if(point.originalIndex){
          point.Speed = this.state.gpsPoints.GPS[point.originalIndex].Speed;
          point.Direction = this.state.gpsPoints.GPS[point.originalIndex].Direction;
          point.Name = this.state.gpsPoints.GPS[point.originalIndex].Name;
          point.Date = new Date(this.state.gpsPoints.GPS[point.originalIndex].Date);
        }
        this.props.updateDates( this.state.gpsPoints.GPS[this.state.gpsPoints.GPS.length -1].Date ,this.state.gpsPoints.GPS[0].Date);
        let markerIcon = {
        };
        if(index === 0){
          markerIcon.url = 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png';
        }else if(index === this.state.gpsPoints.GPS.length -1){
          markerIcon.url = 'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png';
        }else{
          markerIcon.url = ''
        }

        let marker = new google.maps.Marker({
          position: {lat: point.lat, lng: point.lng},
          animation: google.maps.Animation.DROP,
          map: map,
          icon: markerIcon,
          title: point.Name
        });

        const contentString = `<div id="content">
          <h1 id="firstHeading" class="firstHeading">${point.Name || this.state.gpsPoints.GPS[0] ? this.state.gpsPoints.GPS[0].Name : 'N/A'}</h1>
          <div id="bodyContent">
          <div><strong>Date</strong>: ${moment.tz(point.Date, "America/New_York").format('LLLL') || 'N/A'}</div>
          <div><strong>Point number</strong>: ${this.state.gpsPoints.GPS.length - index}</div>
          <div><strong>Direction</strong>: ${point.Direction || 0}</div>
          <div><strong>Speed</strong>: ${point.Speed || 0}</div>
          </div>
          </div>`;

        google.maps.event.addListener(marker, 'click', (function (marker) {
              return function () {
                infowindow.setContent(contentString);
                infowindow.setOptions({maxWidth: 200});
                infowindow.open(map, marker);
              }
            })(marker));
        let latlng = new google.maps.LatLng(
          point.lat,
          point.lng);
        snappedCoordinates.push(latlng);
        placeIdArray.push(point.placeId);
        this.drawSnappedPolyline(google, map, snappedCoordinates);

        bounds.extend(new google.maps.LatLng(point.lat, point.lng));

        map.fitBounds(bounds);
        map.panToBounds(bounds);
      });

    }
  };

  drawSnappedPolyline = (google, map, snappedCoordinates) => {

    let lineSymbol = {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      strokeOpacity: 1,
      scale: 4
    };
    let snappedPolyline = new google.maps.Polyline({
      path: snappedCoordinates,
      strokeOpacity: 0,
      strokeWeight: 6,
      strokeColor: '#002e33',
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '55px'
      }]
    });

    snappedPolyline.setMap(map);
  };


  render() {
    return (
      <Card style={{marginLeft: (this.props.marginLeft === true) ? '185px' : '0px', position: 'sticky',
        top: '40px', zIndex: 9999
      }}>
        <div className="card map-holder">
          <div className="card-block" ref="mapContainer" style={{height: '450px', marginTop: '40px'}}/>
        </div>
      </Card>
    );
  }
  static propTypes = {
    updateDates: PropTypes.func.isRequired,
    gpsPoints: PropTypes.object,
    marginLeft: PropTypes.bool.isRequired
  }
}

export default MapContainer;