/*
You DONT have to import the User with your username.
Because it's a default export we can nickname it whatever we want.
So import User from "./models"; will work!
You can do User.find() or whatever you need like normal!
*/
import User from "./models/User";
import bcryptjs from "bcryptjs";

// Add your magic here!

export const profile = (req, res) => {
    if(!res.locals.loggedIn){
        return res.redirect("/login");
    }
    return res.render('profile', {pageTitle: "Profile"});
};

export const getJoin = (req, res) => {
    return res.render('join', {pageTitle: "JOIN",});
};

export const postJoin = async (req, res) => {
    const {name, username, password, password2} = req.body;
    const usernameExists = await User.exists({username});
    if(password !== password2){
        return res.status(400).render("join", {pageTitle: "JOIN",
        errorMessage: "Password confirmation does not match."});
    }
    if(usernameExists){
        return res.status(400).render("join", {pageTitle: "JOIN",
        errorMessage: "This username is already taken."});
    }

    try{
        await User.create({
            name,
            username,
            password
        });
        return res.redirect('/login');
    } catch (error){
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }
};

export const getLogin = (req, res) => {
    return res.render('login', {pageTitle: "LOGIN", });
};

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username});
    if(!user){
        return res.status(400).render("login", {pageTitle
        , errorMessage: "An account with this username does not exists."});
    }
    const ok = await bcryptjs.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {pageTitle
        , errorMessage: "Wrong Password."});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};