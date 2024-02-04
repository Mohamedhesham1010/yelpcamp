if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const helmet = require('helmet');
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate')
 const methodOverride = require('method-override');
const Campground = require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');
const catchasync = require("./utils/catchAsync");

const dburi = "mongodb+srv://netninja:test1234@cluster0.j9bqysp.mongodb.net/";
const campgroundsRoutes=require('./routes/campgrounds');
const reviewsRoutes =  require('./routes/reviews');
const usersRoutes =require('./routes/users');
const flash = require('connect-flash');
const session = require("express-session")
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user');
app.use(helmet({contentSecurityPolicy:false}));
mongoose.connect(dburi,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( (result => console.log("connected")));
const sessionConfig = {
    name:"session",
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];

const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dt5wezm5j/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ]
        },
    })
);




app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser= req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes)
app.use('/',usersRoutes);

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/register',(req,res)=>{
   res.send("okkk register here")
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
