const User = require('../models/user');

exports.create = async (req,res)=>{
    try{
    const newUser = await User.create({
        ID: req.body.ID,
        name: req.body.name,
        email: req.body.email
    });
    res.status(201).json({
        status:'success',
        data:{
            user: newUser
        }
    });
    }catch(err){
        console.log('Error: ',err);
        res.status(500).json({
        status:'fail',
        message: `there is an Error: ${err}`
    });
    };
};

