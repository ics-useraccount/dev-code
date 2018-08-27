import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';


class MenuContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fleet: null,
      logout: false
    }
  }

  componentDidMount() {
    this.props.getFleetData();
  }

  logout = () => {
    this.setState({logout:true}, () => {
      localStorage.setItem('isLoggedInToICSDashboard', false);
      localStorage.setItem('token', null);
    });
  };

  render() {
    const { logout } = this.state;
    if (logout) {
      return <Redirect to="/" push={true} />
    }
    return (
      <div>
        {this.props.fleet && this.props.fleet.map((fleetData, index) =>
          <MenuItem key={index}
                    style={{backgroundColor: fleetData.selected ? '#c3c3c3' : ''}}
                    onClick={() => this.props.getData(fleetData)}>{fleetData.Name}</MenuItem>)}
                    <hr/>
          <MenuItem onClick={() => this.logout()}>Logout</MenuItem>     
      </div>
    )
  }
  static propTypes = {
    updateMap: PropTypes.func.isRequired,
    updateTireData: PropTypes.func.isRequired,
    toggleSideBar: PropTypes.func.isRequired,
    getFleetData: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    fleet: PropTypes.array
  }
}

export default MenuContainer;
