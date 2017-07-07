var express = require('express') ;
var router = express.Router() ;
router.get('/', function(req, res, next){
	Invite.find({}, function(err, invites){
		res.json({invites:invites,  user: req.decoded._doc})
	})
})
router.get('/:category',function(req, res, next){
	Invite.find({category: req.params.category}, function(err, invites){
		if(invites.length){
			res.json({success:true, invites:invites, user: req.decoded._doc})
		}else{
			res.json({success: false})
		}
	})
})
module.exports = router ;