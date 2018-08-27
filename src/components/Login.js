import React from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Redirect } from 'react-router';

import API from '../Api';

const styles = {
	container: {
	    height: '80%',
	    width: '100%',
	    position: 'absolute',
	    display: 'flex',
	    flexDirection: 'column',
	    justifyContent: 'center',
	    alignItems: 'center'
	}
};
class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		username:'',
		password:'',
		clientID: '',
		login: false
		}
	 }

 componentDidMount(){
   localStorage.setItem('isLoggedInToICSDashboard', false);
   localStorage.setItem('token', null);
 }

 handleClick(event){
  if(!(this.state.username === '') && !(this.state.password === '') && !(this.state.clientID === '') && !isNaN(this.state.clientID)) {
    API.login(this.state.username, this.state.password, this.state.clientID)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('isLoggedInToICSDashboard', true);
          localStorage.setItem('token', res.data.Token);
          this.setState({
            login: true
          })
        }
        else {
          alert("Please check your credentials.");
        }
      })
  }
  else{
    alert("Please check the data");
  }
 }

  handleKeyDown = event => {
    switch (event.key) {
      case 'Enter':
        this.handleClick();
        break;
      default: break
    }
  };

	render() {
    const { login } = this.state;
    if (login) {
      return <Redirect to="/dashboard" push={true} />
    }
    return (
        <div>
          	<AppBar
             title="Login"
           	/>
           	<div style={styles.container}>
	           <TextField
	             hintText="Enter your Username"
	             floatingLabelText="Username"
							 onChange = {(event,newValue) => this.setState({username:newValue})}
	             autoComplete="off" onKeyDown={this.handleKeyDown}/>
	           	<br/>
	     		<TextField
	               type="password"
	               hintText="Enter your Password"
	               floatingLabelText="Password"
	               onChange = {(event,newValue) => this.setState({password:newValue})}
	           	   autoComplete="new-password" onKeyDown={this.handleKeyDown}/>
				<br/>
				<TextField
				type="text"
				hintText="Enter your Client ID"
				floatingLabelText="Client ID"
				onChange = {(event,newValue) => this.setState({clientID:newValue})}
				autoComplete="new-clientID" onKeyDown={this.handleKeyDown}/>
				<br/>
				<RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
            </div>
        </div>
    );
  }
}
const style = {
 margin: 15,
};
export default Login;