const express = require('express');
const cors = require('cors');
const exphbs = require('express-handlebars'); 

const methodOverride = require('method-override');
const expressSession = require('express-session');

const { dbConnection } = require('../database/config');

const formatMessage = require('../helpers/formatMessages');

const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('../helpers/usersFunctions');

class Server {
    constructor() {
        this.app = express();
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);    
        this.port = process.env.PORT;
        this.path = require('path');
        this.passport = require('passport');
        this.cookie = require('cookie-parser');
        this.flash = require('connect-flash');
        
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/user/login';
        this.loginPath = '/';
        this.mainPath = '/';
        
        this.conectarDB();
        this.middlewares();
        this.sockets();

        this.settings();
        this.routes();
    };

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use(express.static(this.path.join(__dirname, '../public')));
        this.app.set('public', this.path.join(__dirname + 'public'))
        this.app.use(this.cookie());

        this.app.use(express.urlencoded({extended: true}));
        this.app.use(methodOverride('_method'));
        this.app.use(this.cookie('MiCL4VE5ECRET4'))
        this.app.use(expressSession({
            secret: 'MiCL4VE5ECRET4',
            resave: true,
            saveUninitialized: true
        }));

        this.app.use(this.flash());

        this.app.use((req,res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            
            next()
        })

        this.app.use(this.passport.initialize());
        this.app.use(this.passport.session());

        this.app.use(express.static(this.path.join(__dirname, '..')));
        this.app.use(express.static(this.path.join(__dirname, '../views')));
       
    };

    settings() {

        this.app.engine('.hbs', exphbs.engine({
            defaultLayout: 'main',
            layoutsDir: this.path.join(this.app.get('views'), 'layouts'),
            partialsDir: this.path.join(this.app.get('views'),  'partials'),
            extname: '.hbs'
        }));

        this.app.set('view engine', '.hbs');
        
    };

    routes() {
        this.app.use(this.mainPath, require('../routes/main-route')); 
        this.app.use( this.loginPath, require('../routes/usuarios'));
        this.app.use( this.usuariosPath, require('../routes/usuarios'));
    };

    sockets() {
        this.io.on("connection", (socket) => {
            const botName = 'ChatBot'
          
            socket.on("joinRoom", ({ username, room }) => {
              const user = userJoin(username, room);
          
              socket.join(user.room);
          
              socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));
         
              socket.broadcast.to(user.room).emit("message",formatMessage(botName, `${user.username} has joined the chat`));
          
              this.io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),             
              });
         
              socket.on("chatMessage", (msg) => {

                this.io.to(user.room).emit("message", formatMessage(user.username, msg));
              });
         
          });
          
            socket.on("disconnect", () => {
              const user = userLeave(socket.id);
        
              if (user) {
                this.io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
                this.io.to(user.room).emit("roomUsers", {
                  room: user.room,
                  users: getRoomUsers(user.room),
                });
              }
            });
        });
    };

    listen() {
        this.server.listen( this.port, () => {
            console.log('Server running on port:', this.port );
        });
    };
};

module.exports = Server; 