This is a repo for [https://mnezis.herokuapp.com/](https://mnezis.herokuapp.com/).

# Specifications #

* [Functional specification](specs/func_spec.md)
* [Technical specification](specs/tech_spec.md)

# Running the app #

Commands to start the app:
```
	export MONGO_URI={URI of your MongoDB database}
	export JWT_SECRET={some random string}
	export FLASK_APP=app.py
	flask run
```

Commands to re-build fontend app from sources, which will generate `bundle.js` in `public` directory:
```
	cd client
	npm install
	npm run build
```