import React from 'react';
import PropTypes from 'prop-types';

class Breadcrumbs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    getBreadcrumbs(){
        let breadcrumbs = [];
        let inactiveDictsLi = <li key={1}>
            <a href="#"
                onClick={this.props.gotoDictionaries}
            >
                Dictionaries
            </a>
        </li>;
        switch(this.props.navSection){
        case 'DICTIONARIES':
            breadcrumbs.push(<li className="active" key={2}>
                    Dictionaries
            </li>);
            return breadcrumbs;
        case 'NEW_DICTIONARY':
            breadcrumbs.push(inactiveDictsLi);
            breadcrumbs.push(<li className="active" key={3}>New</li>);
            return breadcrumbs;
        case 'DICTIONARY':
            breadcrumbs.push(inactiveDictsLi);
            breadcrumbs.push(<li className="active" key={4}>{this.props.navDictName}</li>);
            return breadcrumbs;
        case 'NEW_ENTRY':
            breadcrumbs.push(inactiveDictsLi);
            breadcrumbs.push(<li key={2}>
                <a href="#" onClick={this.props.gotoDictionary.bind(null, this.props.navDictId)}>
                    {this.props.navDictName}
                </a>
            </li>);
            breadcrumbs.push(<li className="active" key={3}>New Entry</li>);
            return breadcrumbs;
        case 'TRAINING':
            breadcrumbs.push(inactiveDictsLi);
            breadcrumbs.push(<li key={2}>
                <a href="#" onClick={this.props.gotoDictionary.bind(null, this.props.navDictId)}>
                    {this.props.navDictName}
                </a>
            </li>);
            breadcrumbs.push(<li className="active" key={3}>Training</li>);
            return breadcrumbs;
        default: 
            breadcrumbs.push(<li className="active" key={5}>Error: unknown position</li>);
            return breadcrumbs;
        }
    }

    render(){
        if (this.props.navSection === 'MAIN_PAGE'){
            return <div style={{margin: '3em'}}></div>;
        }
        return <div className="row">
            <div className="col-sm-12">
                <ol className="breadcrumb" style={{backgroundColor: 'white'}}>
                    

                    {this.getBreadcrumbs()}
                </ol>
            </div>
        </div>;
    }
}

Breadcrumbs.propTypes = {
    gotoDictionaries: PropTypes.func.isRequired
    ,gotoDictionary: PropTypes.func.isRequired
    ,navSection: PropTypes.string.isRequired
    ,navDictId: PropTypes.string
    ,navDictName: PropTypes.string.isRequired
};

export default Breadcrumbs;