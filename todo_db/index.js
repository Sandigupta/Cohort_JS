const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Sandeep";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// import z from 'zod';
const { z } = require('zod');

mongoose.connect("mongodb+srv://sandeep8858970:Y9rnP1YyxOv4T6zX@cluster1.kktuw.mongodb.net/todo-app-collection");
const app = express();
app.use(express.json());

app.post('/signup', async function (req, res) {
    // schema for req body
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        name: z.string().min(3).max(100),
        password: z.string().max(30).min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[\W_]/, "Password must contain at least one special character")
    });

    const parsedDataWithSuccess = await requiredBody.safeParse(req.body);
    if (!parsedDataWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        });
        return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let errorThrown = false;
    try {
        const hashpassword = await bcrypt.hash(password, 10);
        console.log(hashpassword);

        await UserModel.create({
            email: email,
            password: hashpassword,
            name: name
        });
    } catch (e) {
        res.json({
            message: "User already exists"
        });
        errorThrown = true;
    }

    if (!errorThrown) {
        res.json({
            message: "You are logged in"
        });
    }
});

app.post('/singin',async function (req, res)  {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
        // password:password
    })
    
    if (!user) {
        res.status(403).json({
            message:"User does not exist in our database"
        })
        return;
    } 

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
        const token = jwt.sign({
          id:user._id   
        }, JWT_SECRET);
        res.json({
            token:token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
        
}); 

app.post('/todo',auth, function (req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;
    TodoModel.create({
        userId,
        title,
        done

    });
    res.send({
       userId:userId
    })
});

app.get('/todos', auth,async function (req, res){
    const userId = req.userId;

    const todos= await TodoModel.find({
        userId:userId
    })

    res.json({
        todos
    })
});


function auth(req, res,next) {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded) {
        req.userId = decoded.id;
        next();
    } else {
        res.status(404).send({
            message:"User does not exist"
        })
    }
    
}

app.listen(3000);