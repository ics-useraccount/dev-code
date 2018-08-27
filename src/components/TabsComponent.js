import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import PropTypes from 'prop-types';
import TireTableComponent from './TireTableComponent';
import GPSTableComponent from './GPSTableComponent';
import EventsTableComponent from './EventsTableComponent';

export default class TabsComponent extends Component {

  render() {
    return (
      <div style={{marginLeft: (this.props.marginLeft === true) ? '185px' : '0px'}}>
        <Tabs>
          <Tab label="GPS">
            <div>
              <GPSTableComponent GPSData={this.props.GPSData}/>
            </div>
          </Tab>
          <Tab label="Tire Data">
            <div>
              <TireTableComponent tireData={this.props.tireData}/>
            </div>
          </Tab>
          <Tab
            label="Event Data">
            <div>
              <EventsTableComponent />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
  static propTypes = {
    marginLeft: PropTypes.bool.isRequired,
    tireData: PropTypes.object,
    GPSData: PropTypes.object
  }
}
