import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import moment from "moment-timezone";
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class TireTableComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tireData: []
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.tireData) {
      let tireData = nextProps.tireData.TireData.Wheels ? nextProps.tireData.TireData.Wheels : [];
      let last15Days =  moment().subtract(7,'days').startOf('day');
      let yesterdayEndOfRange =  moment().endOf('day');
      let filteredObjects = _.filter(tireData,
        (each) => {
          each.date = each.DSD ? each.DSD : each.PSD;
          return moment(each.date)
            .isBetween(last15Days, yesterdayEndOfRange) ;
        });

      this.setState({
        tireData: filteredObjects
      });
    }
  };

  componentDidMount() {
  }

  render() {
    const columns = [
      {
        Header: 'Local Time',
        id: 'Date',
        accessor: d => d.DSD ? moment.tz(d.DSD, "America/New_York").format('YYYY-MM-D, h:mm a') : moment.tz(d.PSD, "America/New_York").format('YYYY-MM-D, h:mm a')
      },
      {Header: 'Wheel', accessor: 'Wheel'},
      {id:'Session Id', Header: 'Sensor ID',  accessor: d => d.DSS ? d.DSS : (d.PSS ? d.PSS : '')},
      {id: 'Pressure', Header: 'Pressure', accessor: d => d.DSP ? d.DSP : (d.PSP ? d.PSP : 0)},
      {id: 'Temperature', Header: 'Temperature', accessor: d => d.DST ? d.DST : (d.PST ? d.PST : 0)},
      {Header: 'High 1', accessor: 'HI1'},
      {Header: 'High 2', accessor: 'HI2'},
      {Header: 'Low 1', accessor: 'LO1'},
      {Header: 'Low 2', accessor: 'LO2'}
    ];

    return (
      <div>
        <ReactTable
          data={this.state.tireData ? (this.state.tireData ? this.state.tireData : []) : []}
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
    tireData: PropTypes.object
  }
}