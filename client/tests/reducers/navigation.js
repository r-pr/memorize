var expect = require('chai').expect;
var navigate = require('./../../source/reducers').navigate;
var a = require('./../../source/actions')

describe('navigate', () => {
	it('should navigate to DICTIONARIES by default', () => {
	    expect(navigate(undefined, {})).to.deep.equal({ section: a.NavPositions.DICTIONARIES })
	});
	it('should correctly handle navDictionaries ', () => {
	    expect(navigate({}, a.navDictionaries())).to.deep.equal({ section: a.NavPositions.DICTIONARIES })
	});

	it('should correctly handle navDictionary', () => {
	    expect(navigate({
	    	section: a.NavPositions.DICTIONARY,
	    	dictId: 111,
	    	pageNum: 12
	    }, a.navDictionary(123))).to.deep.equal({
	        section: a.NavPositions.DICTIONARY,
	        dictId: 123,
	        pageNum: 1
	    })
	});

	it('..and navNewDictionary', () => {
	    expect(navigate({
	    	section: a.NavPositions.TRAINING,
	    	dictId: 12,
	    	pageNum: 1
	    }, a.navNewDictionary())).to.deep.equal({ 
	    	section: a.NavPositions.NEW_DICTIONARY,
	    	dictId: 12,
	    	pageNum: 1 
	    })
	});

	it('.. navEditDictionary', () => {
	    expect(navigate({
	    	section: a.NavPositions.NEW_ENTRY,
	    	dictId: 3,
	    	pageNum: 2
	    }, a.navEditDictionary(123))).to.deep.equal({ 
	    	section: a.NavPositions.EDIT_DICTIONARY, 
	    	dictId: 123,
	    	pageNum: 1 
	    })
	});

	it('..navNewEntry', () => {
	    expect(navigate({
	    	section: a.NavPositions.TRAINING,
	    	dictId: 2,
	    	pageNum: 3
	    }, a.navNewEntry())).to.deep.equal({ 
	    	section: a.NavPositions.NEW_ENTRY,
	    	dictId: 2,
	    	pageNum: 3 
	    })
	});

	it('..navTraining', ()=>{
		expect(navigate({
			section: a.NavPositions.DICTIONARY,
			dictId: 1,
			pageNum: 1
		}, a.navTraining())).to.deep.equal({ 
			section: a.NavPositions.TRAINING,
			dictId: 1,
			pageNum: 1 
		})
	});

	it('..navPage', ()=>{
		expect(navigate({
			section: a.NavPositions.DICTIONARY, 
			dictId: 2, 
			pageNum: 10
		}, a.navPage(12))).to.deep.equal({
			section: a.NavPositions.DICTIONARY,
			dictId: 2, 
			pageNum: 12 
		})
	});
})
