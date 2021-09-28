const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async(req, res) => {
    const users = await UserModel.find().select('-password'); //'-password' permet de ne pas faire transiter le password dans la requête
    res.status(200).json(users);
};

module.exports.getOneUser = (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown :' + req.params.id)
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID unknown:' + err);
    }).select('-password');
};

module.exports.updateUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);
    try {
        await UserModel.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                bio: req.body.bio
            }
        }, {
            new: true,
            upsert: true,
            setDefaultOnInsert: true
        }, (err, docs) => {
            if (!err) return res.send(docs);
            if (err) return res.status(500).send({ message: err })
        })
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};