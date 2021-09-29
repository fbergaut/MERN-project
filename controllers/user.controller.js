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

module.exports.deleteUser = async(req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown :" + req.params.id);

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.follow = async(req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send("ID unknown :" + req.params.id);

    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id, { $addToSet: { following: req.body.idToFollow } }, { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return resstatus(400).json(err);
            }
        );
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow, { $addToSet: { followers: req.params.id } },
            (err, docs) => {
                // if (!err) res.status(201).json(docs);
                if (err) return resstatus(400).json(err);
            }
        );
    } catch {
        return res.status(500).json({ message: err });
    }
};

module.exports.unfollow = async(req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send("ID unknown :" + req.params.id);

    try {
        // remove from the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id, { $pull: { following: req.body.idToUnfollow } }, { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return resstatus(400).json(err);
            }
        );
        // remove from following list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow, { $pull: { followers: req.params.id } },
            (err, docs) => {
                // if (!err) res.status(201).json(docs);
                if (err) return resstatus(400).json(err);
            }
        );
    } catch {
        return res.status(500).json({ message: err });
    }
};