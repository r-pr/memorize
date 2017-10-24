import PropTypes from 'prop-types';
import React from 'react';

const usernameRE = /^[A-Za-z][A-Za-z_\-\d]+$/;
const minPwdLen = 6;

export default class Main extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            waitingServerResp: false,
            signupWanted: false,
            username: '',
            password: '',
            passwordConf: '',
            errorMsg: props.errorMsg || ''
        };
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.errorMsg !== this.state.errorMsg){
            this.setState({errorMsg: nextProps.errorMsg });
        }
        this.setState({ waitingServerResp: false });
    }
    _validate(){
        if (!this.state.username.match(usernameRE)){
            this.setState({
                errorMsg: 'Username must start with a digit, followed by digits, ' +
                    'numbers, or hyphens.'
            });
            return false;
        }
        if (this.state.password.length < minPwdLen){
            this.setState({errorMsg: 'Password must contain at least 6 characters.'});
            return false;
        }
        if (this.state.signupWanted && this.state.password !== this.state.passwordConf){
            this.setState({errorMsg: 'Passwords don\'t match.'});
            return false;
        }
        return true;
    }
    onLogInClick(){
        if (this._validate()){
            this.props.onLogIn(this.state.username, this.state.password);
            this.setState({ waitingServerResp: true });
        }

    }
    onSignupClick(){
        if (!this.state.signupWanted){
            this.setState({signupWanted: true });
        } else if (this._validate()) {
            this.props.onSignUp(this.state.username, this.state.password);
            this.setState({ waitingServerResp: true });
        }
    }
    render(){
        return <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4"
            	style={{marginBottom: '1em'}}
            >
            <h4>
                Welcome to Mnesis, the service that can help you memorize foreing words and other things.
            </h4>
            <h4>
            	<a href="about.html" target="blank">Learn more</a>.
            </h4>
                
            </div>
        	<div className="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 col-md-4 col-md-offset-4">

        		<div className="row">
        			<input type="text" className="form-control" placeholder="Username"
                        value={this.state.username}
                        onChange={(e)=>{ this.setState({username: e.target.value}) }}
                    />
        		</div>

        		<div className="row" style={{marginTop: '0.5em'}}>
        			<input type="password" className="form-control" placeholder="Password"
                        value={this.state.password}
                        onChange={(e)=>{ this.setState({password: e.target.value })}}
                    />
        		</div>

                <div className="row" style={{
                    marginTop: '0.5em',
                    display: this.state.signupWanted ? 'block' : 'none'
                }}>
                	<input type="password" className="form-control" placeholder="Confirm password"
                        value={this.state.passwordConf}
                        onChange={(e)=>{ this.setState({passwordConf: e.target.value}) }}
                    />
                </div>

                <div className="row" style={{
                    marginTop: '0.5em'
                    ,display: this.state.errorMsg ? 'block' : 'none'
                }}>
                    <div className="alert alert-danger alert-dismissible" role="alert"
                        style={{marginBottom: 0}}
                    >
                        <button type="button" className="close" data-dismiss="alert" 
                            aria-label="Close"
                            onClick={()=>{
                                this.setState({errorMsg: ''})
                            }}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {this.state.errorMsg}
                    </div>
                </div>

        		<div className="row" style={{
                    marginTop: '0.5em',
                    display: this.state.signupWanted ? 'none' : 'block'
                }}>
        				<button className="btn btn-success btn-block"
                            disabled={
                                !(this.state.username.length > 0 &&
                                  this.state.password.length > 0) || 
                                  this.state.waitingServerResp
                            }
                            onClick={this.onLogInClick.bind(this)}
                        >
        					Log in
        				</button>
        		</div>

                <div className="row" style={{marginTop: '0.5em'}}>
                	    <button 
                            className={
                                this.state.signupWanted ? 'btn btn-primary btn-block' 
                                    : 'btn btn-info btn-block'
                            }
                            disabled={
                                !(this.state.username.length > 0 &&
                                  this.state.password.length > 0) ||
                                  this.state.waitingServerResp
                            }
                            onClick={this.onSignupClick.bind(this)}
                        >
                            Sign up
                        </button>
        		</div>
        		<div className="row" style={{
        			marginTop: '0.5em',
        			display: this.state.waitingServerResp ? 'block' : 'none'
        		}}>
        			 <p>Please wait...</p>
        		</div>
        </div>
        </div>
    }
}

Main.propTypes = {
    onLogIn: PropTypes.func.isRequired,
    onSignUp: PropTypes.func.isRequired
};