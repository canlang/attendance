var async = require('async');
var models = require('../lib/models');

exports.list = function(req, res, next) {
    async.waterfall([
        function(cb) {
            models.Org.find({}, cb);
        },
    ], function(err, orgs) {
        if (err) {
            return next(err);
        }
        res.render('orgs', {
            title: 'All Organizations',
            orgs: orgs,
        });
    });
};

exports.details = function(req, res, next) {
    async.waterfall([
        function(cb) {
            models.Org.findOne({slug: req.params.slug}, cb);
        },
    ], function(err, org) {
        if (err) {
            return next(err);
        }
        if (!org) {
            return res.send(404);
        }
        res.render('org', {
            title: org.name,
            flash: req.flash().info,
            description: org.description,
        });
    });
};

exports.post = function(req, res, next) {
    async.waterfall([
        function(cb) {
            var org = new models.Org({
                name: req.body.name,
                description: req.body.desc,
                slug: req.body.slug,
            });
            org.save(cb);
        },
    ], function(err) {
        if (err) {
            return next(err);
        }
        req.flash('info', 'Org created: ' + req.body.name);
        res.redirect('/orgs/' + req.body.slug);
    });
};

exports.create = function(req, res) {
    res.render('create-org', {
        title: 'Create New Org'
    });
};