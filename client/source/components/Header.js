import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.Component {
    render(){
        return <div style = {{
            borderBottom: '1px solid gray'
        }}> 
            <span style={{fontSize: '1.5em'}}>
                <span className="glyphicon glyphicon-education" aria-hidden="true"></span>
					&nbsp;Mnesis
            </span>
            <span style={{
                float: 'right', 
                marginTop: '0.3em',
                display: this.props.userName ? 'inline' : 'none'
            }}
            >
                <strong>Logged in as:&nbsp;</strong>
                {this.props.userName} (
                <a href="" onClick={e=>{
                    e.preventDefault();
                    this.props.onLogout();
                }}>
                    Logout
                </a>
                )
            </span>
        </div>;
    }
}

Header.propTypes = {
    userName: PropTypes.string,
    onLogout: PropTypes.func.isRequired
};