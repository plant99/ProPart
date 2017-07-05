var $create = $('.create')
var $browse = $('.browse')
var $create_board = $('.create-board')
var $browse_board = $('.browse-board')
var $submit = $('.submit')
var invites_container = document.querySelector('.invites_container')
$create.click(function(){
	$create_board.css('display', 'block')
	$browse_board.css('display','none')
})

$browse.click(function(){
	$create_board.css('display', 'none')
	$browse_board.css('display', 'block')
	// load invites after post requests
	$.get('/get_data/', function(response){
		var invites = response.invites ;
		console.log(invites)
		for(var i=0;i<invites.length;i++){
			var div = document.createElement('div') ;
			div.setAttribute('class','invite') ;
			div.setAttribute('data',invites[i]._id) ;
			var h4 = document.createElement('h4') ;
			h4.innerHTML = invites[i].author.name ;
			var image = document.createElement('img') ;
			image.src = '/serve_image/' + invites[i].author.image ;
			var detailsContainer = document.createElement('div') ;
			detailsContainer.setAttribute('class','details_container') ;
			var h3 = document.createElement('h3') ;
			h3.innerHTML = invites[i].title ;
			h3.setAttribute('class','invite_header')
			var p = document.createElement('p') ;
			var button = document.createElement('button') ;
			var required = document.createElement('p') ;
			required.innerHTML = 'Number of partners required: ' + invites[i].requirements ;
			required.setAttribute('class','required')
			button.innerHTML = 'Apply' ;
			p.innerHTML = invites[i].description ;
			detailsContainer.appendChild(h3) ;
			detailsContainer.appendChild(p) ;
			detailsContainer.appendChild(required) ;
			div.appendChild(image)
			div.appendChild(h4) ;
			div.appendChild(detailsContainer) ;
			div.appendChild(button)
			invites_container.appendChild(div) ;
		}
	})
})

//add invite handler

$submit.click(function(){
	$.post('/add_data/invite',{
		category: $('.category').val(),
		title: $('.title').val(),
		description: $('.description').val(),
		requirements:$('.requirements').val()
	}, function(response){
		clearInvitationFields(response)
	})
})


// function to clear the fields in add invite form
function clearInvitationFields(response){
	if(response.success === true){
		$('.messageInternal').html('Invite was successfully saved!') ;
	}else{
		$('.messageInternal').html('Invite wasn\'t saved!') ;
	}
	$('.category').val('tech_proj') ;
	$('.title').val('') ;
	$('.description').val('') ;
	$('.requirements').val('') ;
	setTimeout(function(){
		$('.messageInternal').html('')
	}, 3000)
}

//categoryFilter event handlers
var categoryFilter = document.querySelector('.categoryFilter') ;
categoryFilter.onchange = function(){
	$.get('/get_data/'+categoryFilter.value,function(response){
		if(response.success){
			var invites = response.invites ;
			invites_container.innerHTML = '' ;
			for(var i=0;i<invites.length;i++){
				var div = document.createElement('div') ;
				div.setAttribute('class','invite') ;
				div.setAttribute('data',invites[i]._id) ;
				var h4 = document.createElement('h4') ;
				h4.innerHTML = invites[i].author.name ;
				var image = document.createElement('img') ;
				image.src = '/serve_image/' + invites[i].author.image ;
				var detailsContainer = document.createElement('div') ;
				detailsContainer.setAttribute('class','details_container') ;
				var h3 = document.createElement('h3') ;
				h3.innerHTML = invites[i].title ;
				h3.setAttribute('class','invite_header')
				var p = document.createElement('p') ;
				var button = document.createElement('button') ;
				var required = document.createElement('p') ;
				required.innerHTML = 'Number of partners required: ' + invites[i].requirements ;
				required.setAttribute('class','required')
				button.innerHTML = 'Apply' ;
				p.innerHTML = invites[i].description ;
				detailsContainer.appendChild(h3) ;
				detailsContainer.appendChild(p) ;
				detailsContainer.appendChild(required) ;
				div.appendChild(image)
				div.appendChild(h4) ;
				div.appendChild(detailsContainer) ;
				div.appendChild(button)
				invites_container.appendChild(div) ;
			}
		}else{
			invites_container.innerHTML = ''
			var p = document.createElement('p')
			p.innerHTML = 'Oops, no invites come under this category' ;
			invites_container.appendChild(p)
		}
	})
}