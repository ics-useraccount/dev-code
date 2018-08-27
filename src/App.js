import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import moment from "moment-timezone";
import { StyleRoot } from 'radium';
import _ from 'lodash';
import history from './history';

import MapContainer from './components/MapContainer';
import MenuContainer from './components/MenuContainer';
import TabsComponent from "./components/TabsComponent";
import API from "./Api";
import Toggle from 'material-ui/Toggle';


const styles = {
  block: {
    maxWidth: 250,
  },
  toggle: {
    marginBottom: 16,
  },
  thumbOff: {
    backgroundColor: 'rgb(125, 125, 125)',
  },
  trackOff: {
    backgroundColor: 'rgb(218, 218, 218)',
  },
  thumbSwitched: {
    backgroundColor: 'red',
  },
  trackSwitched: {
    backgroundColor: '#ff9d9d',
  },
  labelStyle: {
    color: 'white',
    fontWeight: '600'
  }
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fleetName: '',
      gpsPoints: null,
      tireData: null,
      isDrawerOpen: false,
      intervalController: false,
      fleet: null,
      GPSData: null,
      intervalControllerSwitch: false,
      isLoggedIn: false
    }
  }

  componentDidMount() {
    console.log('localStorage.getItem(isLoggedInToICSDashboard)', localStorage.getItem('isLoggedInToICSDashboard'));
    if(localStorage.getItem('isLoggedInToICSDashboard') === 'false'){
      history.push('/');
      this.setState({
        isLoggedIn: false
      })
    }else {
      this.setState({
        isLoggedIn: true
      });
    }
  }

  toggleNetworkCallSwitch = (event, isInputChecked) => {
    // console.log('isInputChecked', isInputChecked);
    if (isInputChecked) {
      this.interval = setInterval(this.tick, 60000);
    }
    else {
      clearInterval(this.interval);
    }
  };

  getTiresData = (fleetName) => {
    API.getTiresData(fleetName).then((res) => {
      this.updateTireData(res);
    });
  };

  getUnitData = (fleetName) => {
    API.getUnitData(fleetName).then((res) => {
      // this.updateMap(res, fleetName);
      this.setState({
        gpsPoints: res
      })
    });
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    // console.log('tick');
    this.getUnitData(this.state.fleetName);
    this.getTiresData(this.state.fleetName);
  };

  updateData = () => {
    this.tick();
    if (!this.state.intervalController) {
      this.setState({
        intervalController: true
      }, () => {
      });
    }
  };

  updateMap = (fleetName) => {
    this.setState({
      fleetName
    }, () => {
      this.updateData();
    });
  };

  updateTireData = (tireData) => {
    this.setState({
      tireData
    });
  };

  toggleSideBar = () => {
    this.setState({
      isDrawerOpen: !this.state.isDrawerOpen
    });
  };

  updateDates = (sDate, eDate) => {
    this.setState({
      startDate: moment.tz(sDate, "America/New_York").format('YYYY-MM-D, h:mm a'),
      endDate: moment.tz(eDate, "America/New_York").format('YYYY-MM-D, h:mm a')
    });
  };

  getFleetData = () => {
    API.getFleetData().then((res) => {
      this.setState({
        fleet: res.Fleet
      }, () => {
        this.state.fleet.forEach((fleet) => {
          fleet.selected = false;
        });
        this.getData(this.state.fleet[0]);
      });
    });
  };


  getData = (fleetData) => {

    this.toggleSideBar();
    _.forEach(this.state.fleet, (f) => {
      f.selected = (f.ID === fleetData.ID);
      if (f.ID === fleetData.ID) {
        this.setState({
          GPSData: f
        })
      }
    });
    this.updateMap(fleetData.Name);
  };

  render() {
    const rightButtons = (
      <div style={{display: 'flex'}}>
        <div>
          <Toggle
            label="Real Time Data"
            labelStyle={styles.labelStyle}
            thumbStyle={styles.thumbOff}
            trackStyle={styles.trackOff}
            thumbSwitchedStyle={styles.thumbSwitched}
            trackSwitchedStyle={styles.trackSwitched}
            onToggle={this.toggleNetworkCallSwitch}
            labelPosition='right' />
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'floralwhite',
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '35px',
          '@media screen and (max-width: 769px)': {
            display: 'none'
          }
        }}>
          <div><strong>Start Date:</strong> {this.state.startDate} </div>
          <div><strong>End Date: </strong>{this.state.endDate}</div>
        </div>
      </div>
    );

    return (
      <StyleRoot>
        {this.state.isLoggedIn && <div><AppBar title={this.state.fleetName}
                onLeftIconButtonTouchTap={this.toggleSideBar}
                iconStyleLeft={{marginTop: '0px'}}
                iconElementRight={rightButtons}
                titleStyle={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  margin: '0px',
                  paddingTop: '0px',
                  letterSpacing: '0px',
                  fontSize: '24px',
                  fontWeight: '400',
                  color: 'rgb(255, 255, 255)',
                  height: '40px',
                  lineHeight: '40px',
                  flex: '1 1 0%',
                  textAlign: 'center'
                }}
                style={{height: '40px', position: 'fixed', top: 0}}/>
        <Drawer open={this.state.isDrawerOpen} containerStyle={{marginTop: '40px', width: '185px'}}>
          <MenuContainer updateMap={this.updateMap}
                         updateTireData={this.updateTireData}
                         toggleSideBar={this.toggleSideBar}
                         getFleetData={this.getFleetData}
                         getData={this.getData}
                         fleet={this.state.fleet}
          />
        </Drawer>
        <MapContainer updateDates={this.updateDates} gpsPoints={this.state.gpsPoints}
                      marginLeft={this.state.isDrawerOpen}/>
        <div>
          <TabsComponent marginLeft={this.state.isDrawerOpen} tireData={this.state.tireData}
                         GPSData={this.state.gpsPoints}/>
        </div></div> }
      </StyleRoot>
    )
  }
}

export default App;
