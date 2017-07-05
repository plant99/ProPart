var express = require('express') ;
var router = express.Router() ;
router.get('/', function(req, res, next){
	Invite.find({}, function(err, invites){
		res.json({invites:invites})
	})
})
router.get('/:category',function(req, res, next){
	Invite.find({category: req.params.category}, function(err, invites){
		if(invites.length){
			res.json({success:true, invites:invites})
		}else{
			res.json({success: false})
		}
	})
})
module.exports = router ;