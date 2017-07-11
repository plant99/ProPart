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

router.get('/user_applied_invites/:id', function(req, res, next){
	var applied_invites_to_be_sent = [] ;
	User.findOne({_id: req.params.id}, function(err, user){
		var applied_invites = user.applied_invitations ;		
		var index = 0;
		for(var i=0 ;i< applied_invites.length ;i++){
			Invite.findOne({_id: applied_invites[i].id}, function(err, invite){
				applied_invites_to_be_sent.push(invite)
				index++;
				if(index === applied_invites.length){
					res.json({success: true, user: req.decoded._doc , applied_invites: applied_invites_to_be_sent})
				}
			})
		}
	})
})
router.get('/user_created_invites/:id', function(req, res, next){
	User.findOne({_id: req.params.id}, function(err, user){
		var active_invites = user.active_invitations ;
		var index=0 ;
		var created_invites_to_be_sent = [] ;
		for(var i=0 ;i<active_invites.length;i++){
			Invite.findOne({_id: active_invites[i]}, function(err, invite){
				index++ ;
				created_invites_to_be_sent.push(invite) ;
				if(index ===  active_invites.length){
					res.json({success:true, created_invites:created_invites_to_be_sent, user: req.decoded._doc})
				}else{
					console.log(index, active_invites.length)
				}
			})
		}
	})
})
module.exports = router ;