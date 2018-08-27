import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from "moment-timezone";

export default class EventsTableComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      GPSData: null,
    }
  }

  componentWillReceiveProps(nextProps) {

  };

  componentDidMount() {
  }

  render() {

    const columns = [
      {id: 'Date', Header: 'Local Time', accessor: d => d.Date ? moment.tz(d.Date , "America/New_York").format('YYYY-MM-D, h:mm a') : null },//moment.tz(point.Date, "America/New_York").format('LLLL')
      {Header: 'Event Type', accessor: 'Speed'},
      {Header: 'Location/Description', accessor: 'Direction'}
    ];

    return (
      <div>
        <ReactTable
          data={[]}
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
}