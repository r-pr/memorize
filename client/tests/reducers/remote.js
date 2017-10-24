var expect = require('chai').expect;
import reduce from './../../source/reducers';
var a = require('./../../source/actions');

describe('login', function(){
	it('LOGIN_OK', function(){
		expect(reduce({}, a.loginOk('baz'))).to.deep.equal({
	        userName: 'baz',
	        errorMsg: '',
	        navigation: {
	        	section: a.NavPositions.DICTIONARIES
	        }
	    });
	});
	it('LOGIN_ERR', function(){
		expect(reduce({}, a.loginErr('foo'))).to.deep.equal({
	        userName: '',
	        errorMsg: 'foo',
	        navigation: {
	        	section: a.NavPositions.MAIN_PAGE
	        }
	    });
	});
	it('SIGNUP_ERR', function(){
		expect(reduce({}, a.loginErr('foobar'))).to.deep.equal({
	        userName: '',
	        errorMsg: 'foobar',
	        navigation: {
	        	section: a.NavPositions.MAIN_PAGE
	        }
	    });
	});
	it('LOGOUT', function(){
		var before = {
			dictionaries: {
				'1': 'foo'
			},
			navigation: {
				dictId: 'bar',
				pageNum: 1,
				section: 'DICTIONARY'
			},
			userName: 'baz',
			errorMsg: 'foo'
		};
		var after = reduce(before, a.logout());
		expect(after).to.deep.equal({
			dictionaries: {},
			navigation: {section: 'MAIN_PAGE'},
			userName: '',
			errorMsg: ''
		});
	});
});