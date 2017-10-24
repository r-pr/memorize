Commands to start the app:
```
	export MONGO_URI={URI of your MongoDB database}
	export FLASK_APP=app.py
	flask run
```

Commands to re-build fontend app from sources, which will generate `bundle.js` in `public` directory:
```
	cd client
	npm install
	npm run build
```