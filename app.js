/**
 * Module dependencies.
 */
 
 var express = require('express');
 var compression = require('compression');
 var session = require('express-session');
 var bodyParser = require('body-parser');
 var logger = require('morgan');
 var errorHandler = require('errorhandler');
 var lusca = require('lusca');
 var dotenv = require('dotenv');
 
 var MongoStore =  require('connect-mongo')(session);
 var flash = require('express-flash')
 var path = require('path');
 var mongoose = require('mongoose');
 var expressValidator = require('express-validator');
 var sass = require('node-sass-middleware');
 var multer = require('multer');
 var upload = multer({dest:path.join(__dirname,'uploads')});
 var methodOverride = require('method-override');
 var passport = require('passport');
 
 /**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
 
 dotenv.config({silent: true});
dotenv.load({ path: '.env.example' });


 /**
  * Controllers(route handlers)
  *
  */
  var userController = require('./controllers/user');
  
  /**
   * API keys and Passport configuration
   *
   */
   var passportConfig = require('./config/passport')
   /**
    * create express server
    *
    */
    
    var app = express();
    
    /**
     * connect to MongoDB
     *
     */
     var mongouri = process.env.MONGODB_URI || process.env.MONGOLAB_URI;
     mongoose.connect(mongouri,function(){
      console.log('MongoDB now is connected to'+ mongouri);
     });
     
     console.log('MongoDB now is connected to'+ mongouri);
     mongoose.connection.on('error',()=>{
       console.log('MongoDB Connection Error.Please make sure that the MONGODB is running');
       
       process.exit(1);
     });
     
     /**
      * express configuration
      *
      */
      
      app.set('port',process.env.PORT || 3000);
      
      app.set('views',path.join(__dirname,'views'));
      
      app.set('view engine','pug');
      
      app.use(compression());
      
      app.use(sass({
        src:path.join(__dirname,'public'),
        dest:path.join(__dirname,'public'),
        sourceMap: true
      }));
      
      app.use(logger('dev'));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended:true}));
      app.use(expressValidator());
      app.use(methodOverride());
      app.use(session({
        resave:true,
        saveUninitialized: true,
        secret:process.env.SESSION_SECRET,
        store: new MongoStore({
          url:process.env.MONGODB || process.env.MONGOLAB_URI,
          autoReconnect:true
        })
      }));
      
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(flash());
      app.use(function(req,res,next){
       if(req.path.match(/^\/api\//)){
        next();
       }else {
        lusca.csrf()(req,res,next);
       }
      });
      
      app.use(lusca.xframe('SAMEORIGIN'));
      app.use(lusca.xssProtection(true));
      app.use(function(req,res,next){
       res.locals.user = req.user;
       next();
      });
      
      app.use(function(req, res, next) {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  }
  next();
});

  app.use(express.static(path.join(__dirname,'public'),{maxAge:31557600000}));

  /**
   * define routes 
   *
   */
   
   var routes = require('./routes/index');
   var api = require('./api/index');
   
   app.use('/',routes);
   app.use('/api',api);
 
  
   
   /**
    * Error Handler
    *
    */
     app.use(errorHandler());
     
     /**
      * start Express Server
      *
      */
      
      app.listen(app.get('port'), () => {
        console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
      });
      
      
      module.exports =app;