const Student = require('../models/student');

exports.create = async (req,res)=>{
    try{
    const newStudent = await Student.create({
        ID: req.body.ID,
        name: req.body.name,
        email: req.body.email
    });
    res.status(201).json({
        status:'success',
        data:{
            newStudent
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

exports.getAll = async (req,res) => {
    try{
        const students = await Student.find();

        if (!students){
        const error = new Error('students not found');
        error.statusCode = 404;
        return next(error);
        }
        
        res.status(200).json({
        status:'success',
        data:{
            students
        }
    });
    }catch(err){
        console.log('Error: ',err);
        res.status(500).json({
        status:'fail',
        message: `there is an Error: ${err}`
    });
    }
}

exports.getOne = async (req,res) => {
    try{
        const student = await Student.findById(req.body.ID);

        if (!student){
        const error = new Error('Student not found');
        error.statusCode = 404;
        return next(error);
        }
        
        res.status(200).json({
        status:'success',
        data:{
            student
        }
    });
    }catch(err){
        console.log('Error: ',err);
        res.status(500).json({
        status:'fail',
        message: `there is an Error: ${err}`
    });
    }
}

exports.update = async (req,res) => {
    try{
        const updatedStudent = await Student.findByIDAndUpdate(req.body.ID,{CGPA: req.body.CGPA});

        if (!updatedStudent){
        const error = new Error('Student not found');
        error.statusCode = 404;
        return next(error);
        }

        res.status(200).json({
            status:'success',
            data:{
                updatedStudent
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

exports.deleteStudent = async(req,res,next) => {
    try{
    const student = await Student.findByIdAndDelete(req.params.ID)

    if (!student){
        const error = new Error('Student not found');
        error.statusCode = 404;
        return next(error);
    }

    res.status(204).json({
    status: 'success',
    data: null
    });
    }catch(err){
        console.log('Error: ',err);
        res.status(500).json({
        status:'fail',
        message: `there is an Error: ${err}`
    });
    }
}




