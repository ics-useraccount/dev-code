import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from "moment-timezone";
import PropTypes from 'prop-types';

export default class GPSTableComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      GPSData: null,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.GPSData) {
      this.setState({
        GPSData: nextProps.GPSData
      }, () =>{
        // console.log('gpsdata', this.state.GPSData);
      });
    }
  };

  componentDidMount() {
  }

  render() {
    const columns = [
      // {id: 'Date', Header: 'Local Time', accessor: d => d.Date ? moment.tz(d.Date , "America/New_York").format('YYYY-MM-D, h:mm a') : null },//moment.tz(point.Date, "America/New_York").format('LLLL')
      {Header: 'Speed', accessor: 'Speed'},
      {accessor: 'Direction', Header: 'Heading'},
      {accessor: 'Lat', Header: 'Latitude'},
      {accessor: 'Lon', Header: 'Longitude'},
      {id: 'Date', Header: 'GPS Time', accessor: d => d.Date ? moment.tz(d.Date , "America/New_York").format('YYYY-MM-D, h:mm a') : null },//moment.tz(point.Date, "America/New_York").format('LLLL')
    ];

    return (
      <div>
        <ReactTable
          data={this.state.GPSData ? (this.state.GPSData.GPS ? this.state.GPSData.GPS : []) : []}
          columns={columns} className="-highlight"
          noDataText="No current data available!"
          defaultPageSize={5}
          getTdProps={() => {
            return {
              style: {
                textAlign: 'center'
              }
            }
          }}
        />
      </div>
    );
  }

  static propTypes = {
    GPSData: PropTypes.object
  }
}
